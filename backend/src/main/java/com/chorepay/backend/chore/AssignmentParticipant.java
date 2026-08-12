package com.chorepay.backend.chore;

import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "assignment_participants",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_assignment_participant",
                        columnNames = {"assignment_id", "child_user_id"}
                )
        }
)
public class AssignmentParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assignment_id", nullable = false)
    private ChoreAssignment assignment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_user_id", nullable = false)
    private User childUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "participation_status", nullable = false, length = 20)
    private ParticipationStatus participationStatus = ParticipationStatus.ASSIGNED;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public AssignmentParticipant() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
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

    public User getChildUser() {
        return childUser;
    }

    public void setChildUser(User childUser) {
        this.childUser = childUser;
    }

    public ParticipationStatus getParticipationStatus() {
        return participationStatus;
    }

    public void setParticipationStatus(ParticipationStatus participationStatus) {
        this.participationStatus = participationStatus;
    }

    public Instant getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(Instant confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}