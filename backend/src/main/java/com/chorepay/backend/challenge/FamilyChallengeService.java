package com.chorepay.backend.challenge;

import com.chorepay.backend.family.Family;
import com.chorepay.backend.family.FamilyMember;
import com.chorepay.backend.family.FamilyMemberRepository;
import com.chorepay.backend.family.FamilyRole;
import com.chorepay.backend.progress.UserProgress;
import com.chorepay.backend.progress.UserProgressRepository;
import com.chorepay.backend.reward.RewardTransaction;
import com.chorepay.backend.reward.RewardTransactionRepository;
import com.chorepay.backend.reward.RewardTransactionType;
import com.chorepay.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class FamilyChallengeService {

    private final FamilyChallengeRepository familyChallengeRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final UserProgressRepository userProgressRepository;
    private final RewardTransactionRepository rewardTransactionRepository;

    public FamilyChallengeService(
            FamilyChallengeRepository familyChallengeRepository,
            FamilyMemberRepository familyMemberRepository,
            UserProgressRepository userProgressRepository,
            RewardTransactionRepository rewardTransactionRepository
    ) {
        this.familyChallengeRepository = familyChallengeRepository;
        this.familyMemberRepository = familyMemberRepository;
        this.userProgressRepository = userProgressRepository;
        this.rewardTransactionRepository = rewardTransactionRepository;
    }

    @Transactional
    public FamilyChallenge createChallenge(
            User parent,
            CreateFamilyChallengeRequest request
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
                    "Children cannot create family challenges."
            );
        }

        Instant startsAt =
                request.startsAt() == null
                        ? Instant.now()
                        : request.startsAt();

        if (!request.endsAt().isAfter(startsAt)) {
            throw new IllegalArgumentException(
                    "Challenge end time must be after the start time."
            );
        }

        FamilyChallenge challenge =
                new FamilyChallenge();

        challenge.setFamily(
                membership.getFamily()
        );

        challenge.setCreatedByUser(parent);

        challenge.setTitle(
                request.title()
        );

        challenge.setDescription(
                request.description()
        );

        challenge.setChallengeType(
                request.challengeType()
        );

        challenge.setTargetValue(
                request.targetValue()
        );

        challenge.setCurrentProgress(0);

        challenge.setBonusCoins(
                request.bonusCoins() == null
                        ? 0
                        : request.bonusCoins()
        );

        challenge.setStartsAt(startsAt);
        challenge.setEndsAt(request.endsAt());
        challenge.setActive(true);

        return familyChallengeRepository.save(
                challenge
        );
    }

    public List<FamilyChallengeResponse> getFamilyChallenges(
            User user
    ) {

        FamilyMember membership =
                familyMemberRepository.findByUser(user)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User does not belong to a family."
                                )
                        );

        return familyChallengeRepository
                .findByFamilyOrderByCreatedAtDesc(
                        membership.getFamily()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public FamilyChallengeResponse toResponse(
            FamilyChallenge challenge
    ) {

        return new FamilyChallengeResponse(
                challenge.getId(),
                challenge.getTitle(),
                challenge.getDescription(),
                challenge.getChallengeType(),
                challenge.getTargetValue(),
                challenge.getCurrentProgress(),
                challenge.getBonusCoins(),
                challenge.getStartsAt(),
                challenge.getEndsAt(),
                calculateStatus(challenge),
                challenge.getCompletedAt()
        );
    }

    @Transactional
    public void recordApprovedChore(
            Family family,
            int coinsEarned
    ) {

        Instant now = Instant.now();

        List<FamilyChallenge> challenges =
                familyChallengeRepository
                        .findByFamilyAndActiveTrue(family);

        for (FamilyChallenge challenge : challenges) {

            // Already completed.
            if (challenge.getCompletedAt() != null) {
                continue;
            }

            // Challenge has not started yet.
            if (now.isBefore(challenge.getStartsAt())) {
                continue;
            }

            // Challenge has expired.
            if (now.isAfter(challenge.getEndsAt())) {
                continue;
            }

            int increase =
                    switch (challenge.getChallengeType()) {

                        case CHORES_COMPLETED -> 1;

                        case COINS_EARNED -> coinsEarned;
                    };

            int newProgress =
                    challenge.getCurrentProgress()
                            + increase;

            newProgress = Math.min(
                    newProgress,
                    challenge.getTargetValue()
            );

            challenge.setCurrentProgress(
                    newProgress
            );

            boolean justCompleted =
                    newProgress >= challenge.getTargetValue();

            if (justCompleted) {
                challenge.setCompletedAt(now);
            }

            familyChallengeRepository.save(
                    challenge
            );

            if (justCompleted) {
                awardChallengeBonus(
                        challenge
                );
            }
        }
    }

    private void awardChallengeBonus(
            FamilyChallenge challenge
    ) {

        int bonusCoins =
                challenge.getBonusCoins() == null
                        ? 0
                        : challenge.getBonusCoins();

        if (bonusCoins <= 0) {
            return;
        }

        List<FamilyMember> members =
                familyMemberRepository.findByFamily(
                        challenge.getFamily()
                );

        for (FamilyMember member : members) {

            if (member.getRole() != FamilyRole.CHILD) {
                continue;
            }

            User child =
                    member.getUser();

            // Prevent the same child receiving
            // this challenge bonus more than once.
            boolean alreadyRewarded =
                    rewardTransactionRepository
                            .existsByFamilyChallengeAndChildUser(
                                    challenge,
                                    child
                            );

            if (alreadyRewarded) {
                continue;
            }

            UserProgress progress =
                    userProgressRepository
                            .findByChildUser(child)
                            .orElseGet(() -> {

                                UserProgress newProgress =
                                        new UserProgress();

                                newProgress.setChildUser(
                                        child
                                );

                                return newProgress;
                            });

            progress.setCoinBalance(
                    progress.getCoinBalance()
                            + bonusCoins
            );

            userProgressRepository.save(
                    progress
            );

            RewardTransaction transaction =
                    new RewardTransaction();

            transaction.setChildUser(
                    child
            );

            transaction.setTransactionType(
                    RewardTransactionType
                            .FAMILY_CHALLENGE_BONUS
            );

            transaction.setAmount(
                    bonusCoins
            );

            transaction.setFamilyChallenge(
                    challenge
            );

            transaction.setDescription(
                    "Family challenge bonus: "
                            + challenge.getTitle()
            );

            rewardTransactionRepository.save(
                    transaction
            );
        }
    }

    private ChallengeStatus calculateStatus(
            FamilyChallenge challenge
    ) {

        Instant now =
                Instant.now();

        if (challenge.getCompletedAt() != null) {
            return ChallengeStatus.COMPLETED;
        }

        if (now.isBefore(
                challenge.getStartsAt()
        )) {
            return ChallengeStatus.UPCOMING;
        }

        if (now.isAfter(
                challenge.getEndsAt()
        )) {
            return ChallengeStatus.EXPIRED;
        }

        return ChallengeStatus.ACTIVE;
    }
}