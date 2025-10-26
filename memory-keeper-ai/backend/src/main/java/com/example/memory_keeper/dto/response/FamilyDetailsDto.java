package com.example.memory_keeper.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class FamilyDetailsDto {
    private Long id;
    private String name;
    private String inviteCode; // Will be null for non-grandparents
    private List<MemberDto> members;

    @Data
    @Builder
    public static class MemberDto {
        private Long id;
        private String name;
        private String role;
        private String avatarUrl;
    }
}