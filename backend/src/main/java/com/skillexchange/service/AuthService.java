package com.skillexchange.service;

import com.skillexchange.config.JwtTokenProvider;
import com.skillexchange.dto.request.LoginRequest;
import com.skillexchange.dto.request.RegisterRequest;
import com.skillexchange.dto.response.AuthResponse;
import com.skillexchange.entity.User;
import com.skillexchange.entity.enums.Role;
import com.skillexchange.exception.BadRequestException;
import com.skillexchange.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setBio(request.getBio());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setInterests(request.getInterests());
        user.setLocation(request.getLocation());
        user.setRole(Role.ROLE_USER);

        User savedUser = userRepository.save(user);

        // Generate JWT directly
        String token = tokenProvider.generateTokenFromUsernameAndId(savedUser.getUsername(), savedUser.getId());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getAvatarUrl(),
                savedUser.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsernameOrEmail().trim();

        // Find user to know their exact username
        User user = userRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new BadRequestException("Invalid username/email or password"));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getRole().name()
        );
    }
}
