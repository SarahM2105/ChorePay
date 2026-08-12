package com.chorepay.backend.achievement;

import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "user_achievements",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_achievement",
                        columnNames = {
                                "child_user_id",
                                "achievement_id"
                        }
                )
        }
)
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_user_id", nullable = false)
    private User childUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "achievement_id", nullable = false)
    private Achievement achievement;

    @Column(name = "unlocked_at", nullable = false)
    private Instant unlockedAt;

    public UserAchievement() {
    }

    @PrePersist
    protected void onCreate() {
        if (unlockedAt == null) {
            unlockedAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public User getChildUser() {
        return childUser;
    }

    public void setChildUser(User childUser) {
        this.childUser = childUser;
    }

    public Achievement getAchievement() {
        return achievement;
    }

    public void setAchievement(
            Achievement achievement
    ) {
        this.achievement = achievement;
    }

    public Instant getUnlockedAt() {
        return unlockedAt;
    }

    public void setUnlockedAt(
            Instant unlockedAt
    ) {
        this.unlockedAt = unlockedAt;
    }
}