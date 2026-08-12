package com.chorepay.backend.progress;

import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "user_progress")
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_user_id", nullable = false, unique = true)
    private User childUser;

    @Column(name = "coin_balance", nullable = false)
    private Integer coinBalance = 0;

    @Column(name = "total_xp", nullable = false)
    private Integer totalXp = 0;

    @Column(name = "current_level", nullable = false)
    private Integer currentLevel = 1;

    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    private Integer longestStreak = 0;

    @Column(name = "last_completed_chore_date")
    private LocalDate lastCompletedChoreDate;

    @Column(name = "completed_chore_count", nullable = false)
    private Integer completedChoreCount = 0;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public UserProgress() {
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
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

    public Integer getCoinBalance() {
        return coinBalance;
    }

    public void setCoinBalance(Integer coinBalance) {
        this.coinBalance = coinBalance;
    }

    public Integer getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(Integer totalXp) {
        this.totalXp = totalXp;
    }

    public Integer getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(Integer currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(Integer longestStreak) {
        this.longestStreak = longestStreak;
    }

    public LocalDate getLastCompletedChoreDate() {
        return lastCompletedChoreDate;
    }

    public void setLastCompletedChoreDate(LocalDate lastCompletedChoreDate) {
        this.lastCompletedChoreDate = lastCompletedChoreDate;
    }

    public Integer getCompletedChoreCount() {
        return completedChoreCount;
    }

    public void setCompletedChoreCount(Integer completedChoreCount) {
        this.completedChoreCount = completedChoreCount;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}