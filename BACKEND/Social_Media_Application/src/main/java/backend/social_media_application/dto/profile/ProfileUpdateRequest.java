package backend.social_media_application.dto.profile;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProfileUpdateRequest {
    @Size(max = 255, message = "Bio must be less than 255 characters")
    private String bio;

    private LocalDate birthDate;

    @Size(max = 50, message = "Gender must be less than 50 characters")
    private String gender;

    @Size(max = 50, message = "Relationship status must be less than 50 characters")
    private String relationshipStatus;

    @Pattern(regexp = "^$|^\\+?[0-9]{10,15}$", message = "Phone number format is invalid")
    private String phoneNumber;

    @Pattern(regexp = "^$|^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?(\\/[^\\s]*)?$",
            message = "Website URL format is invalid")
    private String website;

    @Pattern(regexp = "^$|^[A-Za-z0-9+_.-]+@(.+)$", message = "Email format is invalid")
    private String alternativeEmail;

    @Size(max = 100, message = "Current city must be less than 100 characters")
    private String currentCity;

    @Size(max = 100, message = "Hometown must be less than 100 characters")
    private String hometown;

    private List<String> placesLived;
    private Set<String> interests;
    private Set<String> music;
    private Set<String> movies;
    private Set<String> books;
    private Set<String> sports;

    // Getters and setters
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

    @Override
    public String toString() {
        return "ProfileUpdateRequest{" +
                "bio='" + bio + '\'' +
                ", birthDate=" + birthDate +
                ", gender='" + gender + '\'' +
                ", relationshipStatus='" + relationshipStatus + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", website='" + website + '\'' +
                ", alternativeEmail='" + alternativeEmail + '\'' +
                ", currentCity='" + currentCity + '\'' +
                ", hometown='" + hometown + '\'' +
                '}';
    }
}