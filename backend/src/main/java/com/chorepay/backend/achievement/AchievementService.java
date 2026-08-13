package com.chorepay.backend.achievement;

import com.chorepay.backend.progress.UserProgress;
import com.chorepay.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.chorepay.backend.notification.NotificationService;
import com.chorepay.backend.notification.NotificationType;

import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final NotificationService notificationService;

    public AchievementService(
        AchievementRepository achievementRepository,
        UserAchievementRepository userAchievementRepository,
        NotificationService notificationService
) {
    this.achievementRepository = achievementRepository;
    this.userAchievementRepository = userAchievementRepository;
    this.notificationService = notificationService;
}

    @Transactional
    public void checkAndUnlockAchievements(
            User child,
            UserProgress progress
    ) {

        List<Achievement> achievements =
                achievementRepository.findByActiveTrue();

        for (Achievement achievement : achievements) {

            boolean alreadyUnlocked =
                    userAchievementRepository
                            .existsByChildUserAndAchievement(
                                    child,
                                    achievement
                            );

            if (alreadyUnlocked) {
                continue;
            }

            boolean achieved =
                    switch (achievement.getAchievementType()) {

                        case CHORES_COMPLETED ->
                                progress.getCompletedChoreCount()
                                        >= achievement.getThresholdValue();

                        case STREAK ->
                                progress.getCurrentStreak()
                                        >= achievement.getThresholdValue();

                        case LEVEL ->
                                progress.getCurrentLevel()
                                        >= achievement.getThresholdValue();

                        case COINS_EARNED ->
                                progress.getCoinBalance()
                                        >= achievement.getThresholdValue();
                    };

            if (!achieved) {
                continue;
            }

            UserAchievement userAchievement =
                    new UserAchievement();

            userAchievement.setChildUser(child);
            userAchievement.setAchievement(achievement);

            userAchievementRepository.save(userAchievement);
            notificationService.createNotification(
        child,
        NotificationType.ACHIEVEMENT_UNLOCKED,
        "Achievement unlocked!",
        "You unlocked "
                + achievement.getName()
                + "!",
        achievement.getId()
);
        }
    }

    public List<AchievementResponse> getMyAchievements(
        User child
) {

    List<Achievement> achievements =
            achievementRepository.findByActiveTrue();

    List<UserAchievement> unlockedAchievements =
            userAchievementRepository
                    .findByChildUserOrderByUnlockedAtDesc(child);

    return achievements
            .stream()
            .map(achievement -> {

                UserAchievement unlocked =
                        unlockedAchievements
                                .stream()
                                .filter(userAchievement ->
                                        userAchievement
                                                .getAchievement()
                                                .getId()
                                                .equals(
                                                        achievement.getId()
                                                )
                                )
                                .findFirst()
                                .orElse(null);

                return new AchievementResponse(
                        achievement.getId(),
                        achievement.getCode(),
                        achievement.getName(),
                        achievement.getDescription(),
                        achievement.getAchievementType(),
                        achievement.getThresholdValue(),
                        achievement.getIconKey(),
                        unlocked != null,
                        unlocked == null
                                ? null
                                : unlocked.getUnlockedAt()
                );
            })
            .toList();
}
}