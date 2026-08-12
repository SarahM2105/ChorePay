package com.chorepay.backend.chore;

import com.chorepay.backend.family.Family;
import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "chore_templates")
public class ChoreTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 80)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChoreDifficulty difficulty;

    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes;

    @Column(name = "coin_reward", nullable = false)
    private Integer coinReward;

    @Column(name = "xp_reward", nullable = false)
    private Integer xpReward;

    @Column(name = "money_reward_pence")
    private Integer moneyRewardPence;

    @Column(name = "late_penalty_percent", nullable = false)
    private Integer latePenaltyPercent = 0;

    @Column(name = "resubmission_penalty_percent", nullable = false)
    private Integer resubmissionPenaltyPercent = 0;

    @Column(name = "photo_required", nullable = false)
    private boolean photoRequired;

    @Column(name = "comment_required", nullable = false)
    private boolean commentRequired;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ChoreTemplate() {
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Family getFamily() {
        return family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }

    public User getCreatedByUser() {
        return createdByUser;
    }

    public void setCreatedByUser(User createdByUser) {
        this.createdByUser = createdByUser;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public ChoreDifficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(ChoreDifficulty difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(Integer estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public Integer getCoinReward() {
        return coinReward;
    }

    public void setCoinReward(Integer coinReward) {
        this.coinReward = coinReward;
    }

    public Integer getXpReward() {
        return xpReward;
    }

    public void setXpReward(Integer xpReward) {
        this.xpReward = xpReward;
    }

    public Integer getMoneyRewardPence() {
        return moneyRewardPence;
    }

    public void setMoneyRewardPence(Integer moneyRewardPence) {
        this.moneyRewardPence = moneyRewardPence;
    }

    public Integer getLatePenaltyPercent() {
        return latePenaltyPercent;
    }

    public void setLatePenaltyPercent(Integer latePenaltyPercent) {
        this.latePenaltyPercent = latePenaltyPercent;
    }

    public Integer getResubmissionPenaltyPercent() {
        return resubmissionPenaltyPercent;
    }

    public void setResubmissionPenaltyPercent(Integer resubmissionPenaltyPercent) {
        this.resubmissionPenaltyPercent = resubmissionPenaltyPercent;
    }

    public boolean isPhotoRequired() {
        return photoRequired;
    }

    public void setPhotoRequired(boolean photoRequired) {
        this.photoRequired = photoRequired;
    }

    public boolean isCommentRequired() {
        return commentRequired;
    }

    public void setCommentRequired(boolean commentRequired) {
        this.commentRequired = commentRequired;
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

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}