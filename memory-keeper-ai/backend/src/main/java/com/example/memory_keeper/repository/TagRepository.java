package com.example.memory_keeper.repository;
// src/main/java/com/memorykeeper/repository/TagRepository.java
package com.memorykeeper.repository;

import com.memorykeeper.model.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
}