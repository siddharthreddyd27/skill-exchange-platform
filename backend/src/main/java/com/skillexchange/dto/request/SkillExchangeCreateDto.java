package com.skillexchange.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SkillExchangeCreateDto {

    @NotNull(message = "Partner user ID is required")
    private Long partnerId;

    @NotNull(message = "Your offered skill ID is required")
    private Long initiatorSkillId;

    @NotNull(message = "Partner skill ID is required")
    private Long partnerSkillId;

    @NotBlank(message = "Exchange title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    private String learningGoals;

    private String scheduleInfo;

    public SkillExchangeCreateDto() {
    }

    public Long getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Long partnerId) {
        this.partnerId = partnerId;
    }

    public Long getInitiatorSkillId() {
        return initiatorSkillId;
    }

    public void setInitiatorSkillId(Long initiatorSkillId) {
        this.initiatorSkillId = initiatorSkillId;
    }

    public Long getPartnerSkillId() {
        return partnerSkillId;
    }

    public void setPartnerSkillId(Long partnerSkillId) {
        this.partnerSkillId = partnerSkillId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLearningGoals() {
        return learningGoals;
    }

    public void setLearningGoals(String learningGoals) {
        this.learningGoals = learningGoals;
    }

    public String getScheduleInfo() {
        return scheduleInfo;
    }

    public void setScheduleInfo(String scheduleInfo) {
        this.scheduleInfo = scheduleInfo;
    }
}
