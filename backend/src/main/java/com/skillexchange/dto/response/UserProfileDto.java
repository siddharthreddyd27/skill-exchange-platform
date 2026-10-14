package com.skillexchange.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UserProfileDto {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String avatarUrl;
    private String interests;
    private String location;
    private String role;
    private LocalDateTime createdAt;
    private List<UserSkillDto> teachingSkills = new ArrayList<>();
    private List<UserSkillDto> learningSkills = new ArrayList<>();
    private long totalConnections;
    private long totalExchanges;

    public UserProfileDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<UserSkillDto> getTeachingSkills() {
        return teachingSkills;
    }

    public void setTeachingSkills(List<UserSkillDto> teachingSkills) {
        this.teachingSkills = teachingSkills;
    }

    public List<UserSkillDto> getLearningSkills() {
        return learningSkills;
    }

    public void setLearningSkills(List<UserSkillDto> learningSkills) {
        this.learningSkills = learningSkills;
    }

    public long getTotalConnections() {
        return totalConnections;
    }

    public void setTotalConnections(long totalConnections) {
        this.totalConnections = totalConnections;
    }

    public long getTotalExchanges() {
        return totalExchanges;
    }

    public void setTotalExchanges(long totalExchanges) {
        this.totalExchanges = totalExchanges;
    }
}
