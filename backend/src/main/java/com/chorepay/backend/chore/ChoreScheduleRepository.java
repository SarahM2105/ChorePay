package com.chorepay.backend.chore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChoreScheduleRepository
        extends JpaRepository<ChoreSchedule, UUID> {

    List<ChoreSchedule> findByActiveTrue();
}