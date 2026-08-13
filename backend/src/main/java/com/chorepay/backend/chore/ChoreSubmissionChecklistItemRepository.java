package com.chorepay.backend.chore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChoreSubmissionChecklistItemRepository
        extends JpaRepository<ChoreSubmissionChecklistItem, UUID> {

    List<ChoreSubmissionChecklistItem>
    findBySubmission(
            ChoreSubmission submission
    );
}