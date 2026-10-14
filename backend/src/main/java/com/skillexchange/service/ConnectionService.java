package com.skillexchange.service;

import com.skillexchange.dto.request.ConnectionRequestDto;
import com.skillexchange.dto.response.ConnectionResponseDto;
import com.skillexchange.dto.response.UserSummaryDto;
import com.skillexchange.entity.ConnectionRequest;
import com.skillexchange.entity.User;
import com.skillexchange.entity.enums.ConnectionStatus;
import com.skillexchange.exception.BadRequestException;
import com.skillexchange.exception.ResourceNotFoundException;
import com.skillexchange.exception.UnauthorizedException;
import com.skillexchange.repository.ConnectionRequestRepository;
import com.skillexchange.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConnectionService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public ConnectionService(ConnectionRequestRepository connectionRequestRepository,
                             UserRepository userRepository,
                             @Lazy UserService userService) {
        this.connectionRequestRepository = connectionRequestRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Transactional
    public ConnectionResponseDto sendConnectionRequest(Long senderId, ConnectionRequestDto dto) {
        if (senderId.equals(dto.getReceiverId())) {
            throw new BadRequestException("You cannot send a connection request to yourself");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", senderId));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        // Check if there is an existing pending or accepted request between them
        List<ConnectionRequest> existing = connectionRequestRepository.findBetweenUsersWithStatus(
                senderId,
                dto.getReceiverId(),
                Arrays.asList(ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED)
        );

        if (!existing.isEmpty()) {
            ConnectionRequest request = existing.get(0);
            if (request.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new BadRequestException("You are already connected with " + receiver.getFullName());
            } else {
                throw new BadRequestException("A connection request is already pending between you and " + receiver.getFullName());
            }
        }

        ConnectionRequest request = new ConnectionRequest(
                sender,
                receiver,
                dto.getMessage() != null ? dto.getMessage().trim() : "Hi, I'd like to connect and exchange skills with you!"
        );

        ConnectionRequest saved = connectionRequestRepository.save(request);
        return mapToDto(saved);
    }

    @Transactional
    public ConnectionResponseDto respondToRequest(Long currentUserId, Long requestId, ConnectionStatus status) {
        if (status == ConnectionStatus.PENDING) {
            throw new BadRequestException("Invalid response status");
        }

        ConnectionRequest request = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found with id: " + requestId));

        if (!request.getReceiver().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to respond to this request");
        }

        request.setStatus(status);
        request.setRespondedAt(LocalDateTime.now());
        ConnectionRequest updated = connectionRequestRepository.save(request);
        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponseDto> getIncomingRequests(Long userId) {
        return connectionRequestRepository.findByReceiverIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponseDto> getOutgoingRequests(Long userId) {
        return connectionRequestRepository.findBySenderIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> getConnectedPeers(Long userId) {
        List<ConnectionRequest> accepted = connectionRequestRepository.findAcceptedConnectionsForUser(userId);
        List<UserSummaryDto> peers = new ArrayList<>();

        for (ConnectionRequest cr : accepted) {
            User peer = cr.getSender().getId().equals(userId) ? cr.getReceiver() : cr.getSender();
            UserSummaryDto dto = userService.buildUserSummary(peer, userId);
            dto.setConnectionStatus("CONNECTED");
            dto.setConnectionId(cr.getId());
            peers.add(dto);
        }

        return peers;
    }

    public ConnectionResponseDto mapToDto(ConnectionRequest cr) {
        ConnectionResponseDto dto = new ConnectionResponseDto();
        dto.setId(cr.getId());
        dto.setSenderId(cr.getSender().getId());
        dto.setSenderUsername(cr.getSender().getUsername());
        dto.setSenderFullName(cr.getSender().getFullName());
        dto.setSenderAvatarUrl(cr.getSender().getAvatarUrl());

        dto.setReceiverId(cr.getReceiver().getId());
        dto.setReceiverUsername(cr.getReceiver().getUsername());
        dto.setReceiverFullName(cr.getReceiver().getFullName());
        dto.setReceiverAvatarUrl(cr.getReceiver().getAvatarUrl());

        dto.setMessage(cr.getMessage());
        dto.setStatus(cr.getStatus());
        dto.setCreatedAt(cr.getCreatedAt());
        dto.setRespondedAt(cr.getRespondedAt());
        return dto;
    }
}
