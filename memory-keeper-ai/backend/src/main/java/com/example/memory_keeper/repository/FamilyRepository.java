package com.example.memory_keeper.repository;
// src/main/java/com/memorykeeper/repository/FamilyRepository.java
package com.memorykeeper.repository;

import com.memorykeeper.model.entity.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {
    List<Family> findByCreatedById(Long userId);
}