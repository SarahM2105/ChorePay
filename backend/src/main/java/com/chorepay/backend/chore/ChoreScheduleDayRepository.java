package com.chorepay.backend.chore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChoreScheduleDayRepository
        extends JpaRepository<ChoreScheduleDay, UUID> {

    List<ChoreScheduleDay> findByChoreSchedule(
            ChoreSchedule choreSchedule
    );
}