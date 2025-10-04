package com.example.memory_keeper.repository;

// src/main/java/com/memorykeeper/repository/EmotionRepository.java
package com.memorykeeper.repository;

import com.memorykeeper.model.entity.Emotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmotionRepository extends JpaRepository<Emotion, Long> {
}