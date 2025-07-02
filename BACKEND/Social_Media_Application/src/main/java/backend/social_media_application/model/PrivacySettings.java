package backend.social_media_application.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "privacy_settings")
public class PrivacySettings {
    @Id
    private String id;

    private String userId;

    // Default visibility options: PUBLIC, FRIENDS, SPECIFIC_FRIENDS, ONLY_ME
    private String defaultPostVisibility = "FRIENDS";
    private String profileVisibility = "PUBLIC";
    private String friendListVisibility = "FRIENDS";

    // Section-specific privacy settings
    private Map<String, String> sectionVisibility = new HashMap<>();

    // Search visibility
    private boolean allowSearchEngines = true;
    private boolean showInFriendSuggestions = true;
    private boolean allowFriendRequests = true;

    // Data usage preferences
    private boolean allowDataForRecommendations = true;

    // Blocked users
    private Map<String, BlockedUserInfo> blockedUsers = new HashMap<>();

    // Nested class for blocked user info
    public static class BlockedUserInfo {
        private String userId;
        private String reason;
        private long blockedAt;

        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }

        public long getBlockedAt() { return blockedAt; }
        public void setBlockedAt(long blockedAt) { this.blockedAt = blockedAt; }
    }

    // Constructor to initialize default section visibility
    public PrivacySettings() {
        // Initialize default section visibility
        sectionVisibility.put("BASIC_INFO", "PUBLIC");
        sectionVisibility.put("WORK_EXPERIENCE", "FRIENDS");
        sectionVisibility.put("EDUCATION", "FRIENDS");
        sectionVisibility.put("CONTACT_INFO", "ONLY_ME");
        sectionVisibility.put("RELATIONSHIPS", "FRIENDS");
        sectionVisibility.put("LIFE_EVENTS", "FRIENDS");
        sectionVisibility.put("INTERESTS", "PUBLIC");
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDefaultPostVisibility() { return defaultPostVisibility; }
    public void setDefaultPostVisibility(String defaultPostVisibility) {
        this.defaultPostVisibility = defaultPostVisibility;
    }

    public String getProfileVisibility() { return profileVisibility; }
    public void setProfileVisibility(String profileVisibility) {
        this.profileVisibility = profileVisibility;
    }

    public String getFriendListVisibility() { return friendListVisibility; }
    public void setFriendListVisibility(String friendListVisibility) {
        this.friendListVisibility = friendListVisibility;
    }

    public Map<String, String> getSectionVisibility() { return sectionVisibility; }
    public void setSectionVisibility(Map<String, String> sectionVisibility) {
        this.sectionVisibility = sectionVisibility;
    }

    public boolean isAllowSearchEngines() { return allowSearchEngines; }
    public void setAllowSearchEngines(boolean allowSearchEngines) {
        this.allowSearchEngines = allowSearchEngines;
    }

    public boolean isShowInFriendSuggestions() { return showInFriendSuggestions; }
    public void setShowInFriendSuggestions(boolean showInFriendSuggestions) {
        this.showInFriendSuggestions = showInFriendSuggestions;
    }

    public boolean isAllowFriendRequests() { return allowFriendRequests; }
    public void setAllowFriendRequests(boolean allowFriendRequests) {
        this.allowFriendRequests = allowFriendRequests;
    }

    public boolean isAllowDataForRecommendations() { return allowDataForRecommendations; }
    public void setAllowDataForRecommendations(boolean allowDataForRecommendations) {
        this.allowDataForRecommendations = allowDataForRecommendations;
    }

    public Map<String, BlockedUserInfo> getBlockedUsers() { return blockedUsers; }
    public void setBlockedUsers(Map<String, BlockedUserInfo> blockedUsers) {
        this.blockedUsers = blockedUsers;
    }
}