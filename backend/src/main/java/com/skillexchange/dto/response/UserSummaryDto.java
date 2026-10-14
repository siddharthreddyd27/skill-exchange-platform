package com.skillexchange.dto.response;

import java.util.ArrayList;
import java.util.List;

public class UserSummaryDto {

    private Long id;
    private String username;
    private String fullName;
    private String avatarUrl;
    private String bio;
    private String interests;
    private String location;
    private List<UserSkillDto> teachingSkills = new ArrayList<>();
    private List<UserSkillDto> learningSkills = new ArrayList<>();
    private String connectionStatus; // NONE, PENDING_INCOMING, PENDING_OUTGOING, CONNECTED, REJECTED
    private Long connectionId;

    public UserSummaryDto() {
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
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

    public String getConnectionStatus() {
        return connectionStatus;
    }

    public void setConnectionStatus(String connectionStatus) {
        this.connectionStatus = connectionStatus;
    }

    public Long getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(Long connectionId) {
        this.connectionId = connectionId;
    }
}
