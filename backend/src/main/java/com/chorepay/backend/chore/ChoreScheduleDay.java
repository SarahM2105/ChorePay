package com.chorepay.backend.chore;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(
        name = "chore_schedule_days",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_schedule_day",
                        columnNames = {"chore_schedule_id", "day_of_week"}
                )
        }
)
public class ChoreScheduleDay {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chore_schedule_id", nullable = false)
    private ChoreSchedule choreSchedule;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 15)
    private DayOfWeekValue dayOfWeek;

    public ChoreScheduleDay() {
    }

    public UUID getId() {
        return id;
    }

    public ChoreSchedule getChoreSchedule() {
        return choreSchedule;
    }

    public void setChoreSchedule(ChoreSchedule choreSchedule) {
        this.choreSchedule = choreSchedule;
    }

    public DayOfWeekValue getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeekValue dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
}