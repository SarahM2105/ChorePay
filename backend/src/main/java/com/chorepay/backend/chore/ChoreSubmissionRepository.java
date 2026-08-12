package com.chorepay.backend.chore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChoreSubmissionRepository
        extends JpaRepository<ChoreSubmission, UUID> {

    List<ChoreSubmission> findByAssignmentOrderBySubmissionNumberAsc(
            ChoreAssignment assignment
    );

    Optional<ChoreSubmission> findByAssignmentAndStatus(
            ChoreAssignment assignment,
            ChoreSubmissionStatus status
    );

    long countByAssignment(
            ChoreAssignment assignment
    );
}