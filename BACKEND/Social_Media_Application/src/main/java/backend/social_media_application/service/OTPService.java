package backend.social_media_application.service;

import backend.social_media_application.model.OTP;
import backend.social_media_application.repository.OTPRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class OTPService {

    private final OTPRepository otpRepository;
    private final EmailService emailService;

    public OTPService(OTPRepository otpRepository, EmailService emailService) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    public String generateAndSendOTP(String email) {
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otpCode = RandomStringUtils.randomNumeric(6);

        // Print OTP to console for testing
        System.out.println("===========================================");
        System.out.println("OTP for " + email + ": " + otpCode);
        System.out.println("===========================================");

        // Save OTP to database
        OTP otp = new OTP(email, otpCode, 10); // 10 minutes expiry
        otpRepository.save(otp);

        // Send email
        try {
            emailService.sendOTPEmail(email, otpCode);
            System.out.println("OTP email sent successfully to: " + email);
        } catch (Exception e) {
            System.out.println("Failed to send OTP email: " + e.getMessage());
            // Still return the OTP for testing even if email fails
        }

        return otpCode;
    }

    public boolean verifyOTP(String email, String otpCode) {
        System.out.println("Verifying OTP for " + email + ": " + otpCode);

        OTP otp = otpRepository.findByEmailAndOtpAndUsedFalse(email, otpCode)
                .orElse(null);

        if (otp == null) {
            System.out.println("OTP not found or already used");
            return false;
        }

        if (otp.isExpired()) {
            System.out.println("OTP has expired");
            return false;
        }

        otp.setUsed(true);
        otpRepository.save(otp);
        System.out.println("OTP verified successfully");
        return true;
    }
}
