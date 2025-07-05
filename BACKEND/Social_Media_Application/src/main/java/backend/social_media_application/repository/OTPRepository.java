package backend.social_media_application.repository;

import backend.social_media_application.model.OTP;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OTPRepository extends MongoRepository<OTP, String> {
    Optional<OTP> findByEmailAndOtpAndUsedFalse(String email, String otp);
    void deleteByEmail(String email);
}
