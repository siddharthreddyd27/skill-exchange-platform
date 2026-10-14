package com.skillexchange.dto.response;

import java.util.ArrayList;
import java.util.List;

public class DashboardStatsDto {

    private UserProfileDto profile;
    private long totalTeachingSkills;
    private long totalLearningSkills;
    private long pendingIncomingRequests;
    private long pendingOutgoingRequests;
    private long totalConnections;
    private long activeExchanges;
    private long completedExchanges;
    private List<SkillMatchDto> suggestedMatches = new ArrayList<>();
    private List<ConnectionResponseDto> recentIncomingRequests = new ArrayList<>();
    private List<SkillExchangeDto> recentExchanges = new ArrayList<>();

    public DashboardStatsDto() {
    }

    public UserProfileDto getProfile() {
        return profile;
    }

    public void setProfile(UserProfileDto profile) {
        this.profile = profile;
    }

    public long getTotalTeachingSkills() {
        return totalTeachingSkills;
    }

    public void setTotalTeachingSkills(long totalTeachingSkills) {
        this.totalTeachingSkills = totalTeachingSkills;
    }

    public long getTotalLearningSkills() {
        return totalLearningSkills;
    }

    public void setTotalLearningSkills(long totalLearningSkills) {
        this.totalLearningSkills = totalLearningSkills;
    }

    public long getPendingIncomingRequests() {
        return pendingIncomingRequests;
    }

    public void setPendingIncomingRequests(long pendingIncomingRequests) {
        this.pendingIncomingRequests = pendingIncomingRequests;
    }

    public long getPendingOutgoingRequests() {
        return pendingOutgoingRequests;
    }

    public void setPendingOutgoingRequests(long pendingOutgoingRequests) {
        this.pendingOutgoingRequests = pendingOutgoingRequests;
    }

    public long getTotalConnections() {
        return totalConnections;
    }

    public void setTotalConnections(long totalConnections) {
        this.totalConnections = totalConnections;
    }

    public long getActiveExchanges() {
        return activeExchanges;
    }

    public void setActiveExchanges(long activeExchanges) {
        this.activeExchanges = activeExchanges;
    }

    public long getCompletedExchanges() {
        return completedExchanges;
    }

    public void setCompletedExchanges(long completedExchanges) {
        this.completedExchanges = completedExchanges;
    }

    public List<SkillMatchDto> getSuggestedMatches() {
        return suggestedMatches;
    }

    public void setSuggestedMatches(List<SkillMatchDto> suggestedMatches) {
        this.suggestedMatches = suggestedMatches;
    }

    public List<ConnectionResponseDto> getRecentIncomingRequests() {
        return recentIncomingRequests;
    }

    public void setRecentIncomingRequests(List<ConnectionResponseDto> recentIncomingRequests) {
        this.recentIncomingRequests = recentIncomingRequests;
    }

    public List<SkillExchangeDto> getRecentExchanges() {
        return recentExchanges;
    }

    public void setRecentExchanges(List<SkillExchangeDto> recentExchanges) {
        this.recentExchanges = recentExchanges;
    }
}
