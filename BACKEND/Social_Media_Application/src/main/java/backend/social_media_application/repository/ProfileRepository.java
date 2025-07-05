package backend.social_media_application.repository;

import backend.social_media_application.model.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {
    Optional<Profile> findByUserId(String userId);

    // Add this new method to find all profiles for a userId
    List<Profile> findAllByUserId(String userId);
}