package com.skillexchange.controller;

import com.skillexchange.config.UserPrincipal;
import com.skillexchange.dto.request.ConnectionRequestDto;
import com.skillexchange.dto.response.ConnectionResponseDto;
import com.skillexchange.dto.response.UserSummaryDto;
import com.skillexchange.entity.enums.ConnectionStatus;
import com.skillexchange.service.ConnectionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @PostMapping("/request")
    public ResponseEntity<ConnectionResponseDto> sendRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ConnectionRequestDto dto) {
        ConnectionResponseDto response = connectionService.sendConnectionRequest(currentUser.getId(), dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/request/{id}/respond")
    public ResponseEntity<ConnectionResponseDto> respondToRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestParam ConnectionStatus status) {
        ConnectionResponseDto response = connectionService.respondToRequest(currentUser.getId(), id, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<ConnectionResponseDto>> getIncomingRequests(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ConnectionResponseDto> list = connectionService.getIncomingRequests(currentUser.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/outgoing")
    public ResponseEntity<List<ConnectionResponseDto>> getOutgoingRequests(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ConnectionResponseDto> list = connectionService.getOutgoingRequests(currentUser.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/peers")
    public ResponseEntity<List<UserSummaryDto>> getConnectedPeers(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<UserSummaryDto> list = connectionService.getConnectedPeers(currentUser.getId());
        return ResponseEntity.ok(list);
    }
}
