package com.chorepay.backend.achievement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AchievementRepository
        extends JpaRepository<Achievement, UUID> {

    List<Achievement> findByActiveTrue();
    boolean existsByCode(String code);

    List<Achievement> findByAchievementTypeAndActiveTrue(
            AchievementType achievementType
    );
}