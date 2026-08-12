package com.chorepay.backend.achievement;

import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(
            AchievementService achievementService
    ) {
        this.achievementService = achievementService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<AchievementResponse>> getMyAchievements(
            @AuthenticationPrincipal User user
    ) {

        if (user.getUserType() != UserType.CHILD) {
            throw new IllegalArgumentException(
                    "Only children can view child achievements."
            );
        }

        return ResponseEntity.ok(
                achievementService.getMyAchievements(user)
        );
    }
}