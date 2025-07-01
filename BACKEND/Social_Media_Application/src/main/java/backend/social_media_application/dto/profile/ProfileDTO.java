package backend.social_media_application.dto.profile;

import backend.social_media_application.model.Profile.LifeEvent;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProfileDTO {
    private String id;
    private String userId;
    private String username;
    private String firstName;
    private String lastName;
    private String avatar;
    private String coverPhoto;
    private String bio;
    private LocalDate birthDate;
    private String gender;
    private String relationshipStatus;
    private String phoneNumber;
    private String website;
    private String alternativeEmail;

    // Location information
    private String currentCity;
    private String hometown;
    private List<String> placesLived = new ArrayList<>();

    // Interests
    private Set<String> interests = new HashSet<>();
    private Set<String> music = new HashSet<>();
    private Set<String> movies = new HashSet<>();
    private Set<String> books = new HashSet<>();
    private Set<String> sports = new HashSet<>();

    // Life events
    private List<LifeEvent> lifeEvents = new ArrayList<>();

    // Related collections
    private List<EducationDTO> education = new ArrayList<>();
    private List<WorkExperienceDTO> workExperience = new ArrayList<>();

    // Stats
    private int followerCount;
    private int followingCount;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getCoverPhoto() { return coverPhoto; }
    public void setCoverPhoto(String coverPhoto) { this.coverPhoto = coverPhoto; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getRelationshipStatus() { return relationshipStatus; }
    public void setRelationshipStatus(String relationshipStatus) { this.relationshipStatus = relationshipStatus; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getAlternativeEmail() { return alternativeEmail; }
    public void setAlternativeEmail(String alternativeEmail) { this.alternativeEmail = alternativeEmail; }

    public String getCurrentCity() { return currentCity; }
    public void setCurrentCity(String currentCity) { this.currentCity = currentCity; }

    public String getHometown() { return hometown; }
    public void setHometown(String hometown) { this.hometown = hometown; }

    public List<String> getPlacesLived() { return placesLived; }
    public void setPlacesLived(List<String> placesLived) { this.placesLived = placesLived; }

    public Set<String> getInterests() { return interests; }
    public void setInterests(Set<String> interests) { this.interests = interests; }

    public Set<String> getMusic() { return music; }
    public void setMusic(Set<String> music) { this.music = music; }

    public Set<String> getMovies() { return movies; }
    public void setMovies(Set<String> movies) { this.movies = movies; }

    public Set<String> getBooks() { return books; }
    public void setBooks(Set<String> books) { this.books = books; }

    public Set<String> getSports() { return sports; }
    public void setSports(Set<String> sports) { this.sports = sports; }

    public List<LifeEvent> getLifeEvents() { return lifeEvents; }
    public void setLifeEvents(List<LifeEvent> lifeEvents) { this.lifeEvents = lifeEvents; }

    public List<EducationDTO> getEducation() { return education; }
    public void setEducation(List<EducationDTO> education) { this.education = education; }

    public List<WorkExperienceDTO> getWorkExperience() { return workExperience; }
    public void setWorkExperience(List<WorkExperienceDTO> workExperience) { this.workExperience = workExperience; }

    public int getFollowerCount() { return followerCount; }
    public void setFollowerCount(int followerCount) { this.followerCount = followerCount; }

    public int getFollowingCount() { return followingCount; }
    public void setFollowingCount(int followingCount) { this.followingCount = followingCount; }
}