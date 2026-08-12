package com.chorepay.backend.chore;

import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "chore_submissions")
public class ChoreSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assignment_id", nullable = false)
    private ChoreAssignment assignment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submitted_by_user_id", nullable = false)
    private User submittedByUser;

    @Column(name = "submission_number", nullable = false)
    private Integer submissionNumber;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChoreSubmissionStatus status = ChoreSubmissionStatus.PENDING;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private Instant submittedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_user_id")
    private User reviewedByUser;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "parent_feedback", columnDefinition = "TEXT")
    private String parentFeedback;

    @Column(name = "coins_awarded", nullable = false)
    private Integer coinsAwarded = 0;

    @Column(name = "xp_awarded", nullable = false)
    private Integer xpAwarded = 0;

    @Column(name = "money_awarded_pence", nullable = false)
    private Integer moneyAwardedPence = 0;

    @Column(name = "reward_issued", nullable = false)
    private boolean rewardIssued = false;

    public ChoreSubmission() {
    }

    @PrePersist
    protected void onCreate() {
        submittedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public ChoreAssignment getAssignment() {
        return assignment;
    }

    public void setAssignment(ChoreAssignment assignment) {
        this.assignment = assignment;
    }

    public User getSubmittedByUser() {
        return submittedByUser;
    }

    public void setSubmittedByUser(User submittedByUser) {
        this.submittedByUser = submittedByUser;
    }

    public Integer getSubmissionNumber() {
        return submissionNumber;
    }

    public void setSubmissionNumber(Integer submissionNumber) {
        this.submissionNumber = submissionNumber;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public ChoreSubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(ChoreSubmissionStatus status) {
        this.status = status;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public User getReviewedByUser() {
        return reviewedByUser;
    }

    public void setReviewedByUser(User reviewedByUser) {
        this.reviewedByUser = reviewedByUser;
    }

    public Instant getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(Instant reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getParentFeedback() {
        return parentFeedback;
    }

    public void setParentFeedback(String parentFeedback) {
        this.parentFeedback = parentFeedback;
    }

    public Integer getCoinsAwarded() {
        return coinsAwarded;
    }

    public void setCoinsAwarded(Integer coinsAwarded) {
        this.coinsAwarded = coinsAwarded;
    }

    public Integer getXpAwarded() {
        return xpAwarded;
    }

    public void setXpAwarded(Integer xpAwarded) {
        this.xpAwarded = xpAwarded;
    }

    public Integer getMoneyAwardedPence() {
        return moneyAwardedPence;
    }

    public void setMoneyAwardedPence(Integer moneyAwardedPence) {
        this.moneyAwardedPence = moneyAwardedPence;
    }

    public boolean isRewardIssued() {
        return rewardIssued;
    }

    public void setRewardIssued(boolean rewardIssued) {
        this.rewardIssued = rewardIssued;
    }
}