package backend.social_media_application.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(collection = "profiles")
public class Profile {
    @Id
    private String id;

    private String userId;
    private String coverPhoto;
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

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Embedded class for life events
    public static class LifeEvent {
        private String id;
        private String title;
        private String description;
        private LocalDate date;
        private String category;
        private String visibility;

        // Getters and setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getVisibility() { return visibility; }
        public void setVisibility(String visibility) { this.visibility = visibility; }
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCoverPhoto() { return coverPhoto; }
    public void setCoverPhoto(String coverPhoto) { this.coverPhoto = coverPhoto; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
