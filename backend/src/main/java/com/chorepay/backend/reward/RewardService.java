package com.chorepay.backend.reward;

import com.chorepay.backend.family.FamilyMember;
import com.chorepay.backend.family.FamilyMemberRepository;
import com.chorepay.backend.family.FamilyRole;
import com.chorepay.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.chorepay.backend.progress.UserProgress;
import com.chorepay.backend.progress.UserProgressRepository;
import com.chorepay.backend.user.UserType;
import java.util.UUID;
import com.chorepay.backend.notification.NotificationService;
import com.chorepay.backend.notification.NotificationType;
import java.time.Instant;
import com.chorepay.backend.exception.ForbiddenException;
import com.chorepay.backend.exception.NotFoundException;

import java.util.List;

@Service
public class RewardService {

    private final RewardRepository rewardRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final RewardRedemptionRepository rewardRedemptionRepository;
    private final UserProgressRepository userProgressRepository;
    private final RewardTransactionRepository rewardTransactionRepository;
    private final NotificationService notificationService;

    public RewardService(
        RewardRepository rewardRepository,
        FamilyMemberRepository familyMemberRepository,
        RewardRedemptionRepository rewardRedemptionRepository,
        UserProgressRepository userProgressRepository,
        RewardTransactionRepository rewardTransactionRepository,
        NotificationService notificationService
) {
    this.rewardRepository = rewardRepository;
    this.familyMemberRepository = familyMemberRepository;
    this.rewardRedemptionRepository = rewardRedemptionRepository;
    this.userProgressRepository = userProgressRepository;
    this.rewardTransactionRepository = rewardTransactionRepository;
    this.notificationService = notificationService;
}


public List<RewardRedemptionResponse> getPendingRedemptions(
        User parent
) {

    FamilyMember membership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new IllegalArgumentException(
                "Children cannot view family reward requests."
        );
    }

    return rewardRedemptionRepository
            .findByReward_FamilyAndStatusOrderByRequestedAtAsc(
                    membership.getFamily(),
                    RewardRedemptionStatus.PENDING
            )
            .stream()
            .map(this::toRedemptionResponse)
            .toList();
}



@Transactional
public RewardRedemption approveRedemption(
        User parent,
        UUID redemptionId
) {

    FamilyMember parentMembership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User does not belong to a family."
                            )
                    );

    if (parentMembership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot approve reward requests."
        );
    }

    RewardRedemption redemption =
            rewardRedemptionRepository.findById(redemptionId)
                    .orElseThrow(() ->
                             new NotFoundException(
                                    "Reward request not found."
                            )
                    );

    if (redemption.getStatus()
            != RewardRedemptionStatus.PENDING) {

        throw new IllegalArgumentException(
                "Only pending reward requests can be approved."
        );
    }

    Reward reward = redemption.getReward();

    if (!reward.getFamily().getId()
            .equals(parentMembership.getFamily().getId())) {

        throw new ForbiddenException(
                "You cannot approve another family's reward request."
        );
    }

    User child = redemption.getChildUser();

    UserProgress progress =
            userProgressRepository.findByChildUser(child)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Child has no progress record."
                            )
                    );

    int cost = redemption.getCoinCostSnapshot();

    // Recheck their balance because it may have changed
    // while the request was pending.
    if (progress.getCoinBalance() < cost) {
        throw new IllegalArgumentException(
                "The child no longer has enough coins."
        );
    }

    // Recheck stock as it may also have changed.
    if (!reward.isUnlimitedStock()) {

        if (reward.getStockQuantity() == null
                || reward.getStockQuantity() <= 0) {

            throw new IllegalArgumentException(
                    "This reward is now out of stock."
            );
        }

        reward.setStockQuantity(
                reward.getStockQuantity() - 1
        );

        rewardRepository.save(reward);
    }

    // Deduct coins.
    progress.setCoinBalance(
            progress.getCoinBalance() - cost
    );

    userProgressRepository.save(progress);

    // Add transaction history.
    RewardTransaction transaction =
            new RewardTransaction();

    transaction.setChildUser(child);

    transaction.setTransactionType(
            RewardTransactionType.REWARD_REDEMPTION
    );

    // Negative because coins are leaving the account.
    transaction.setAmount(-cost);

    transaction.setDescription(
            "Redeemed reward: "
                    + redemption.getRewardNameSnapshot()
    );

    rewardTransactionRepository.save(transaction);

    redemption.setStatus(
        RewardRedemptionStatus.APPROVED
);

redemption.setReviewedByUser(parent);
redemption.setReviewedAt(Instant.now());

