package com.chorepay.backend.chore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChoreAssignmentRepository
        extends JpaRepository<ChoreAssignment, UUID> {

    List<ChoreAssignment> findByStatus(
            ChoreAssignmentStatus status
    );
}
