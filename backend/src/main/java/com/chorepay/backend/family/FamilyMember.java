package com.chorepay.backend.family;

import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "family_members",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_family_member_family_user",
                        columnNames = {"family_id", "user_id"}
                ),
                @UniqueConstraint(
                        name = "uk_family_member_user",
                        columnNames = {"user_id"}
                )
        }
)
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FamilyRole role;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;

    public FamilyMember() {
    }

    @PrePersist
    protected void onCreate() {
        joinedAt = Instant.now();
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public FamilyRole getRole() {
        return role;
    }

    public void setRole(FamilyRole role) {
        this.role = role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }
}