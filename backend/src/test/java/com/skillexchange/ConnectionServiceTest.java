package com.skillexchange;

import com.skillexchange.dto.request.ConnectionRequestDto;
import com.skillexchange.dto.response.ConnectionResponseDto;
import com.skillexchange.entity.ConnectionRequest;
import com.skillexchange.entity.User;
import com.skillexchange.entity.enums.ConnectionStatus;
import com.skillexchange.exception.BadRequestException;
import com.skillexchange.repository.ConnectionRequestRepository;
import com.skillexchange.repository.UserRepository;
import com.skillexchange.service.ConnectionService;
import com.skillexchange.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConnectionServiceTest {

    @Mock
    private ConnectionRequestRepository connectionRequestRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private ConnectionService connectionService;

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        user1 = new User("alice", "alice@example.com", "pass", "Alice Smith");
        user1.setId(1L);

        user2 = new User("bob", "bob@example.com", "pass", "Bob Jones");
        user2.setId(2L);
    }

    @Test
    void testSendConnectionRequestSelfThrowsException() {
        ConnectionRequestDto dto = new ConnectionRequestDto(1L, "Hello self");
        assertThrows(BadRequestException.class, () -> connectionService.sendConnectionRequest(1L, dto));
    }

    @Test
    void testSendConnectionRequestSuccess() {
        ConnectionRequestDto dto = new ConnectionRequestDto(2L, "Let's exchange skills!");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(connectionRequestRepository.findBetweenUsersWithStatus(eq(1L), eq(2L), any())).thenReturn(Collections.emptyList());

        ConnectionRequest saved = new ConnectionRequest(user1, user2, dto.getMessage());
        saved.setId(10L);
        when(connectionRequestRepository.save(any(ConnectionRequest.class))).thenReturn(saved);

        ConnectionResponseDto result = connectionService.sendConnectionRequest(1L, dto);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals(1L, result.getSenderId());
        assertEquals(2L, result.getReceiverId());
        assertEquals(ConnectionStatus.PENDING, result.getStatus());
    }

    @Test
    void testRespondToConnectionRequestAccept() {
        ConnectionRequest request = new ConnectionRequest(user1, user2, "Hi");
        request.setId(20L);
        when(connectionRequestRepository.findById(20L)).thenReturn(Optional.of(request));
        when(connectionRequestRepository.save(any(ConnectionRequest.class))).thenAnswer(i -> i.getArgument(0));

        ConnectionResponseDto result = connectionService.respondToRequest(2L, 20L, ConnectionStatus.ACCEPTED);

        assertNotNull(result);
        assertEquals(ConnectionStatus.ACCEPTED, result.getStatus());
        assertNotNull(result.getRespondedAt());
    }
}
