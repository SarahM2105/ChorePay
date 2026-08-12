package com.chorepay.backend.chore;

import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "chore_assignments")
public class ChoreAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chore_template_id", nullable = false)
    private ChoreTemplate choreTemplate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private ChoreSchedule schedule;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_by_user_id", nullable = false)
    private User assignedByUser;

    @Column(name = "due_at")
    private Instant dueAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChoreAssignmentStatus status = ChoreAssignmentStatus.ASSIGNED;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "coin_reward_snapshot", nullable = false)
    private Integer coinRewardSnapshot;

    @Column(name = "xp_reward_snapshot", nullable = false)
    private Integer xpRewardSnapshot;

    @Column(name = "money_reward_pence_snapshot")
    private Integer moneyRewardPenceSnapshot;

    @Column(name = "late_penalty_percent_snapshot", nullable = false)
    private Integer latePenaltyPercentSnapshot = 0;

    @Column(name = "resubmission_penalty_percent_snapshot", nullable = false)
    private Integer resubmissionPenaltyPercentSnapshot = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ChoreAssignment() {
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

    public ChoreTemplate getChoreTemplate() {
        return choreTemplate;
    }

    public void setChoreTemplate(ChoreTemplate choreTemplate) {
        this.choreTemplate = choreTemplate;
    }

    public ChoreSchedule getSchedule() {
        return schedule;
    }

    public void setSchedule(ChoreSchedule schedule) {
        this.schedule = schedule;
    }

    public User getAssignedByUser() {
        return assignedByUser;
    }

    public void setAssignedByUser(User assignedByUser) {
        this.assignedByUser = assignedByUser;
    }

    public Instant getDueAt() {
        return dueAt;
    }

    public void setDueAt(Instant dueAt) {
        this.dueAt = dueAt;
    }

    public ChoreAssignmentStatus getStatus() {
        return status;
    }

    public void setStatus(ChoreAssignmentStatus status) {
        this.status = status;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getCoinRewardSnapshot() {
        return coinRewardSnapshot;
    }

    public void setCoinRewardSnapshot(Integer coinRewardSnapshot) {
        this.coinRewardSnapshot = coinRewardSnapshot;
    }

    public Integer getXpRewardSnapshot() {
        return xpRewardSnapshot;
    }

    public void setXpRewardSnapshot(Integer xpRewardSnapshot) {
        this.xpRewardSnapshot = xpRewardSnapshot;
    }

    public Integer getMoneyRewardPenceSnapshot() {
        return moneyRewardPenceSnapshot;
    }

    public void setMoneyRewardPenceSnapshot(Integer moneyRewardPenceSnapshot) {
        this.moneyRewardPenceSnapshot = moneyRewardPenceSnapshot;
    }

    public Integer getLatePenaltyPercentSnapshot() {
        return latePenaltyPercentSnapshot;
    }

    public void setLatePenaltyPercentSnapshot(Integer latePenaltyPercentSnapshot) {
        this.latePenaltyPercentSnapshot = latePenaltyPercentSnapshot;
    }

    public Integer getResubmissionPenaltyPercentSnapshot() {
        return resubmissionPenaltyPercentSnapshot;
    }

    public void setResubmissionPenaltyPercentSnapshot(Integer value) {
        this.resubmissionPenaltyPercentSnapshot = value;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}