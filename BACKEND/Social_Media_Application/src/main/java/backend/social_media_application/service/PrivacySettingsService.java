package backend.social_media_application.service;

import backend.social_media_application.dto.profile.PrivacySettingsDTO;
import backend.social_media_application.dto.mapper.ProfileMapper;
import backend.social_media_application.exception.BadRequestException;
import backend.social_media_application.exception.ResourceNotFoundException;
import backend.social_media_application.model.PrivacySettings;
import backend.social_media_application.model.User;
import backend.social_media_application.repository.PrivacySettingsRepository;
import backend.social_media_application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class PrivacySettingsService {

    private final UserRepository userRepository;
    private final PrivacySettingsRepository privacySettingsRepository;
    private final ProfileMapper profileMapper;

    @Autowired
    public PrivacySettingsService(UserRepository userRepository,
                                  PrivacySettingsRepository privacySettingsRepository,
                                  ProfileMapper profileMapper) {
        this.userRepository = userRepository;
        this.privacySettingsRepository = privacySettingsRepository;
        this.profileMapper = profileMapper;
    }

    /**
     * Get privacy settings for a user
     */
    public PrivacySettingsDTO getPrivacySettings(String userId) {
        PrivacySettings privacySettings = privacySettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // Create default privacy settings if not exist
                    PrivacySettings newSettings = new PrivacySettings();
                    newSettings.setUserId(userId);
                    return privacySettingsRepository.save(newSettings);
                });

        return profileMapper.toPrivacySettingsDTO(privacySettings);
    }

    /**
     * Update privacy settings
     */
    @Transactional
    public PrivacySettingsDTO updatePrivacySettings(String userId, PrivacySettingsDTO updatedSettings) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        PrivacySettings privacySettings = privacySettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    PrivacySettings newSettings = new PrivacySettings();
                    newSettings.setUserId(userId);
                    return newSettings;
                });

        // Update settings fields
        if (updatedSettings.getDefaultPostVisibility() != null) {
            validateVisibility(updatedSettings.getDefaultPostVisibility());
            privacySettings.setDefaultPostVisibility(updatedSettings.getDefaultPostVisibility());
        }

        if (updatedSettings.getProfileVisibility() != null) {
            validateVisibility(updatedSettings.getProfileVisibility());
            privacySettings.setProfileVisibility(updatedSettings.getProfileVisibility());
        }

        if (updatedSettings.getFriendListVisibility() != null) {
            validateVisibility(updatedSettings.getFriendListVisibility());
            privacySettings.setFriendListVisibility(updatedSettings.getFriendListVisibility());
        }

        if (updatedSettings.getSectionVisibility() != null && !updatedSettings.getSectionVisibility().isEmpty()) {
            // Validate each section visibility setting
            for (Map.Entry<String, String> entry : updatedSettings.getSectionVisibility().entrySet()) {
                validateVisibility(entry.getValue());
            }

            // Update section visibility
            Map<String, String> currentSectionVisibility = privacySettings.getSectionVisibility();
            currentSectionVisibility.putAll(updatedSettings.getSectionVisibility());
            privacySettings.setSectionVisibility(currentSectionVisibility);
        }

        // Set boolean privacy options
        privacySettings.setAllowSearchEngines(updatedSettings.isAllowSearchEngines());
        privacySettings.setShowInFriendSuggestions(updatedSettings.isShowInFriendSuggestions());
        privacySettings.setAllowFriendRequests(updatedSettings.isAllowFriendRequests());
        privacySettings.setAllowDataForRecommendations(updatedSettings.isAllowDataForRecommendations());

        // Save updated settings
        privacySettings = privacySettingsRepository.save(privacySettings);

        // Update user's privacySettingsId if necessary
        if (user.getPrivacySettingsId() == null) {
            user.setPrivacySettingsId(privacySettings.getId());
            userRepository.save(user);
        }

        return profileMapper.toPrivacySettingsDTO(privacySettings);
    }

    /**
     * Block a user
     */
    @Transactional
    public void blockUser(String userId, String userToBlockId, String reason) {
        if (userId.equals(userToBlockId)) {
            throw new BadRequestException("You cannot block yourself");
        }

        // Ensure both users exist
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userRepository.findById(userToBlockId)
                .orElseThrow(() -> new ResourceNotFoundException("User to block not found"));

        // Get or create privacy settings
        PrivacySettings privacySettings = privacySettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    PrivacySettings newSettings = new PrivacySettings();
                    newSettings.setUserId(userId);
                    return privacySettingsRepository.save(newSettings);
                });

        // Create blocked user info
        PrivacySettings.BlockedUserInfo blockedUserInfo = new PrivacySettings.BlockedUserInfo();
        blockedUserInfo.setUserId(userToBlockId);
        blockedUserInfo.setReason(reason);
        blockedUserInfo.setBlockedAt(System.currentTimeMillis());

        // Add to blocked users
        privacySettings.getBlockedUsers().put(userToBlockId, blockedUserInfo);

        // Save privacy settings
        privacySettingsRepository.save(privacySettings);
    }

    /**
     * Unblock a user
     */
    @Transactional
    public void unblockUser(String userId, String userToUnblockId) {
        // Get privacy settings
        PrivacySettings privacySettings = privacySettingsRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Privacy settings not found"));

        // Remove from blocked users
        if (privacySettings.getBlockedUsers().remove(userToUnblockId) == null) {
            throw new BadRequestException("User is not blocked");
        }

        // Save privacy settings
        privacySettingsRepository.save(privacySettings);
    }

    /**
     * Check if a user is blocked
     */
    public boolean isUserBlocked(String userId, String targetUserId) {
        return privacySettingsRepository.findByUserId(userId)
                .map(settings -> settings.getBlockedUsers().containsKey(targetUserId))
                .orElse(false);
    }

    /**
     * Validate visibility value
     */
    private void validateVisibility(String visibility) {
        if (visibility == null) {
            return;
        }

        switch (visibility) {
            case "PUBLIC":
            case "FRIENDS":
            case "SPECIFIC_FRIENDS":
            case "ONLY_ME":
                break;
            default:
                throw new BadRequestException("Invalid visibility value: " + visibility);
        }
    }
}