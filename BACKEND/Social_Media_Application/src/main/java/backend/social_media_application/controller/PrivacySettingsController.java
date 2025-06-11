package backend.social_media_application.controller;

import backend.social_media_application.dto.profile.PrivacySettingsDTO;
import backend.social_media_application.service.PrivacySettingsService;
import backend.social_media_application.util.SecurityUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/privacy")
public class PrivacySettingsController {

    private final PrivacySettingsService privacySettingsService;

    @Autowired
    public PrivacySettingsController(PrivacySettingsService privacySettingsService) {
        this.privacySettingsService = privacySettingsService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PrivacySettingsDTO> getPrivacySettings() {
        String currentUserId = SecurityUtil.getCurrentUserId();
        PrivacySettingsDTO privacySettingsDTO = privacySettingsService.getPrivacySettings(currentUserId);
        return ResponseEntity.ok(privacySettingsDTO);
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PrivacySettingsDTO> updatePrivacySettings(
            @Valid @RequestBody PrivacySettingsDTO privacySettingsDTO) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        PrivacySettingsDTO updatedSettings = privacySettingsService.updatePrivacySettings(
                currentUserId, privacySettingsDTO);
        return ResponseEntity.ok(updatedSettings);
    }

    @PostMapping("/block/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> blockUser(
            @PathVariable String userId,
            @RequestBody(required = false) Map<String, String> body) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : null;
        privacySettingsService.blockUser(currentUserId, userId, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unblock/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> unblockUser(@PathVariable String userId) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        privacySettingsService.unblockUser(currentUserId, userId);
        return ResponseEntity.ok().build();
    }
}