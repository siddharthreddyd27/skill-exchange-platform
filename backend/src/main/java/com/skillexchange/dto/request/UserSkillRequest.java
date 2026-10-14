package com.skillexchange.dto.request;

import com.skillexchange.entity.enums.ProficiencyLevel;
import com.skillexchange.entity.enums.SkillType;
import jakarta.validation.constraints.NotNull;

public class UserSkillRequest {

    private Long skillId;
    private String skillName;
    private String category;

    @NotNull(message = "Skill type (TEACH or LEARN) is required")
    private SkillType skillType;

    private ProficiencyLevel proficiencyLevel = ProficiencyLevel.INTERMEDIATE;

    private String description;

    private Integer yearsOfExperience;

    public UserSkillRequest() {
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
}
