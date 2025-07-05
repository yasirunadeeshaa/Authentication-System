package backend.social_media_application.repository;

import backend.social_media_application.model.WorkExperience;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkExperienceRepository extends MongoRepository<WorkExperience, String> {
    List<WorkExperience> findByUserId(String userId);
    void deleteByUserIdAndId(String userId, String id);
}