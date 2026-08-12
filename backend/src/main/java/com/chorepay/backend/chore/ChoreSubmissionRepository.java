package com.chorepay.backend.chore;

import org.springframework.data.jpa.repository.JpaRepository;
import com.chorepay.backend.user.User;
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

    Optional<ChoreSubmission>
findTopByAssignmentAndSubmittedByUserOrderBySubmissionNumberDesc(
        ChoreAssignment assignment,
        User submittedByUser
);

    long countByAssignment(
            ChoreAssignment assignment
    );
}