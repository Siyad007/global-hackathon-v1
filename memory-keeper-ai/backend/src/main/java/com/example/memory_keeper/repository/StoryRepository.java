package com.example.memory_keeper.repository;
// src/main/java/com/memorykeeper/repository/StoryRepository.java
package com.memorykeeper.repository;

import com.memorykeeper.model.entity.Story;
import com.memorykeeper.model.enums.StoryCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    Page<Story> findByUserId(Long userId, Pageable pageable);

    Page<Story> findByCategory(StoryCategory category, Pageable pageable);

    @Query("SELECT s FROM Story s WHERE " +
            "LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.transcript) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.enhancedStory) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Story> searchStories(@Param("query") String query, Pageable pageable);

    long countByUserId(Long userId);
}