package com.skillexchange.controller;

import com.skillexchange.dto.request.LoginRequest;
import com.skillexchange.dto.request.RegisterRequest;
import com.skillexchange.dto.response.ApiResponse;
import com.skillexchange.dto.response.AuthResponse;
import com.skillexchange.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        return ResponseEntity.ok(new ApiResponse(true, "Successfully logged out"));
    }
}
