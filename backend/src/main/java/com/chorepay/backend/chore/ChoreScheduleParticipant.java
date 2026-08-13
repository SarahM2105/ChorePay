package com.chorepay.backend.chore;

import com.chorepay.backend.user.User;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(
        name = "chore_schedule_participants",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_schedule_child",
                        columnNames = {
                                "chore_schedule_id",
                                "child_user_id"
                        }
                )
        }
)
public class ChoreScheduleParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chore_schedule_id", nullable = false)
    private ChoreSchedule choreSchedule;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_user_id", nullable = false)
    private User childUser;

    public ChoreScheduleParticipant() {
    }

    public UUID getId() {
        return id;
    }

    public ChoreSchedule getChoreSchedule() {
        return choreSchedule;
    }

    public void setChoreSchedule(
            ChoreSchedule choreSchedule
    ) {
        this.choreSchedule = choreSchedule;
    }

    public User getChildUser() {
        return childUser;
    }

    public void setChildUser(User childUser) {
        this.childUser = childUser;
    }
}