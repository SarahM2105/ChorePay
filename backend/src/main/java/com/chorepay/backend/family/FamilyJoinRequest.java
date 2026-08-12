package com.chorepay.backend.family;

import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "family_join_requests",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_family_join_request_family_user_status",
                        columnNames = {
                                "family_id",
                                "requested_by_user_id",
                                "status"
                        }
                )
        }
)
public class FamilyJoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requested_by_user_id", nullable = false)
    private User requestedByUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "requested_role", nullable = false, length = 20)
    private FamilyRole requestedRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FamilyJoinRequestStatus status;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private Instant requestedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_user_id")
    private User reviewedByUser;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    public FamilyJoinRequest() {
    }

    @PrePersist
    protected void onCreate() {
        requestedAt = Instant.now();

        if (status == null) {
            status = FamilyJoinRequestStatus.PENDING;
        }
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

    public User getRequestedByUser() {
        return requestedByUser;
    }

    public void setRequestedByUser(User requestedByUser) {
        this.requestedByUser = requestedByUser;
    }

    public FamilyRole getRequestedRole() {
        return requestedRole;
    }

    public void setRequestedRole(FamilyRole requestedRole) {
        this.requestedRole = requestedRole;
    }

    public FamilyJoinRequestStatus getStatus() {
        return status;
    }

    public void setStatus(FamilyJoinRequestStatus status) {
        this.status = status;
    }

    public Instant getRequestedAt() {
        return requestedAt;
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
}