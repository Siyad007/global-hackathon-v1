package com.example.memory_keeper.repository;
// src/main/java/com/memorykeeper/repository/ReactionRepository.java
package com.memorykeeper.repository;

import com.memorykeeper.model.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    boolean existsByStoryIdAndUserIdAndReactionType(Long storyId, Long userId, String reactionType);
}