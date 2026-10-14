package com.skillexchange.controller;

import com.skillexchange.config.UserPrincipal;
import com.skillexchange.dto.request.SkillExchangeCreateDto;
import com.skillexchange.dto.request.SkillExchangeStatusUpdateDto;
import com.skillexchange.dto.response.SkillExchangeDto;
import com.skillexchange.entity.enums.ExchangeStatus;
import com.skillexchange.service.SkillExchangeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchanges")
public class SkillExchangeController {

    private final SkillExchangeService skillExchangeService;

    public SkillExchangeController(SkillExchangeService skillExchangeService) {
        this.skillExchangeService = skillExchangeService;
    }

    @PostMapping
    public ResponseEntity<SkillExchangeDto> proposeExchange(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody SkillExchangeCreateDto createDto) {
        SkillExchangeDto created = skillExchangeService.proposeExchange(currentUser.getId(), createDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SkillExchangeDto> updateStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody SkillExchangeStatusUpdateDto updateDto) {
        SkillExchangeDto updated = skillExchangeService.updateExchangeStatus(currentUser.getId(), id, updateDto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<SkillExchangeDto>> getMyExchanges(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) ExchangeStatus status) {
        List<SkillExchangeDto> list = skillExchangeService.getUserExchanges(currentUser.getId(), status);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillExchangeDto> getExchangeById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        SkillExchangeDto exchange = skillExchangeService.getExchangeById(currentUser.getId(), id);
        return ResponseEntity.ok(exchange);
    }
}
