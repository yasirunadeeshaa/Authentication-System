package backend.social_media_application.dto.mapper;

import backend.social_media_application.dto.profile.*;
import backend.social_media_application.model.*;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProfileMapper {

    public ProfileDTO toProfileDTO(User user, Profile profile,
                                   List<Education> educations,
                                   List<WorkExperience> workExperiences) {
        ProfileDTO profileDTO = new ProfileDTO();

        // Set user info
        profileDTO.setUserId(user.getId());
        profileDTO.setUsername(user.getUsername());
        profileDTO.setFirstName(user.getFirstName());
        profileDTO.setLastName(user.getLastName());
        profileDTO.setAvatar(user.getAvatar());
        profileDTO.setBio(user.getBio());
        profileDTO.setFollowerCount(user.getFollowers().size());
        profileDTO.setFollowingCount(user.getFollowing().size());

        // Set profile info
        if (profile != null) {
            profileDTO.setId(profile.getId());
            profileDTO.setCoverPhoto(profile.getCoverPhoto());
            profileDTO.setBirthDate(profile.getBirthDate());
            profileDTO.setGender(profile.getGender());
            profileDTO.setRelationshipStatus(profile.getRelationshipStatus());
            profileDTO.setPhoneNumber(profile.getPhoneNumber());
            profileDTO.setWebsite(profile.getWebsite());
            profileDTO.setAlternativeEmail(profile.getAlternativeEmail());
            profileDTO.setCurrentCity(profile.getCurrentCity());
            profileDTO.setHometown(profile.getHometown());
            profileDTO.setPlacesLived(profile.getPlacesLived());
            profileDTO.setInterests(profile.getInterests());
            profileDTO.setMusic(profile.getMusic());
            profileDTO.setMovies(profile.getMovies());
            profileDTO.setBooks(profile.getBooks());
            profileDTO.setSports(profile.getSports());
            profileDTO.setLifeEvents(profile.getLifeEvents());
        }

        // Set education info
        if (educations != null && !educations.isEmpty()) {
            List<EducationDTO> educationDTOs = educations.stream()
                    .map(this::toEducationDTO)
                    .collect(Collectors.toList());
            profileDTO.setEducation(educationDTOs);
        }

        // Set work experience info
        if (workExperiences != null && !workExperiences.isEmpty()) {
            List<WorkExperienceDTO> workExperienceDTOs = workExperiences.stream()
                    .map(this::toWorkExperienceDTO)
                    .collect(Collectors.toList());
            profileDTO.setWorkExperience(workExperienceDTOs);
        }

        return profileDTO;
    }

    public EducationDTO toEducationDTO(Education education) {
        EducationDTO dto = new EducationDTO();
        dto.setId(education.getId());
        dto.setInstitution(education.getInstitution());
        dto.setDegree(education.getDegree());
        dto.setFieldOfStudy(education.getFieldOfStudy());
        dto.setStartDate(education.getStartDate());
        dto.setEndDate(education.getEndDate());
        dto.setCurrent(education.isCurrent());
        dto.setDescription(education.getDescription());
        return dto;
    }

    public WorkExperienceDTO toWorkExperienceDTO(WorkExperience workExperience) {
        WorkExperienceDTO dto = new WorkExperienceDTO();
        dto.setId(workExperience.getId());
        dto.setCompany(workExperience.getCompany());
        dto.setPosition(workExperience.getPosition());
        dto.setLocation(workExperience.getLocation());
        dto.setStartDate(workExperience.getStartDate());
        dto.setEndDate(workExperience.getEndDate());
        dto.setCurrent(workExperience.isCurrent());
        dto.setDescription(workExperience.getDescription());
        return dto;
    }

    public PrivacySettingsDTO toPrivacySettingsDTO(PrivacySettings privacySettings) {
        PrivacySettingsDTO dto = new PrivacySettingsDTO();
        dto.setId(privacySettings.getId());
        dto.setDefaultPostVisibility(privacySettings.getDefaultPostVisibility());
        dto.setProfileVisibility(privacySettings.getProfileVisibility());
        dto.setFriendListVisibility(privacySettings.getFriendListVisibility());
        dto.setSectionVisibility(privacySettings.getSectionVisibility());
        dto.setAllowSearchEngines(privacySettings.isAllowSearchEngines());
        dto.setShowInFriendSuggestions(privacySettings.isShowInFriendSuggestions());
        dto.setAllowFriendRequests(privacySettings.isAllowFriendRequests());
        dto.setAllowDataForRecommendations(privacySettings.isAllowDataForRecommendations());
        return dto;
    }

    public void updateProfileFromRequest(Profile profile, ProfileUpdateRequest request) {
        if (request.getBio() != null) profile.setId(request.getBio());
        if (request.getBirthDate() != null) profile.setBirthDate(request.getBirthDate());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getRelationshipStatus() != null) profile.setRelationshipStatus(request.getRelationshipStatus());
        if (request.getPhoneNumber() != null) profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getWebsite() != null) profile.setWebsite(request.getWebsite());
        if (request.getAlternativeEmail() != null) profile.setAlternativeEmail(request.getAlternativeEmail());
        if (request.getCurrentCity() != null) profile.setCurrentCity(request.getCurrentCity());
        if (request.getHometown() != null) profile.setHometown(request.getHometown());
        if (request.getPlacesLived() != null) profile.setPlacesLived(request.getPlacesLived());
        if (request.getInterests() != null) profile.setInterests(request.getInterests());
        if (request.getMusic() != null) profile.setMusic(request.getMusic());
        if (request.getMovies() != null) profile.setMovies(request.getMovies());
        if (request.getBooks() != null) profile.setBooks(request.getBooks());
        if (request.getSports() != null) profile.setSports(request.getSports());
    }

    public Education toEducation(EducationDTO dto, String userId) {
        Education education = new Education();
        education.setId(dto.getId());
        education.setUserId(userId);
        education.setInstitution(dto.getInstitution());
        education.setDegree(dto.getDegree());
        education.setFieldOfStudy(dto.getFieldOfStudy());
        education.setStartDate(dto.getStartDate());
        education.setEndDate(dto.getEndDate());
        education.setCurrent(dto.isCurrent());
        education.setDescription(dto.getDescription());
        education.setVisibility("FRIENDS"); // Default visibility
        return education;
    }

    public WorkExperience toWorkExperience(WorkExperienceDTO dto, String userId) {
        WorkExperience workExperience = new WorkExperience();
        workExperience.setId(dto.getId());
        workExperience.setUserId(userId);
        workExperience.setCompany(dto.getCompany());
        workExperience.setPosition(dto.getPosition());
        workExperience.setLocation(dto.getLocation());
        workExperience.setStartDate(dto.getStartDate());
        workExperience.setEndDate(dto.getEndDate());
        workExperience.setCurrent(dto.isCurrent());
        workExperience.setDescription(dto.getDescription());
        workExperience.setVisibility("FRIENDS"); // Default visibility
        return workExperience;
    }
}