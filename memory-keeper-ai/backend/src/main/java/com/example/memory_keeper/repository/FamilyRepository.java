package com.example.memory_keeper.repository;


import com.example.memory_keeper.model.entity.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {
    List<Family> findByCreatedById(Long userId);
    Optional<Family> findByInviteCode(String inviteCode);
}