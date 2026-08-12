package com.chorepay.backend.achievement;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AchievementSeeder implements CommandLineRunner {

    private final AchievementRepository achievementRepository;

    public AchievementSeeder(
            AchievementRepository achievementRepository
    ) {
        this.achievementRepository = achievementRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        createIfMissing(
                "FIRST_CHORE",
                "First Steps",
                "Complete your first chore.",
                AchievementType.CHORES_COMPLETED,
                1,
                "first_chore"
        );

        createIfMissing(
                "CHORES_5",
                "Chore Starter",
                "Complete 5 chores.",
                AchievementType.CHORES_COMPLETED,
                5,
                "chores_5"
        );

        createIfMissing(
                "CHORES_25",
                "Chore Champion",
                "Complete 25 chores.",
                AchievementType.CHORES_COMPLETED,
                25,
                "chores_25"
        );

        createIfMissing(
                "STREAK_3",
                "On a Roll",
                "Reach a 3-day chore streak.",
                AchievementType.STREAK,
                3,
                "streak_3"
        );

        createIfMissing(
                "STREAK_7",
                "Streak Master",
                "Reach a 7-day chore streak.",
                AchievementType.STREAK,
                7,
                "streak_7"
        );

        createIfMissing(
                "LEVEL_2",
                "Level Up",
                "Reach level 2.",
                AchievementType.LEVEL,
                2,
                "level_2"
        );

        createIfMissing(
                "LEVEL_5",
                "Rising Star",
                "Reach level 5.",
                AchievementType.LEVEL,
                5,
                "level_5"
        );

        createIfMissing(
                "COINS_100",
                "Coin Collector",
                "Build a balance of 100 coins.",
                AchievementType.COINS_EARNED,
                100,
                "coins_100"
        );
    }

    private void createIfMissing(
            String code,
            String name,
            String description,
            AchievementType type,
            int threshold,
            String iconKey
    ) {

        if (achievementRepository.existsByCode(code)) {
    return;
}


        Achievement achievement = new Achievement();

        achievement.setCode(code);
        achievement.setName(name);
        achievement.setDescription(description);
        achievement.setAchievementType(type);
        achievement.setThresholdValue(threshold);
        achievement.setIconKey(iconKey);
        achievement.setActive(true);

        achievementRepository.save(achievement);
    }
}