package com.skillexchange.entity;

import com.skillexchange.entity.enums.ProficiencyLevel;
import com.skillexchange.entity.enums.SkillType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_skills",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "skill_id", "skill_type"})
    }
)
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_type", nullable = false, length = 20)
    private SkillType skillType;

    @Enumerated(EnumType.STRING)
    @Column(name = "proficiency_level", nullable = false, length = 30)
    private ProficiencyLevel proficiencyLevel = ProficiencyLevel.INTERMEDIATE;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public UserSkill() {
    }

    public UserSkill(User user, Skill skill, SkillType skillType, ProficiencyLevel proficiencyLevel, String description, Integer yearsOfExperience) {
        this.user = user;
        this.skill = skill;
        this.skillType = skillType;
        this.proficiencyLevel = proficiencyLevel != null ? proficiencyLevel : ProficiencyLevel.INTERMEDIATE;
        this.description = description;
        this.yearsOfExperience = yearsOfExperience;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public SkillType getSkillType() {
        return skillType;
    }

    public void setSkillType(SkillType skillType) {
        this.skillType = skillType;
    }

    public ProficiencyLevel getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
