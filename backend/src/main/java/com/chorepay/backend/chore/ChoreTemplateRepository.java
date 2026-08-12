package com.chorepay.backend.chore;

import com.chorepay.backend.family.Family;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChoreTemplateRepository
        extends JpaRepository<ChoreTemplate, UUID> {

    List<ChoreTemplate> findByFamilyAndActiveTrue(Family family);
}