package com.skillexchange.dto.response;

import com.skillexchange.entity.enums.ExchangeStatus;
import java.time.LocalDateTime;

public class SkillExchangeDto {

    private Long id;

    private Long initiatorId;
    private String initiatorUsername;
    private String initiatorFullName;
    private String initiatorAvatarUrl;

    private Long partnerId;
    private String partnerUsername;
    private String partnerFullName;
    private String partnerAvatarUrl;

    private Long initiatorSkillId;
    private String initiatorSkillName;
    private String initiatorSkillCategory;

    private Long partnerSkillId;
    private String partnerSkillName;
    private String partnerSkillCategory;

    private String title;
    private String learningGoals;
    private ExchangeStatus status;
    private String scheduleInfo;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SkillExchangeDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInitiatorId() {
        return initiatorId;
    }

    public void setInitiatorId(Long initiatorId) {
        this.initiatorId = initiatorId;
    }

    public String getInitiatorUsername() {
        return initiatorUsername;
    }

    public void setInitiatorUsername(String initiatorUsername) {
        this.initiatorUsername = initiatorUsername;
    }

    public String getInitiatorFullName() {
        return initiatorFullName;
    }

    public void setInitiatorFullName(String initiatorFullName) {
        this.initiatorFullName = initiatorFullName;
    }

    public String getInitiatorAvatarUrl() {
        return initiatorAvatarUrl;
    }

    public void setInitiatorAvatarUrl(String initiatorAvatarUrl) {
        this.initiatorAvatarUrl = initiatorAvatarUrl;
    }

    public Long getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Long partnerId) {
        this.partnerId = partnerId;
    }

    public String getPartnerUsername() {
        return partnerUsername;
    }

    public void setPartnerUsername(String partnerUsername) {
        this.partnerUsername = partnerUsername;
    }

    public String getPartnerFullName() {
        return partnerFullName;
    }

    public void setPartnerFullName(String partnerFullName) {
        this.partnerFullName = partnerFullName;
    }

    public String getPartnerAvatarUrl() {
        return partnerAvatarUrl;
    }

    public void setPartnerAvatarUrl(String partnerAvatarUrl) {
        this.partnerAvatarUrl = partnerAvatarUrl;
    }

    public Long getInitiatorSkillId() {
        return initiatorSkillId;
    }

    public void setInitiatorSkillId(Long initiatorSkillId) {
        this.initiatorSkillId = initiatorSkillId;
    }

    public String getInitiatorSkillName() {
        return initiatorSkillName;
    }

    public void setInitiatorSkillName(String initiatorSkillName) {
        this.initiatorSkillName = initiatorSkillName;
    }

    public String getInitiatorSkillCategory() {
        return initiatorSkillCategory;
    }

    public void setInitiatorSkillCategory(String initiatorSkillCategory) {
        this.initiatorSkillCategory = initiatorSkillCategory;
    }

    public Long getPartnerSkillId() {
        return partnerSkillId;
    }

    public void setPartnerSkillId(Long partnerSkillId) {
        this.partnerSkillId = partnerSkillId;
    }

    public String getPartnerSkillName() {
        return partnerSkillName;
    }

    public void setPartnerSkillName(String partnerSkillName) {
        this.partnerSkillName = partnerSkillName;
    }

    public String getPartnerSkillCategory() {
        return partnerSkillCategory;
    }

    public void setPartnerSkillCategory(String partnerSkillCategory) {
        this.partnerSkillCategory = partnerSkillCategory;
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

    public ExchangeStatus getStatus() {
        return status;
    }

    public void setStatus(ExchangeStatus status) {
        this.status = status;
    }

    public String getScheduleInfo() {
        return scheduleInfo;
    }

    public void setScheduleInfo(String scheduleInfo) {
        this.scheduleInfo = scheduleInfo;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
