package com.chorepay.backend.reward;

import com.chorepay.backend.family.Family;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RewardRepository
        extends JpaRepository<Reward, UUID> {

    List<Reward> findByFamilyAndActiveTrue(
            Family family
    );
}