notificationService.createNotification(
        redemption.getChildUser(),
        NotificationType.REWARD_APPROVED,
        "Reward approved!",
        redemption.getRewardNameSnapshot()
                + " was approved.",
        redemption.getId()
);

return rewardRedemptionRepository.save(
        redemption
);
}

@Transactional
public RewardRedemption cancelRedemption(
        User child,
        UUID redemptionId
) {

    if (child.getUserType() != UserType.CHILD) {
        throw new IllegalArgumentException(
                "Only children can cancel their reward requests."
        );
    }

    RewardRedemption redemption =
            rewardRedemptionRepository.findById(redemptionId)
                    .orElseThrow(() ->
                             new NotFoundException(
                                    "Reward request not found."
                            )
                    );

    if (!redemption.getChildUser().getId()
            .equals(child.getId())) {

        throw new IllegalArgumentException(
                "You cannot cancel another child's reward request."
        );
    }

    if (redemption.getStatus()
            != RewardRedemptionStatus.PENDING) {

        throw new IllegalArgumentException(
                "Only pending reward requests can be cancelled."
        );
    }

    redemption.setStatus(
            RewardRedemptionStatus.CANCELLED
    );

    return rewardRedemptionRepository.save(redemption);
}

@Transactional
public RewardRedemption fulfillRedemption(
        User parent,
        UUID redemptionId
) {

    FamilyMember membership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new IllegalArgumentException(
                "Children cannot fulfil reward requests."
        );
    }

    RewardRedemption redemption =
            rewardRedemptionRepository.findById(redemptionId)
                    .orElseThrow(() ->
                             new NotFoundException(
                                    "Reward request not found."
                            )
                    );

    if (!redemption.getReward()
            .getFamily()
            .getId()
            .equals(membership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "You cannot fulfil another family's reward request."
        );
    }

    if (redemption.getStatus()
            != RewardRedemptionStatus.APPROVED) {

        throw new IllegalArgumentException(
                "Only approved reward requests can be fulfilled."
        );
    }

    redemption.setStatus(
            RewardRedemptionStatus.FULFILLED
    );

    notificationService.createNotification(
        redemption.getChildUser(),
        NotificationType.REWARD_FULFILLED,
        "Reward ready!",
        redemption.getRewardNameSnapshot()
                + " has been fulfilled.",
        redemption.getId()
);

    redemption.setFulfilledAt(
            Instant.now()
    );

    return rewardRedemptionRepository.save(redemption);
}

@Transactional
public Reward updateReward(
        User parent,
        UUID rewardId,
        UpdateRewardRequest request
) {

    FamilyMember membership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new IllegalArgumentException(
                "Children cannot edit rewards."
        );
    }

    Reward reward =
            rewardRepository.findById(rewardId)
                    .orElseThrow(() ->
                             new NotFoundException(
                                    "Reward not found."
                            )
                    );

    if (!reward.getFamily().getId()
            .equals(membership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "You cannot edit another family's reward."
        );
    }

    if (!request.unlimitedStock()
            && request.stockQuantity() == null) {

        throw new IllegalArgumentException(
                "Stock quantity is required for limited rewards."
        );
    }

    if (request.availableFrom() != null
            && request.availableUntil() != null
            && request.availableUntil()
            .isBefore(request.availableFrom())) {

        throw new IllegalArgumentException(
                "Available until must be after available from."
        );
    }

    reward.setName(request.name());
    reward.setDescription(request.description());
    reward.setCategory(request.category());
    reward.setCoinCost(request.coinCost());

    reward.setUnlimitedStock(
            request.unlimitedStock()
    );

    reward.setStockQuantity(
            request.unlimitedStock()
                    ? null
                    : request.stockQuantity()
    );

    reward.setMinimumLevel(
            request.minimumLevel() == null
                    ? 1
                    : request.minimumLevel()
    );

    reward.setAvailableFrom(
            request.availableFrom()
    );

    reward.setAvailableUntil(
            request.availableUntil()
    );

    reward.setFulfillmentType(
            request.fulfillmentType()
    );

    return rewardRepository.save(reward);
}

@Transactional
public void deactivateReward(
        User parent,
        UUID rewardId
) {

    FamilyMember membership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new IllegalArgumentException(
                "Children cannot deactivate rewards."
        );
    }

    Reward reward =
            rewardRepository.findById(rewardId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Reward not found."
                            )
                    );

    if (!reward.getFamily().getId()
            .equals(membership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "You cannot deactivate another family's reward."
        );
    }

    reward.setActive(false);

    rewardRepository.save(reward);
}

