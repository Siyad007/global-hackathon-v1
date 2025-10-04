package com.example.memory_keeper.repository;
// src/main/java/com/memorykeeper/repository/TimeCapsuleRepository.java
package com.memorykeeper.repository;

import com.memorykeeper.model.entity.TimeCapsule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeCapsuleRepository extends JpaRepository<TimeCapsule, Long> {
    List<TimeCapsule> findByUserIdAndIsDeliveredFalse(Long userId);
    List<TimeCapsule> findByDeliveryDateAndIsDeliveredFalse(LocalDate deliveryDate);
}