package com.chorepay.backend.chore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChoreScheduleParticipantRepository
        extends JpaRepository<ChoreScheduleParticipant, UUID> {

    List<ChoreScheduleParticipant> findByChoreSchedule(
            ChoreSchedule choreSchedule
    );

    boolean existsByChoreScheduleAndChildUser_Id(
            ChoreSchedule choreSchedule,
            UUID childUserId
    );
}