public List<RewardTransactionResponse> getMyTransactions(
        User child
) {

    if (child.getUserType() != UserType.CHILD) {
        throw new IllegalArgumentException(
                "Only children can view child transaction history."
        );
    }

    return rewardTransactionRepository
            .findByChildUserOrderByCreatedAtDesc(child)
            .stream()
            .map(transaction ->
                    new RewardTransactionResponse(
                            transaction.getId(),
                            transaction.getTransactionType(),
                            transaction.getAmount(),
                            transaction.getDescription(),
                            transaction.getCreatedAt()
                    )
            )
            .toList();
} 

@Transactional
public RewardRedemption rejectRedemption(
        User parent,
        UUID redemptionId,
        RejectRewardRedemptionRequest request
) {

    FamilyMember parentMembership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User does not belong to a family."
                            )
                    );

    if (parentMembership.getRole() == FamilyRole.CHILD) {
        throw new IllegalArgumentException(
                "Children cannot reject reward requests."
        );
    }

    RewardRedemption redemption =
            rewardRedemptionRepository.findById(redemptionId)
                    .orElseThrow(() ->
                             new NotFoundException(
                                    "Reward request not found."
                            )
                    );

    if (redemption.getStatus()
            != RewardRedemptionStatus.PENDING) {

        throw new IllegalArgumentException(
                "Only pending reward requests can be rejected."
        );
    }

    if (!redemption.getReward()
            .getFamily()
            .getId()
            .equals(parentMembership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "You cannot reject another family's reward request."
        );
    }

    redemption.setStatus(
            RewardRedemptionStatus.REJECTED
    );
        notificationService.createNotification(
        redemption.getChildUser(),
        NotificationType.REWARD_REJECTED,
        "Reward request declined",
        redemption.getRewardNameSnapshot()
                + " was not approved.",
        redemption.getId()
);

    redemption.setReviewedByUser(parent);
    redemption.setReviewedAt(Instant.now());
    redemption.setParentNote(
            request.parentNote()
    );

    return rewardRedemptionRepository.save(redemption);

}

@Transactional
public RewardRedemption redeemReward(
        User child,
        RedeemRewardRequest request
) {

    if (child.getUserType() != UserType.CHILD) {
        throw new IllegalArgumentException(
                "Only children can redeem rewards."
        );
    }

    FamilyMember membership =
            familyMemberRepository.findByUser(child)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User does not belong to a family."
                            )
                    );

    Reward reward =
            rewardRepository.findById(request.rewardId())
                    .orElseThrow(() ->
                             new NotFoundException(
                                    "Reward not found."
                            )
                    );

    // Make sure the reward belongs to the child's family.
    if (!reward.getFamily().getId()
            .equals(membership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "This reward does not belong to your family."
        );
    }

    if (!reward.isActive()) {
        throw new IllegalArgumentException(
                "This reward is no longer available."
        );
    }

    Instant now = Instant.now();

    if (reward.getAvailableFrom() != null
            && now.isBefore(reward.getAvailableFrom())) {

        throw new IllegalArgumentException(
                "This reward is not available yet."
        );
    }

    if (reward.getAvailableUntil() != null
            && now.isAfter(reward.getAvailableUntil())) {

        throw new IllegalArgumentException(
                "This reward has expired."
        );
    }

    // Check stock.
    if (!reward.isUnlimitedStock()) {

        if (reward.getStockQuantity() == null
                || reward.getStockQuantity() <= 0) {

            throw new IllegalArgumentException(
                    "This reward is out of stock."
            );
        }
    }

    // Stop the same child creating multiple pending
    // requests for the same reward.
    boolean alreadyPending =
            rewardRedemptionRepository
                    .findByChildUserAndRewardAndStatus(
                            child,
                            reward,
                            RewardRedemptionStatus.PENDING
                    )
                    .isPresent();

    if (alreadyPending) {
        throw new IllegalArgumentException(
                "You already have a pending request for this reward."
        );
    }

    // A child may not have a UserProgress row yet.
    UserProgress progress =
            userProgressRepository
                    .findByChildUser(child)
                    .orElse(null);

    int coinBalance =
            progress == null
                    ? 0
                    : progress.getCoinBalance();

    int currentLevel =
            progress == null
                    ? 1
                    : progress.getCurrentLevel();

    if (currentLevel < reward.getMinimumLevel()) {
        throw new IllegalArgumentException(
                "Your level is too low for this reward."
        );
    }

    if (coinBalance < reward.getCoinCost()) {
        throw new IllegalArgumentException(
                "You do not have enough coins for this reward."
        );
    }

    RewardRedemption redemption =
            new RewardRedemption();

    redemption.setReward(reward);
    redemption.setChildUser(child);

    redemption.setRewardNameSnapshot(
            reward.getName()
    );

    redemption.setCoinCostSnapshot(
            reward.getCoinCost()
    );

    redemption.setStatus(
            RewardRedemptionStatus.PENDING
    );

    RewardRedemption savedRedemption =
            rewardRedemptionRepository.save(
                    redemption
            );

    /*
     * Notify all parents/owner in the family
     * that a reward request is waiting.
     */
    List<FamilyMember> familyMembers =
            familyMemberRepository.findByFamily(
                    membership.getFamily()
            );

    for (FamilyMember familyMember : familyMembers) {

        if (familyMember.getRole() == FamilyRole.PARENT
                || familyMember.getRole() == FamilyRole.OWNER) {

            notificationService.createNotification(
                    familyMember.getUser(),
                    NotificationType.REWARD_REQUESTED,
                    "Reward request",
                    child.getName()
                            + " requested "
                            + reward.getName()
                            + ".",
                    savedRedemption.getId()
            );
        }
    }

    return savedRedemption;
}

