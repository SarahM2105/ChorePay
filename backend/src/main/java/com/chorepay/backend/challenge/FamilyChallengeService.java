package com.chorepay.backend.challenge;

import com.chorepay.backend.family.FamilyMember;
import com.chorepay.backend.family.FamilyMemberRepository;
import com.chorepay.backend.family.FamilyRole;
import com.chorepay.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.chorepay.backend.family.Family;
import java.time.Instant;
import java.util.List;

@Service
public class FamilyChallengeService {

    private final FamilyChallengeRepository familyChallengeRepository;
    private final FamilyMemberRepository familyMemberRepository;

    public FamilyChallengeService(
            FamilyChallengeRepository familyChallengeRepository,
            FamilyMemberRepository familyMemberRepository
    ) {
        this.familyChallengeRepository = familyChallengeRepository;
        this.familyMemberRepository = familyMemberRepository;
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
                .findByFamilyAndActiveTrue(
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
                challenge.isActive(),
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

        // Don't continue progressing a completed challenge.
        if (challenge.getCompletedAt() != null) {
            continue;
        }

        // Challenge hasn't started yet.
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
                challenge.getCurrentProgress() + increase;

        // Don't allow progress to go above the target.
        newProgress = Math.min(
                newProgress,
                challenge.getTargetValue()
        );

        challenge.setCurrentProgress(
                newProgress
        );

        if (newProgress >= challenge.getTargetValue()) {
            challenge.setCompletedAt(now);
        }

        familyChallengeRepository.save(challenge);
    }
}
}