package com.chorepay.backend.achievement;

import com.chorepay.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserAchievementRepository
        extends JpaRepository<UserAchievement, UUID> {

    boolean existsByChildUserAndAchievement(
            User childUser,
            Achievement achievement
    );

    List<UserAchievement>
    findByChildUserOrderByUnlockedAtDesc(
            User childUser
    );
}