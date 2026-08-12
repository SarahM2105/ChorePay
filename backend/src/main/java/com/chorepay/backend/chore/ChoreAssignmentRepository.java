package com.chorepay.backend.chore;

import com.chorepay.backend.family.Family;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ChoreAssignmentRepository
        extends JpaRepository<ChoreAssignment, UUID> {

    List<ChoreAssignment> findByStatus(
            ChoreAssignmentStatus status
    );

    List<ChoreAssignment>
    findByChoreTemplate_FamilyOrderByCreatedAtDesc(
            Family family
    );

    List<ChoreAssignment> findByStatusAndDueAtBefore(
            ChoreAssignmentStatus status,
            Instant dueAt
    );
}