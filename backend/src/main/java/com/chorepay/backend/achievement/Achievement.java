package com.chorepay.backend.achievement;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "achievements",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_achievement_code",
                        columnNames = "code"
                )
        }
)
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 60)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "achievement_type", nullable = false, length = 30)
    private AchievementType achievementType;

    @Column(name = "threshold_value", nullable = false)
    private Integer thresholdValue;

    @Column(name = "icon_key", length = 100)
    private String iconKey;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Achievement() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AchievementType getAchievementType() {
        return achievementType;
    }

    public void setAchievementType(
            AchievementType achievementType
    ) {
        this.achievementType = achievementType;
    }

    public Integer getThresholdValue() {
        return thresholdValue;
    }

    public void setThresholdValue(
            Integer thresholdValue
    ) {
        this.thresholdValue = thresholdValue;
    }

    public String getIconKey() {
        return iconKey;
    }

    public void setIconKey(String iconKey) {
        this.iconKey = iconKey;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}