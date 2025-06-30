package backend.social_media_application.dto.profile;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PrivacySettingsDTO {
    private String id;
    private String defaultPostVisibility;
    private String profileVisibility;
    private String friendListVisibility;
    private Map<String, String> sectionVisibility = new HashMap<>();
    private boolean allowSearchEngines;
    private boolean showInFriendSuggestions;
    private boolean allowFriendRequests;
    private boolean allowDataForRecommendations;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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
}