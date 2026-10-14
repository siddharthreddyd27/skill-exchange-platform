package com.skillexchange.dto.response;

import com.skillexchange.entity.enums.ProficiencyLevel;
import com.skillexchange.entity.enums.SkillType;
import java.time.LocalDateTime;

public class UserSkillDto {

    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private SkillType skillType;
    private ProficiencyLevel proficiencyLevel;
    private String description;
    private Integer yearsOfExperience;
    private LocalDateTime createdAt;

    public UserSkillDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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
