package backend.social_media_application.service;

import backend.social_media_application.dto.profile.*;
import backend.social_media_application.dto.mapper.ProfileMapper;
import backend.social_media_application.exception.BadRequestException;
import backend.social_media_application.exception.ResourceNotFoundException;
import backend.social_media_application.model.*;
import backend.social_media_application.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final EducationRepository educationRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final PrivacySettingsRepository privacySettingsRepository;
    private final ProfileMapper profileMapper;
    private final FileStorageService fileStorageService;
    private final PrivacySettingsService privacySettingsService;

    @Autowired
    public ProfileService(UserRepository userRepository,
                          ProfileRepository profileRepository,
                          EducationRepository educationRepository,
                          WorkExperienceRepository workExperienceRepository,
                          PrivacySettingsRepository privacySettingsRepository,
                          ProfileMapper profileMapper,
                          FileStorageService fileStorageService,
                          PrivacySettingsService privacySettingsService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.educationRepository = educationRepository;
        this.workExperienceRepository = workExperienceRepository;
        this.privacySettingsRepository = privacySettingsRepository;
        this.profileMapper = profileMapper;
        this.fileStorageService = fileStorageService;
        this.privacySettingsService = privacySettingsService;
    }

    /**
     * Get a user's profile with privacy checks
     */
    public ProfileDTO getProfile(String username, String currentUserId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        // Check if the requested profile is the current user's profile
        boolean isOwnProfile = user.getId().equals(currentUserId);

        // Get the profile data
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElse(null);

        // If not viewing own profile, apply privacy filters
        if (!isOwnProfile && profile != null) {
            PrivacySettings privacySettings = privacySettingsRepository.findByUserId(user.getId())
                    .orElse(new PrivacySettings());

            // Check profile visibility
            if ("ONLY_ME".equals(privacySettings.getProfileVisibility())) {
                throw new BadRequestException("This profile is private");
            }

            // Additional privacy checks would be applied here
            // For now, we're allowing access to the basic profile
        }

        // Get education and work experiences
        List<Education> educations = educationRepository.findByUserId(user.getId());
        List<WorkExperience> workExperiences = workExperienceRepository.findByUserId(user.getId());

        // Convert to DTO
        return profileMapper.toProfileDTO(user, profile, educations, workExperiences);
    }

    /**
     * Create or update a user's profile
     */
    @Transactional
    public ProfileDTO updateProfile(String userId, ProfileUpdateRequest updateRequest) {
        User user = userRepository.findByEmail(userId)
                .orElseGet(() -> userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id/email: " + userId)));

        // Get or create profile - MODIFIED TO HANDLE DUPLICATE PROFILES
        Profile profile;
        try {
            // Try to find the unique profile
            profile = profileRepository.findByUserId(userId)
                    .orElse(null);
        } catch (IncorrectResultSizeDataAccessException e) {
            // Handle case where multiple profiles exist for the user
            List<Profile> profiles = profileRepository.findAllByUserId(userId);
            profile = profiles.isEmpty() ? null : profiles.get(0);
        }

        // If no profile found, create a new one
        if (profile == null) {
            profile = new Profile();
            profile.setUserId(userId);
            profile.setCreatedAt(LocalDateTime.now());
        }

        // Update profile fields
        profileMapper.updateProfileFromRequest(profile, updateRequest);
        profile.setUpdatedAt(LocalDateTime.now());

        // Save profile
        profile = profileRepository.save(profile);

        // Update user's profileId if necessary
        if (user.getProfileId() == null) {
            user.setProfileId(profile.getId());
            userRepository.save(user);
        }

        // Get related data
        List<Education> educations = educationRepository.findByUserId(userId);
        List<WorkExperience> workExperiences = workExperienceRepository.findByUserId(userId);

        // Return updated profile
        return profileMapper.toProfileDTO(user, profile, educations, workExperiences);
    }

    /**
     * Upload avatar image
     */
    @Transactional
    public String uploadAvatar(String userId, MultipartFile file) {
        User user = userRepository.findByEmail(userId)
                .orElseGet(() -> userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id/email: " + userId)));

        // Generate a unique filename
        String filename = "avatar_" + userId + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Store the file
        String filePath = fileStorageService.storeFile(file, "avatars", filename);

        // Update user's avatar
        user.setAvatar(filePath);
        userRepository.save(user);

        return filePath;
    }

    /**
     * Upload cover photo
     */
    @Transactional
    public String uploadCoverPhoto(String userId, MultipartFile file) {
        // Find all profiles for this user
        List<Profile> userProfiles = profileRepository.findAllByUserId(userId);

        Profile profile;
        if (userProfiles.isEmpty()) {
            // Create new profile if none exists
            profile = new Profile();
            profile.setUserId(userId);
            profile.setCreatedAt(LocalDateTime.now());
        } else {
            // Use the first profile if multiple exist
            profile = userProfiles.get(0);

            // Optionally: Log a warning about duplicate profiles
            if (userProfiles.size() > 1) {
                System.out.println("WARNING: Found " + userProfiles.size() +
                        " profiles for user " + userId + ". Using the first one.");
            }
        }

        // Generate a unique filename
        String filename = "cover_" + userId + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Store the file
        String filePath = fileStorageService.storeFile(file, "covers", filename);

        // Update profile's cover photo
        profile.setCoverPhoto(filePath);
        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.save(profile);

        return filePath;
    }

    /**
     * Add education entry
     */
    @Transactional
    public EducationDTO addEducation(String userId, EducationDTO educationDTO) {
        // Ensure user exists
        User user = userRepository.findByEmail(userId)
                .orElseGet(() -> userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id/email: " + userId)));

        // Convert DTO to entity
        Education education = profileMapper.toEducation(educationDTO, userId);

        // Save education
        education = educationRepository.save(education);

        // Return saved entity as DTO
        return profileMapper.toEducationDTO(education);
    }

    /**
     * Update education entry
     */
    @Transactional
    public EducationDTO updateEducation(String userId, String educationId, EducationDTO educationDTO) {
        // Find existing education entry
        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found with id: " + educationId));

        // Verify ownership
        if (!education.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this education entry");
        }

        // Update fields
        education.setInstitution(educationDTO.getInstitution());
        education.setDegree(educationDTO.getDegree());
        education.setFieldOfStudy(educationDTO.getFieldOfStudy());
        education.setStartDate(educationDTO.getStartDate());
        education.setEndDate(educationDTO.getEndDate());
        education.setCurrent(educationDTO.isCurrent());
        education.setDescription(educationDTO.getDescription());

        // Save updated entity
        education = educationRepository.save(education);

        // Return updated entity as DTO
        return profileMapper.toEducationDTO(education);
    }

    /**
     * Delete education entry
     */
    @Transactional
    public void deleteEducation(String userId, String educationId) {
        // Find existing education entry
        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found with id: " + educationId));

        // Verify ownership
        if (!education.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this education entry");
        }

        // Delete education
        educationRepository.delete(education);
    }

    /**
     * Add work experience entry
     */
    @Transactional
    public WorkExperienceDTO addWorkExperience(String userId, WorkExperienceDTO workExperienceDTO) {
        // Ensure user exists
        User user = userRepository.findByEmail(userId)
                .orElseGet(() -> userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id/email: " + userId)));

        // Convert DTO to entity
        WorkExperience workExperience = profileMapper.toWorkExperience(workExperienceDTO, userId);

        // Save work experience
        workExperience = workExperienceRepository.save(workExperience);

        // Return saved entity as DTO
        return profileMapper.toWorkExperienceDTO(workExperience);
    }

    /**
     * Update work experience entry
     */
    @Transactional
    public WorkExperienceDTO updateWorkExperience(String userId, String workExperienceId, WorkExperienceDTO workExperienceDTO) {
        // Find existing work experience entry
        WorkExperience workExperience = workExperienceRepository.findById(workExperienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Work experience not found with id: " + workExperienceId));

        // Verify ownership
        if (!workExperience.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this work experience entry");
        }

        // Update fields
        workExperience.setCompany(workExperienceDTO.getCompany());
        workExperience.setPosition(workExperienceDTO.getPosition());
        workExperience.setLocation(workExperienceDTO.getLocation());
        workExperience.setStartDate(workExperienceDTO.getStartDate());
        workExperience.setEndDate(workExperienceDTO.getEndDate());
        workExperience.setCurrent(workExperienceDTO.isCurrent());
        workExperience.setDescription(workExperienceDTO.getDescription());

        // Save updated entity
        workExperience = workExperienceRepository.save(workExperience);

        // Return updated entity as DTO
        return profileMapper.toWorkExperienceDTO(workExperience);
    }

    /**
     * Delete work experience entry
     */
    @Transactional
    public void deleteWorkExperience(String userId, String workExperienceId) {
        // Find existing work experience entry
        WorkExperience workExperience = workExperienceRepository.findById(workExperienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Work experience not found with id: " + workExperienceId));

        // Verify ownership
        if (!workExperience.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this work experience entry");
        }

        // Delete work experience
        workExperienceRepository.delete(workExperience);
    }

    /**
     * Add a life event
     */
    @Transactional
    public ProfileDTO addLifeEvent(String userId, Profile.LifeEvent lifeEvent) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Profile newProfile = new Profile();
                    newProfile.setUserId(userId);
                    newProfile.setCreatedAt(LocalDateTime.now());
                    return newProfile;
                });

        // Generate ID for the life event
        lifeEvent.setId(UUID.randomUUID().toString());

        // Add life event to profile
        profile.getLifeEvents().add(lifeEvent);
        profile.setUpdatedAt(LocalDateTime.now());

        // Save profile
        profile = profileRepository.save(profile);

        // Get user and related data
        User user = userRepository.findByEmail(userId)
                .orElseGet(() -> userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id/email: " + userId)));
        List<Education> educations = educationRepository.findByUserId(userId);
        List<WorkExperience> workExperiences = workExperienceRepository.findByUserId(userId);

        // Return updated profile
        return profileMapper.toProfileDTO(user, profile, educations, workExperiences);
    }

    /**
     * Delete a life event
     */
    @Transactional
    public ProfileDTO deleteLifeEvent(String userId, String lifeEventId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        // Find and remove the life event
        boolean removed = profile.getLifeEvents().removeIf(event -> event.getId().equals(lifeEventId));

        if (!removed) {
            throw new ResourceNotFoundException("Life event not found with id: " + lifeEventId);
        }

        profile.setUpdatedAt(LocalDateTime.now());

        // Save profile
        profile = profileRepository.save(profile);

        // Get user and related data
        User user = userRepository.findByEmail(userId)
                .orElseGet(() -> userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id/email: " + userId)));
        List<Education> educations = educationRepository.findByUserId(userId);
        List<WorkExperience> workExperiences = workExperienceRepository.findByUserId(userId);

        // Return updated profile
        return profileMapper.toProfileDTO(user, profile, educations, workExperiences);
    }
}