public RewardRedemptionResponse toRedemptionResponse(
        RewardRedemption redemption
) {
    return new RewardRedemptionResponse(
            redemption.getId(),
            redemption.getReward().getId(),
            redemption.getRewardNameSnapshot(),
            redemption.getCoinCostSnapshot(),
            redemption.getStatus(),
            redemption.getRequestedAt(),
            redemption.getParentNote(),
            redemption.getReviewedAt(),
            redemption.getFulfilledAt()
    );
}


public List<RewardRedemptionResponse> getMyRedemptions(
        User child
) {

    if (child.getUserType() != UserType.CHILD) {
        throw new IllegalArgumentException(
                "Only children can view child redemptions."
        );
    }

    return rewardRedemptionRepository
            .findByChildUserOrderByRequestedAtDesc(child)
            .stream()
            .map(this::toRedemptionResponse)
            .toList();
}

    @Transactional
    public Reward createReward(
            User user,
            CreateRewardRequest request
    ) {

        FamilyMember membership =
                familyMemberRepository.findByUser(user)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User does not belong to a family."
                                )
                        );

        if (membership.getRole() == FamilyRole.CHILD) {
            throw new IllegalArgumentException(
                    "Children cannot create rewards."
            );
        }

        if (!request.unlimitedStock()
                && request.stockQuantity() == null) {

            throw new IllegalArgumentException(
                    "Stock quantity is required for limited rewards."
            );
        }

        if (request.availableFrom() != null
                && request.availableUntil() != null
                && request.availableUntil()
                .isBefore(request.availableFrom())) {

            throw new IllegalArgumentException(
                    "Available until must be after available from."
            );
        }

        Reward reward = new Reward();

        reward.setFamily(membership.getFamily());
        reward.setCreatedByUser(user);

        reward.setName(request.name());
        reward.setDescription(request.description());
        reward.setCategory(request.category());
        reward.setCoinCost(request.coinCost());

        reward.setUnlimitedStock(
                request.unlimitedStock()
        );

        if (request.unlimitedStock()) {
            reward.setStockQuantity(null);
        } else {
            reward.setStockQuantity(
                    request.stockQuantity()
            );
        }

        reward.setMinimumLevel(
                request.minimumLevel() == null
                        ? 1
                        : request.minimumLevel()
        );

        reward.setAvailableFrom(
                request.availableFrom()
        );

        reward.setAvailableUntil(
                request.availableUntil()
        );

        reward.setFulfillmentType(
                request.fulfillmentType()
        );

        return rewardRepository.save(reward);
    }

    public List<RewardResponse> getRewards(User user) {

        FamilyMember membership =
                familyMemberRepository.findByUser(user)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User does not belong to a family."
                                )
                        );

        return rewardRepository
                .findByFamilyAndActiveTrue(
                        membership.getFamily()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RewardResponse toResponse(
            Reward reward
    ) {
        return new RewardResponse(
                reward.getId(),
                reward.getName(),
                reward.getDescription(),
                reward.getCategory(),
                reward.getCoinCost(),
                reward.isUnlimitedStock(),
                reward.getStockQuantity(),
                reward.getMinimumLevel(),
                reward.getAvailableFrom(),
                reward.getAvailableUntil(),
                reward.getFulfillmentType(),
                reward.isActive()
        );
    }
}