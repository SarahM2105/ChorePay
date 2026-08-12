package com.chorepay.backend.reward;

import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reward_redemptions")
public class RewardRedemption {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reward_id", nullable = false)
    private Reward reward;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_user_id", nullable = false)
    private User childUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RewardRedemptionStatus status =
            RewardRedemptionStatus.PENDING;

    // Snapshot so historical requests aren't affected
    // if the parent later edits the reward.
    @Column(name = "reward_name_snapshot", nullable = false, length = 120)
    private String rewardNameSnapshot;

    @Column(name = "coin_cost_snapshot", nullable = false)
    private Integer coinCostSnapshot;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private Instant requestedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_user_id")
    private User reviewedByUser;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "parent_note", columnDefinition = "TEXT")
    private String parentNote;

    @Column(name = "fulfilled_at")
    private Instant fulfilledAt;

    public RewardRedemption() {
    }

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = RewardRedemptionStatus.PENDING;
        }

        requestedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Reward getReward() {
        return reward;
    }

    public void setReward(Reward reward) {
        this.reward = reward;
    }

    public User getChildUser() {
        return childUser;
    }

    public void setChildUser(User childUser) {
        this.childUser = childUser;
    }

    public RewardRedemptionStatus getStatus() {
        return status;
    }

    public void setStatus(
            RewardRedemptionStatus status
    ) {
        this.status = status;
    }

    public String getRewardNameSnapshot() {
        return rewardNameSnapshot;
    }

    public void setRewardNameSnapshot(
            String rewardNameSnapshot
    ) {
        this.rewardNameSnapshot = rewardNameSnapshot;
    }

    public Integer getCoinCostSnapshot() {
        return coinCostSnapshot;
    }

    public void setCoinCostSnapshot(
            Integer coinCostSnapshot
    ) {
        this.coinCostSnapshot = coinCostSnapshot;
    }

    public Instant getRequestedAt() {
        return requestedAt;
    }

    public User getReviewedByUser() {
        return reviewedByUser;
    }

    public void setReviewedByUser(
            User reviewedByUser
    ) {
        this.reviewedByUser = reviewedByUser;
    }

    public Instant getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(
            Instant reviewedAt
    ) {
        this.reviewedAt = reviewedAt;
    }

    public String getParentNote() {
        return parentNote;
    }

    public void setParentNote(
            String parentNote
    ) {
        this.parentNote = parentNote;
    }

    public Instant getFulfilledAt() {
        return fulfilledAt;
    }

    public void setFulfilledAt(
            Instant fulfilledAt
    ) {
        this.fulfilledAt = fulfilledAt;
    }
}