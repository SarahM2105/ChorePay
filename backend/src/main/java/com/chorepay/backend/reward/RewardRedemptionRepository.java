package com.chorepay.backend.reward;

import com.chorepay.backend.family.Family;
import com.chorepay.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RewardRedemptionRepository
        extends JpaRepository<RewardRedemption, UUID> {

    Optional<RewardRedemption>
    findByChildUserAndRewardAndStatus(
            User childUser,
            Reward reward,
            RewardRedemptionStatus status
    );

    List<RewardRedemption>
    findByChildUserOrderByRequestedAtDesc(
            User childUser
    );

    List<RewardRedemption>
    findByRewardAndStatus(
            Reward reward,
            RewardRedemptionStatus status
    );

    List<RewardRedemption>
    findByReward_FamilyAndStatusOrderByRequestedAtAsc(
            Family family,
            RewardRedemptionStatus status
    );
}