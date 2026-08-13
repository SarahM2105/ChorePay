package com.chorepay.backend.chore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChoreChecklistItemRepository
        extends JpaRepository<ChoreChecklistItem, UUID> {

    List<ChoreChecklistItem>
    findByChoreTemplateOrderByDisplayOrderAsc(
            ChoreTemplate choreTemplate
    );

    void deleteByChoreTemplate(
            ChoreTemplate choreTemplate
    );
}