package com.example.memory_keeper.controller;
// src/main/java/com/memorykeeper/controller/AuthController.java
package com.memorykeeper.controller;

import com.memorykeeper.dto.request.LoginRequest;
import com.memorykeeper.dto.request.SignupRequest;
import com.memorykeeper.dto.response.ApiResponse;
import com.memorykeeper.dto.response.JwtResponse;
import com.memorykeeper.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    @Operation(summary = "Register new user")
    public ResponseEntity<ApiResponse<JwtResponse>> signup(
            @Valid @RequestBody SignupRequest request) {

        JwtResponse response = authService.signup(request);
        return ResponseEntity.ok(ApiResponse.success(response, "User registered successfully"));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<ApiResponse<JwtResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }
}