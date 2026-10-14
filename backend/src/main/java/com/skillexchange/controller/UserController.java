package com.skillexchange.controller;

import com.skillexchange.config.UserPrincipal;
import com.skillexchange.dto.request.ProfileUpdateRequest;
import com.skillexchange.dto.response.UserProfileDto;
import com.skillexchange.dto.response.UserSummaryDto;
import com.skillexchange.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserProfileDto profile = userService.getCurrentUserProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ProfileUpdateRequest request) {
        UserProfileDto updated = userService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long id) {
        UserProfileDto profile = userService.getUserById(id);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSummaryDto>> searchUsers(
            @RequestParam(required = false) String query,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        List<UserSummaryDto> results = userService.searchUsers(query, currentUserId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/filter-by-skill")
    public ResponseEntity<List<UserSummaryDto>> filterBySkill(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String category,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        List<UserSummaryDto> results = userService.filterUsersByTeachSkill(skill, category, currentUserId);
        return ResponseEntity.ok(results);
    }
}
