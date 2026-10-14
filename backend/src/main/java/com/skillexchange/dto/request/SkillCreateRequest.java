package com.skillexchange.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SkillCreateRequest {

    @NotBlank(message = "Skill name is required")
    @Size(min = 2, max = 100, message = "Skill name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 60, message = "Category cannot exceed 60 characters")
    private String category;

    private String description;

    public SkillCreateRequest() {
    }

    public SkillCreateRequest(String name, String category, String description) {
        this.name = name;
        this.category = category;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
