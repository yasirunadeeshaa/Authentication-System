package backend.social_media_application.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOTPEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Email Verification - Social Media App");
        message.setText("Your OTP for email verification is: " + otp +
                "\n\nThis OTP will expire in 10 minutes." +
                "\n\nIf you didn't request this, please ignore this email.");

        mailSender.send(message);
    }
}