package com.chorepay.backend.reward;

import com.chorepay.backend.challenge.FamilyChallenge;
import com.chorepay.backend.chore.ChoreSubmission;
import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "reward_transactions",
        uniqueConstraints = {

                @UniqueConstraint(
                        name = "uk_submission_child_reward",
                        columnNames = {
                                "chore_submission_id",
                                "child_user_id"
                        }
                ),

                @UniqueConstraint(
                        name = "uk_challenge_child_reward",
                        columnNames = {
                                "family_challenge_id",
                                "child_user_id"
                        }
                )
        }
)
public class RewardTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_user_id", nullable = false)
    private User childUser;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "transaction_type",
            nullable = false,
            length = 30
    )
    private RewardTransactionType transactionType;

    @Column(nullable = false)
    private Integer amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chore_submission_id")
    private ChoreSubmission choreSubmission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_challenge_id")
    private FamilyChallenge familyChallenge;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;

    public RewardTransaction() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
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

    public RewardTransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(
            RewardTransactionType transactionType
    ) {
        this.transactionType = transactionType;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public ChoreSubmission getChoreSubmission() {
        return choreSubmission;
    }

    public void setChoreSubmission(
            ChoreSubmission choreSubmission
    ) {
        this.choreSubmission = choreSubmission;
    }

    public FamilyChallenge getFamilyChallenge() {
        return familyChallenge;
    }

    public void setFamilyChallenge(
            FamilyChallenge familyChallenge
    ) {
        this.familyChallenge = familyChallenge;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}