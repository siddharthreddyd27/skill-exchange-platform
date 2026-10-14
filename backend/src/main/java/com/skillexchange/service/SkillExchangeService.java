package com.skillexchange.service;

import com.skillexchange.dto.request.SkillExchangeCreateDto;
import com.skillexchange.dto.request.SkillExchangeStatusUpdateDto;
import com.skillexchange.dto.response.SkillExchangeDto;
import com.skillexchange.entity.ConnectionRequest;
import com.skillexchange.entity.Skill;
import com.skillexchange.entity.SkillExchange;
import com.skillexchange.entity.User;
import com.skillexchange.entity.enums.ConnectionStatus;
import com.skillexchange.entity.enums.ExchangeStatus;
import com.skillexchange.exception.BadRequestException;
import com.skillexchange.exception.ResourceNotFoundException;
import com.skillexchange.exception.UnauthorizedException;
import com.skillexchange.repository.ConnectionRequestRepository;
import com.skillexchange.repository.SkillExchangeRepository;
import com.skillexchange.repository.SkillRepository;
import com.skillexchange.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillExchangeService {

    private final SkillExchangeRepository skillExchangeRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ConnectionRequestRepository connectionRequestRepository;

    public SkillExchangeService(SkillExchangeRepository skillExchangeRepository,
                                UserRepository userRepository,
                                SkillRepository skillRepository,
                                ConnectionRequestRepository connectionRequestRepository) {
        this.skillExchangeRepository = skillExchangeRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.connectionRequestRepository = connectionRequestRepository;
    }

    @Transactional
    public SkillExchangeDto proposeExchange(Long initiatorId, SkillExchangeCreateDto createDto) {
        if (initiatorId.equals(createDto.getPartnerId())) {
            throw new BadRequestException("You cannot propose a skill exchange to yourself");
        }

        User initiator = userRepository.findById(initiatorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", initiatorId));

        User partner = userRepository.findById(createDto.getPartnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Partner user not found with id: " + createDto.getPartnerId()));

        // Verify connected status
        List<ConnectionRequest> connections = connectionRequestRepository.findBetweenUsersWithStatus(
                initiatorId,
                createDto.getPartnerId(),
                Collections.singletonList(ConnectionStatus.ACCEPTED)
        );

        if (connections.isEmpty()) {
            throw new BadRequestException("You must be connected with " + partner.getFullName() + " before proposing a skill exchange. Send them a connection request first.");
        }

        Skill initiatorSkill = skillRepository.findById(createDto.getInitiatorSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Offered skill not found with id: " + createDto.getInitiatorSkillId()));

        Skill partnerSkill = skillRepository.findById(createDto.getPartnerSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Partner skill not found with id: " + createDto.getPartnerSkillId()));

        SkillExchange exchange = new SkillExchange(
                initiator,
                partner,
                initiatorSkill,
                partnerSkill,
                createDto.getTitle().trim(),
                createDto.getLearningGoals(),
                createDto.getScheduleInfo()
        );

        SkillExchange saved = skillExchangeRepository.save(exchange);
        return mapToDto(saved);
    }

    @Transactional
    public SkillExchangeDto updateExchangeStatus(Long currentUserId, Long exchangeId, SkillExchangeStatusUpdateDto updateDto) {
        SkillExchange exchange = skillExchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill exchange not found with id: " + exchangeId));

        boolean isInitiator = exchange.getInitiator().getId().equals(currentUserId);
        boolean isPartner = exchange.getPartner().getId().equals(currentUserId);

        if (!isInitiator && !isPartner) {
            throw new UnauthorizedException("You are not part of this skill exchange");
        }

        ExchangeStatus newStatus = updateDto.getStatus();

        // Permission rules: Only partner can accept a PROPOSED exchange
        if (exchange.getStatus() == ExchangeStatus.PROPOSED && newStatus == ExchangeStatus.ACCEPTED && !isPartner) {
            throw new BadRequestException("Only the invited partner can accept a proposed skill exchange");
        }

        exchange.setStatus(newStatus);
        if (updateDto.getNotes() != null) {
            exchange.setNotes(updateDto.getNotes());
        }
        exchange.setUpdatedAt(LocalDateTime.now());

        SkillExchange updated = skillExchangeRepository.save(exchange);
        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public List<SkillExchangeDto> getUserExchanges(Long userId, ExchangeStatus statusFilter) {
        List<SkillExchange> list;
        if (statusFilter != null) {
            list = skillExchangeRepository.findUserExchangesByStatus(userId, statusFilter);
        } else {
            list = skillExchangeRepository.findUserExchanges(userId);
        }

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SkillExchangeDto getExchangeById(Long userId, Long exchangeId) {
        SkillExchange exchange = skillExchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill exchange not found with id: " + exchangeId));

        boolean isInitiator = exchange.getInitiator().getId().equals(userId);
        boolean isPartner = exchange.getPartner().getId().equals(userId);

        if (!isInitiator && !isPartner) {
            throw new UnauthorizedException("You are not authorized to view this skill exchange");
        }

        return mapToDto(exchange);
    }

    public SkillExchangeDto mapToDto(SkillExchange exchange) {
        SkillExchangeDto dto = new SkillExchangeDto();
        dto.setId(exchange.getId());

        dto.setInitiatorId(exchange.getInitiator().getId());
        dto.setInitiatorUsername(exchange.getInitiator().getUsername());
        dto.setInitiatorFullName(exchange.getInitiator().getFullName());
        dto.setInitiatorAvatarUrl(exchange.getInitiator().getAvatarUrl());

        dto.setPartnerId(exchange.getPartner().getId());
        dto.setPartnerUsername(exchange.getPartner().getUsername());
        dto.setPartnerFullName(exchange.getPartner().getFullName());
        dto.setPartnerAvatarUrl(exchange.getPartner().getAvatarUrl());

        dto.setInitiatorSkillId(exchange.getInitiatorSkill().getId());
        dto.setInitiatorSkillName(exchange.getInitiatorSkill().getName());
        dto.setInitiatorSkillCategory(exchange.getInitiatorSkill().getCategory());

        dto.setPartnerSkillId(exchange.getPartnerSkill().getId());
        dto.setPartnerSkillName(exchange.getPartnerSkill().getName());
        dto.setPartnerSkillCategory(exchange.getPartnerSkill().getCategory());

        dto.setTitle(exchange.getTitle());
        dto.setLearningGoals(exchange.getLearningGoals());
        dto.setStatus(exchange.getStatus());
        dto.setScheduleInfo(exchange.getScheduleInfo());
        dto.setNotes(exchange.getNotes());
        dto.setCreatedAt(exchange.getCreatedAt());
        dto.setUpdatedAt(exchange.getUpdatedAt());

        return dto;
    }
}
