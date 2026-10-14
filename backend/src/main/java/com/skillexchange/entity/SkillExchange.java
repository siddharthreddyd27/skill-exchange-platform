package com.skillexchange.entity;

import com.skillexchange.entity.enums.ExchangeStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_exchanges")
public class SkillExchange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "initiator_id", nullable = false)
    private User initiator;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "partner_id", nullable = false)
    private User partner;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "initiator_skill_id", nullable = false)
    private Skill initiatorSkill;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "partner_skill_id", nullable = false)
    private Skill partnerSkill;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "learning_goals", columnDefinition = "TEXT")
    private String learningGoals;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ExchangeStatus status = ExchangeStatus.PROPOSED;

    @Column(name = "schedule_info", length = 150)
    private String scheduleInfo;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public SkillExchange() {
    }

    public SkillExchange(User initiator, User partner, Skill initiatorSkill, Skill partnerSkill, String title, String learningGoals, String scheduleInfo) {
        this.initiator = initiator;
        this.partner = partner;
        this.initiatorSkill = initiatorSkill;
        this.partnerSkill = partnerSkill;
        this.title = title;
        this.learningGoals = learningGoals;
        this.scheduleInfo = scheduleInfo;
        this.status = ExchangeStatus.PROPOSED;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ExchangeStatus.PROPOSED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getInitiator() {
        return initiator;
    }

    public void setInitiator(User initiator) {
        this.initiator = initiator;
    }

    public User getPartner() {
        return partner;
    }

    public void setPartner(User partner) {
        this.partner = partner;
    }

    public Skill getInitiatorSkill() {
        return initiatorSkill;
    }

    public void setInitiatorSkill(Skill initiatorSkill) {
        this.initiatorSkill = initiatorSkill;
    }

    public Skill getPartnerSkill() {
        return partnerSkill;
    }

    public void setPartnerSkill(Skill partnerSkill) {
        this.partnerSkill = partnerSkill;
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
