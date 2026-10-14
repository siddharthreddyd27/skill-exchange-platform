package com.skillexchange.dto.response;

import java.util.ArrayList;
import java.util.List;

public class SkillMatchDto {

    private UserSummaryDto user;
    private int matchScore; // 0 - 100%
    private String matchType; // MUTUAL_MATCH, CAN_TEACH_YOU, WANTS_TO_LEARN_FROM_YOU
    private String matchReason;
    private List<String> matchingSkillsToLearn = new ArrayList<>(); // Skills they teach that you want
    private List<String> matchingSkillsToTeach = new ArrayList<>(); // Skills you teach that they want

    public SkillMatchDto() {
    }

    public UserSummaryDto getUser() {
        return user;
    }

    public void setUser(UserSummaryDto user) {
        this.user = user;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public String getMatchType() {
        return matchType;
    }

    public void setMatchType(String matchType) {
        this.matchType = matchType;
    }

    public String getMatchReason() {
        return matchReason;
    }

    public void setMatchReason(String matchReason) {
        this.matchReason = matchReason;
    }

    public List<String> getMatchingSkillsToLearn() {
        return matchingSkillsToLearn;
    }

    public void setMatchingSkillsToLearn(List<String> matchingSkillsToLearn) {
        this.matchingSkillsToLearn = matchingSkillsToLearn;
    }

    public List<String> getMatchingSkillsToTeach() {
        return matchingSkillsToTeach;
    }

    public void setMatchingSkillsToTeach(List<String> matchingSkillsToTeach) {
        this.matchingSkillsToTeach = matchingSkillsToTeach;
    }
}
