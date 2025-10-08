// src/main/java/com/example/memory_keeper/dto/response/JwtResponse.java
package com.example.memory_keeper.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; // <-- ADD THIS IMPORT

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String name;
    private String role;

    // Make sure these fields exist
    private Long familyId;
    private String familyInviteCode;

    // Add this field for "Member Since"
    private LocalDateTime createdAt;
}