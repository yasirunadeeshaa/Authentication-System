package backend.social_media_application.repository;

import backend.social_media_application.model.Education;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EducationRepository extends MongoRepository<Education, String> {
    List<Education> findByUserId(String userId);
    void deleteByUserIdAndId(String userId, String id);
}