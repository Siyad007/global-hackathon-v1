package com.example.memory_keeper.repository;

import com.example.memory_keeper.model.entity.Reaction;
import com.example.memory_keeper.model.enums.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    boolean existsByStoryIdAndUserIdAndReactionType(Long storyId, Long userId, ReactionType reactionType);
    Optional<Reaction> findByStoryIdAndUserIdAndReactionType(Long storyId, Long userId, ReactionType reactionType);
    long countByStoryIdAndReactionType(Long storyId, ReactionType reactionType);
}