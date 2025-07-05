package backend.social_media_application.repository;

import backend.social_media_application.model.PrivacySettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PrivacySettingsRepository extends MongoRepository<PrivacySettings, String> {
    Optional<PrivacySettings> findByUserId(String userId);
}