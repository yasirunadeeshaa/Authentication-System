package backend.social_media_application.controller;

import backend.social_media_application.dto.profile.*;
import backend.social_media_application.model.Profile;
import backend.social_media_application.service.ProfileService;
import backend.social_media_application.util.SecurityUtil;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {
    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);

    private final ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable String username) {
        try {
            logger.info("Fetching profile for username: {}", username);
            String currentUserId = SecurityUtil.getCurrentUserId();
            ProfileDTO profileDTO = profileService.getProfile(username, currentUserId);
            return ResponseEntity.ok(profileDTO);
        } catch (Exception e) {
            logger.error("Error fetching profile for username: {}", username, e);
            throw e;
        }
    }

    @PatchMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest updateRequest) {
        try {
            logger.info("Updating profile with data: {}", updateRequest);
            String currentUserId = SecurityUtil.getCurrentUserId();

            if (currentUserId == null) {
                logger.error("No authenticated user found for profile update");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "Authentication required"));
            }

            logger.debug("Current user ID: {}", currentUserId);
            ProfileDTO profileDTO = profileService.updateProfile(currentUserId, updateRequest);
            return ResponseEntity.ok(profileDTO);
        } catch (Exception e) {
            logger.error("Error updating profile: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            logger.info("Received avatar upload request for user: {}", currentUserId);
            logger.info("File details - Name: {}, Size: {}, ContentType: {}",
                    file.getOriginalFilename(), file.getSize(), file.getContentType());

            String filePath = profileService.uploadAvatar(currentUserId, file);
            logger.info("Avatar uploaded successfully to: {}", filePath);
            return ResponseEntity.ok(filePath);
        } catch (Exception e) {
            logger.error("Error uploading avatar: ", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to upload avatar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping(value = "/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadCoverPhoto(@RequestParam("file") MultipartFile file) {
        try {
            String currentUserId = SecurityUtil.getCurrentUserId();
            logger.info("Received cover photo upload request for user: {}", currentUserId);
            logger.info("File details - Name: {}, Size: {}, ContentType: {}",
                    file.getOriginalFilename(), file.getSize(), file.getContentType());

            String filePath = profileService.uploadCoverPhoto(currentUserId, file);
            logger.info("Cover photo uploaded successfully to: {}", filePath);
            return ResponseEntity.ok(filePath);
        } catch (Exception e) {
            logger.error("Error uploading cover photo: ", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to upload cover photo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/education")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EducationDTO> addEducation(@Valid @RequestBody EducationDTO educationDTO) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        EducationDTO savedDTO = profileService.addEducation(currentUserId, educationDTO);
        return ResponseEntity.ok(savedDTO);
    }

    @PutMapping("/education/{educationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EducationDTO> updateEducation(
            @PathVariable String educationId,
            @Valid @RequestBody EducationDTO educationDTO) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        EducationDTO updatedDTO = profileService.updateEducation(currentUserId, educationId, educationDTO);
        return ResponseEntity.ok(updatedDTO);
    }

    @DeleteMapping("/education/{educationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteEducation(@PathVariable String educationId) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        profileService.deleteEducation(currentUserId, educationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/work")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WorkExperienceDTO> addWorkExperience(
            @Valid @RequestBody WorkExperienceDTO workExperienceDTO) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        WorkExperienceDTO savedDTO = profileService.addWorkExperience(currentUserId, workExperienceDTO);
        return ResponseEntity.ok(savedDTO);
    }

    @PutMapping("/work/{workExperienceId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WorkExperienceDTO> updateWorkExperience(
            @PathVariable String workExperienceId,
            @Valid @RequestBody WorkExperienceDTO workExperienceDTO) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        WorkExperienceDTO updatedDTO = profileService.updateWorkExperience(
                currentUserId, workExperienceId, workExperienceDTO);
        return ResponseEntity.ok(updatedDTO);
    }

    @DeleteMapping("/work/{workExperienceId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteWorkExperience(@PathVariable String workExperienceId) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        profileService.deleteWorkExperience(currentUserId, workExperienceId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/life-events")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileDTO> addLifeEvent(@Valid @RequestBody Profile.LifeEvent lifeEvent) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        ProfileDTO profileDTO = profileService.addLifeEvent(currentUserId, lifeEvent);
        return ResponseEntity.ok(profileDTO);
    }

    @DeleteMapping("/life-events/{lifeEventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileDTO> deleteLifeEvent(@PathVariable String lifeEventId) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        ProfileDTO profileDTO = profileService.deleteLifeEvent(currentUserId, lifeEventId);
        return ResponseEntity.ok(profileDTO);
    }
}