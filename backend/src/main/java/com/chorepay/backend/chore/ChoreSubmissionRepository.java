package com.chorepay.backend.chore;

import org.springframework.data.jpa.repository.JpaRepository;
import com.chorepay.backend.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.chorepay.backend.family.Family;

public interface ChoreSubmissionRepository
        extends JpaRepository<ChoreSubmission, UUID> {

    List<ChoreSubmission> findByAssignmentOrderBySubmissionNumberAsc(
            ChoreAssignment assignment
    );

    Optional<ChoreSubmission> findByAssignmentAndStatus(
            ChoreAssignment assignment,
            ChoreSubmissionStatus status
    );

    List<ChoreSubmission>
findByAssignment_ChoreTemplate_FamilyAndStatusOrderBySubmittedAtAsc(
        Family family,
        ChoreSubmissionStatus status
);

List<ChoreSubmission>
findByAssignment_ChoreTemplate_FamilyOrderBySubmittedAtDesc(
        Family family
);

List<ChoreSubmission>
findByAssignment_ChoreTemplate_FamilyAndStatusOrderBySubmittedAtDesc(
        Family family,
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