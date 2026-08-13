package com.chorepay.backend.chore;

import com.chorepay.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignmentParticipantRepository
        extends JpaRepository<AssignmentParticipant, UUID> {

    List<AssignmentParticipant> findByAssignment(
            ChoreAssignment assignment
    );

    List<AssignmentParticipant> findByChildUser(
            User childUser
    );

    boolean existsByAssignmentAndChildUser(
            ChoreAssignment assignment,
            User childUser
    );

    void deleteByAssignment(
        ChoreAssignment assignment
);
}