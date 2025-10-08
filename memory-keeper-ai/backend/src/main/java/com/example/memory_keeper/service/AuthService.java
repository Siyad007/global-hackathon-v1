// src/main/java/com/example/memory_keeper/service/AuthService.java
package com.example.memory_keeper.service;

import com.example.memory_keeper.dto.request.LoginRequest;
import com.example.memory_keeper.dto.request.SignupRequest;
import com.example.memory_keeper.dto.response.JwtResponse;
import com.example.memory_keeper.exception.BadRequestException;
import com.example.memory_keeper.model.entity.Family;
import com.example.memory_keeper.model.entity.User;
import com.example.memory_keeper.model.enums.UserRole;
import com.example.memory_keeper.repository.FamilyRepository;
import com.example.memory_keeper.repository.UserRepository;
import com.example.memory_keeper.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final FamilyRepository familyRepository;

    @Transactional
    public JwtResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        UserRole role = request.getRole();
        if (role == null) {
            throw new BadRequestException("Role must be specified.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(role)
                .isActive(true)
                .build();

        // Handle family logic BEFORE saving the user
        if (role == UserRole.GRANDPARENT) {
            // Create a new family for grandparent
            String inviteCode = generateUniqueInviteCode();
            Family family = Family.builder()
                    .name(request.getName() + "'s Family")
                    .inviteCode(inviteCode)
                    .build();
            Family savedFamily = familyRepository.save(family);
            user.setFamily(savedFamily);
            log.info("Created new family with invite code: {} for grandparent: {}", inviteCode, user.getEmail());

        } else if (role == UserRole.FAMILY_MEMBER) {
            // Family member must provide an invite code
            if (!StringUtils.hasText(request.getInviteCode())) {
                throw new BadRequestException("Invite code is required for family members");
            }

            Family family = familyRepository.findByInviteCode(request.getInviteCode())
                    .orElseThrow(() -> new BadRequestException("Invalid invite code"));
            user.setFamily(family);
            log.info("Family member {} joined family: {}", user.getEmail(), family.getName());
        }

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {} with role: {}", savedUser.getEmail(), savedUser.getRole());

        // Automatically log them in after signup
        return login(new LoginRequest(request.getEmail(), request.getPassword()));
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        // Use eager fetching to load family data
        User user = userRepository.findByEmailWithFamily(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found after successful authentication."));

        log.info("User logged in: {}. Family loaded: {}", user.getEmail(), user.getFamily() != null);

        Long familyId = null;
        String familyInviteCode = null;

        if (user.getFamily() != null) {
            familyId = user.getFamily().getId();
            if (user.getRole() == UserRole.GRANDPARENT) {
                familyInviteCode = user.getFamily().getInviteCode();
                log.info("Returning invite code for grandparent: {}", familyInviteCode);
            }
        }

        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .familyId(familyId)
                .familyInviteCode(familyInviteCode)
                .createdAt(user.getCreatedAt())
                .build();
    }

    /**
     * Generates a unique invite code and ensures it doesn't already exist in the database.
     */
    private String generateUniqueInviteCode() {
        String code;
        do {
            code = generateInviteCode();
        } while (familyRepository.findByInviteCode(code).isPresent());
        return code;
    }

    /**
     * Generates a simple, readable code like "ABC-123".
     * Excludes confusing characters like 'O' vs '0' or 'I' vs '1'.
     */
    private String generateInviteCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        String nums = "23456789";
        StringBuilder code = new StringBuilder();
        Random rnd = new Random();
        for (int i = 0; i < 3; i++) {
            code.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        code.append("-");
        for (int i = 0; i < 3; i++) {
            code.append(nums.charAt(rnd.nextInt(nums.length())));
        }
        return code.toString();
    }
}