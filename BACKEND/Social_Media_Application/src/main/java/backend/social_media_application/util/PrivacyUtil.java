package backend.social_media_application.util;

import backend.social_media_application.model.PrivacySettings;

public class PrivacyUtil {

    /**
     * Check if a user can access content based on privacy settings
     */
    public static boolean canAccessContent(String contentVisibility, String currentUserId,
                                           String contentOwnerId, boolean areConnected) {
        // If viewing own content, always allow access
        if (currentUserId != null && currentUserId.equals(contentOwnerId)) {
            return true;
        }

        switch (contentVisibility) {
            case "PUBLIC":
                return true;
            case "FRIENDS":
                return areConnected;
            case "SPECIFIC_FRIENDS":
                // Would need additional logic to check specific friends
                return false;
            case "ONLY_ME":
                return false;
            default:
                return false;
        }
    }

    /**
     * Apply privacy filter to a field based on section visibility
     */
    public static <T> T applyPrivacyFilter(T field, String sectionVisibility,
                                           String currentUserId, String contentOwnerId,
                                           boolean areConnected) {
        if (canAccessContent(sectionVisibility, currentUserId, contentOwnerId, areConnected)) {
            return field;
        }
        return null;
    }
}