package com.skillexchange;

import com.skillexchange.config.JwtTokenProvider;
import com.skillexchange.dto.request.LoginRequest;
import com.skillexchange.dto.request.RegisterRequest;
import com.skillexchange.dto.response.AuthResponse;
import com.skillexchange.entity.User;
import com.skillexchange.entity.enums.Role;
import com.skillexchange.exception.BadRequestException;
import com.skillexchange.repository.UserRepository;
import com.skillexchange.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("johndoe", "john@example.com", "hashed_password", "John Doe");
        sampleUser.setId(1L);
        sampleUser.setRole(Role.ROLE_USER);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("johndoe");
        request.setEmail("john@example.com");
        request.setPassword("password123");
        request.setFullName("John Doe");

        when(userRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateTokenFromUsernameAndId(eq("johndoe"), eq(1L))).thenReturn("mock_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock_token", response.getToken());
        assertEquals("johndoe", response.getUsername());
        assertEquals("John Doe", response.getFullName());
    }

    @Test
    void testRegisterDuplicateUsernameThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("johndoe");
        request.setEmail("john@example.com");
        request.setPassword("password123");
        request.setFullName("John Doe");

        when(userRepository.existsByUsername("johndoe")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("johndoe", "password123");

        when(userRepository.findByUsernameOrEmail("johndoe", "johndoe")).thenReturn(Optional.of(sampleUser));
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock_token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock_token", response.getToken());
        assertEquals("johndoe", response.getUsername());
    }
}
