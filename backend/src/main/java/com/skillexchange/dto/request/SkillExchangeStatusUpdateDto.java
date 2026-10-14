package com.skillexchange.dto.request;

import com.skillexchange.entity.enums.ExchangeStatus;
import jakarta.validation.constraints.NotNull;

public class SkillExchangeStatusUpdateDto {

    @NotNull(message = "Status is required")
    private ExchangeStatus status;

    private String notes;

    public SkillExchangeStatusUpdateDto() {
    }

    public SkillExchangeStatusUpdateDto(ExchangeStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public ExchangeStatus getStatus() {
        return status;
    }

    public void setStatus(ExchangeStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
