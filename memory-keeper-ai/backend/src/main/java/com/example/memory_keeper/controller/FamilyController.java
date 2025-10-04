package com.example.memory_keeper.controller;

import com.example.memory_keeper.dto.response.ApiResponse;
import com.example.memory_keeper.model.entity.Family;
import com.example.memory_keeper.repository.FamilyRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/families")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Families", description = "Family management endpoints")
public class FamilyController {

    private final FamilyRepository familyRepository;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get families for user")
    public ResponseEntity<ApiResponse<List<Family>>> getUserFamilies(@PathVariable Long userId) {
        List<Family> families = familyRepository.findByCreatedById(userId);
        return ResponseEntity.ok(ApiResponse.success(families));
    }

    @PostMapping
    @Operation(summary = "Create family")
    public ResponseEntity<ApiResponse<Family>> createFamily(@RequestBody Family family) {
        Family savedFamily = familyRepository.save(family);
        return ResponseEntity.ok(ApiResponse.success(savedFamily, "Family created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get family by ID")
    public ResponseEntity<ApiResponse<Family>> getFamily(@PathVariable Long id) {
        Family family = familyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Family not found"));
        return ResponseEntity.ok(ApiResponse.success(family));
    }
}