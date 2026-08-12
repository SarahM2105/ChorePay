package com.chorepay.backend.chore;

import com.chorepay.backend.family.FamilyMember;
import com.chorepay.backend.family.FamilyMemberRepository;
import com.chorepay.backend.family.FamilyRole;
import com.chorepay.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChoreService {

    private final ChoreTemplateRepository choreTemplateRepository;
    private final FamilyMemberRepository familyMemberRepository;

    public ChoreService(
            ChoreTemplateRepository choreTemplateRepository,
            FamilyMemberRepository familyMemberRepository
    ) {
        this.choreTemplateRepository = choreTemplateRepository;
        this.familyMemberRepository = familyMemberRepository;
    }

    @Transactional
    public ChoreTemplate createTemplate(
            User user,
            CreateChoreTemplateRequest request
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
                    "Children cannot create chore templates."
            );
        }

        ChoreTemplate template = new ChoreTemplate();

        template.setFamily(membership.getFamily());
        template.setCreatedByUser(user);
        template.setTitle(request.title());
        template.setDescription(request.description());
        template.setCategory(request.category());
        template.setDifficulty(request.difficulty());
        template.setEstimatedMinutes(request.estimatedMinutes());
        template.setCoinReward(request.coinReward());

        template.setXpReward(
                calculateXp(request.coinReward(), request.difficulty())
        );

        template.setMoneyRewardPence(
                request.moneyRewardPence() == null
                        ? 0
                        : request.moneyRewardPence()
        );

        template.setLatePenaltyPercent(
                request.latePenaltyPercent() == null
                        ? 0
                        : request.latePenaltyPercent()
        );

        template.setResubmissionPenaltyPercent(
                request.resubmissionPenaltyPercent() == null
                        ? 0
                        : request.resubmissionPenaltyPercent()
        );

        template.setPhotoRequired(request.photoRequired());
        template.setCommentRequired(request.commentRequired());

        return choreTemplateRepository.save(template);
    }

    public java.util.List<ChoreTemplateResponse> getTemplates(User user) {

    FamilyMember membership =
            familyMemberRepository.findByUser(user)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User does not belong to a family."
                            )
                    );

    return choreTemplateRepository
            .findByFamilyAndActiveTrue(
                    membership.getFamily()
            )
            .stream()
            .map(template ->
                    new ChoreTemplateResponse(
                            template.getId(),
                            template.getTitle(),
                            template.getDescription(),
                            template.getCategory(),
                            template.getDifficulty(),
                            template.getEstimatedMinutes(),
                            template.getCoinReward(),
                            template.getXpReward(),
                            template.getMoneyRewardPence(),
                            template.getLatePenaltyPercent(),
                            template.getResubmissionPenaltyPercent(),
                            template.isPhotoRequired(),
                            template.isCommentRequired(),
                            template.isActive()
                    )
            )
            .toList();
}


@Transactional
public ChoreTemplate updateTemplate(
        User user,
        java.util.UUID templateId,
        UpdateChoreTemplateRequest request
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
                "Children cannot edit chore templates."
        );
    }

    ChoreTemplate template =
            choreTemplateRepository.findById(templateId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Chore template not found."
                            )
                    );

    if (!template.getFamily().getId()
            .equals(membership.getFamily().getId())) {
        throw new IllegalArgumentException(
                "You cannot edit another family's chore template."
        );
    }

    template.setTitle(request.title());
    template.setDescription(request.description());
    template.setCategory(request.category());
    template.setDifficulty(request.difficulty());
    template.setEstimatedMinutes(request.estimatedMinutes());
    template.setCoinReward(request.coinReward());

    template.setXpReward(
            calculateXp(request.coinReward(), request.difficulty())
    );

    template.setMoneyRewardPence(
            request.moneyRewardPence() == null
                    ? 0
                    : request.moneyRewardPence()
    );

    template.setLatePenaltyPercent(
            request.latePenaltyPercent() == null
                    ? 0
                    : request.latePenaltyPercent()
    );

    template.setResubmissionPenaltyPercent(
            request.resubmissionPenaltyPercent() == null
                    ? 0
                    : request.resubmissionPenaltyPercent()
    );

    template.setPhotoRequired(request.photoRequired());
    template.setCommentRequired(request.commentRequired());

    return choreTemplateRepository.save(template);
}

@Transactional
public void deactivateTemplate(
        User user,
        java.util.UUID templateId
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
                "Children cannot deactivate chore templates."
        );
    }

    ChoreTemplate template =
            choreTemplateRepository.findById(templateId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Chore template not found."
                            )
                    );

    if (!template.getFamily().getId()
            .equals(membership.getFamily().getId())) {
        throw new IllegalArgumentException(
                "You cannot modify another family's chore template."
        );
    }

    template.setActive(false);

    choreTemplateRepository.save(template);
}


    private int calculateXp(
            int coins,
            ChoreDifficulty difficulty
    ) {
        return switch (difficulty) {
            case EASY -> coins;
            case MEDIUM -> (int) Math.round(coins * 1.2);
            case HARD -> (int) Math.round(coins * 1.5);
        };
    }
}