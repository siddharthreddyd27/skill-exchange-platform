package com.skillexchange.controller;

import com.skillexchange.config.UserPrincipal;
import com.skillexchange.dto.request.SkillCreateRequest;
import com.skillexchange.dto.request.UserSkillRequest;
import com.skillexchange.dto.response.ApiResponse;
import com.skillexchange.dto.response.SkillDto;
import com.skillexchange.dto.response.UserSkillDto;
import com.skillexchange.entity.enums.SkillType;
import com.skillexchange.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    // Public catalog endpoints
    @GetMapping("/skills")
    public ResponseEntity<List<SkillDto>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/skills/search")
    public ResponseEntity<List<SkillDto>> searchSkills(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(skillService.searchSkills(q));
    }

    @GetMapping("/skills/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(skillService.getAllCategories());
    }

    @PostMapping("/skills")
    public ResponseEntity<SkillDto> createSkill(@Valid @RequestBody SkillCreateRequest request) {
        SkillDto created = skillService.createSkill(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // User-specific skill endpoints
    @GetMapping("/user-skills/my")
    public ResponseEntity<List<UserSkillDto>> getMySkills(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) SkillType type) {
        return ResponseEntity.ok(skillService.getUserSkills(currentUser.getId(), type));
    }

    @GetMapping("/user-skills/user/{userId}")
    public ResponseEntity<List<UserSkillDto>> getUserSkills(
            @PathVariable Long userId,
            @RequestParam(required = false) SkillType type) {
        return ResponseEntity.ok(skillService.getUserSkills(userId, type));
    }

    @PostMapping("/user-skills")
    public ResponseEntity<UserSkillDto> addUserSkill(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UserSkillRequest request) {
        UserSkillDto created = skillService.addUserSkill(currentUser.getId(), request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/user-skills/{id}")
    public ResponseEntity<UserSkillDto> updateUserSkill(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody UserSkillRequest request) {
        UserSkillDto updated = skillService.updateUserSkill(currentUser.getId(), id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/user-skills/{id}")
    public ResponseEntity<ApiResponse> removeUserSkill(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        skillService.removeUserSkill(currentUser.getId(), id);
        return ResponseEntity.ok(new ApiResponse(true, "Skill removed from your profile"));
    }
}
