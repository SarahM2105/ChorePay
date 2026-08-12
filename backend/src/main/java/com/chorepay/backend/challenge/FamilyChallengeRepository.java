package com.chorepay.backend.challenge;

import com.chorepay.backend.family.Family;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FamilyChallengeRepository
        extends JpaRepository<FamilyChallenge, UUID> {

    List<FamilyChallenge> findByFamilyAndActiveTrue(
            Family family
    );
}