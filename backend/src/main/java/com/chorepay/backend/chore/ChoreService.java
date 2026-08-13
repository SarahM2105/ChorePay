package com.chorepay.backend.chore;

import com.chorepay.backend.family.FamilyMember;
import com.chorepay.backend.family.FamilyMemberRepository;
import com.chorepay.backend.family.FamilyRole;
import com.chorepay.backend.progress.UserProgress;
import com.chorepay.backend.progress.UserProgressRepository;
import com.chorepay.backend.reward.RewardTransaction;
import com.chorepay.backend.reward.RewardTransactionRepository;
import com.chorepay.backend.reward.RewardTransactionType;
import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserRepository;
import com.chorepay.backend.user.UserType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.chorepay.backend.achievement.AchievementService;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import com.chorepay.backend.challenge.FamilyChallengeService;

@Service
public class ChoreService {

    private final ChoreTemplateRepository choreTemplateRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final ChoreAssignmentRepository choreAssignmentRepository;
    private final AssignmentParticipantRepository assignmentParticipantRepository;
    private final UserRepository userRepository;
    private final ChoreSubmissionRepository choreSubmissionRepository;
    private final UserProgressRepository userProgressRepository;
    private final RewardTransactionRepository rewardTransactionRepository;
    private final AchievementService achievementService;
    private final FamilyChallengeService familyChallengeService;
    private final ChoreChecklistItemRepository
        choreChecklistItemRepository;

public ChoreService(
        ChoreTemplateRepository choreTemplateRepository,
        FamilyMemberRepository familyMemberRepository,
        ChoreAssignmentRepository choreAssignmentRepository,
        AssignmentParticipantRepository assignmentParticipantRepository,
        ChoreSubmissionRepository choreSubmissionRepository,
        UserRepository userRepository,
        UserProgressRepository userProgressRepository,
        RewardTransactionRepository rewardTransactionRepository,
        AchievementService achievementService,
        FamilyChallengeService familyChallengeService,
        ChoreChecklistItemRepository choreChecklistItemRepository
) {
    this.choreTemplateRepository = choreTemplateRepository;
    this.familyMemberRepository = familyMemberRepository;
    this.choreAssignmentRepository = choreAssignmentRepository;
    this.assignmentParticipantRepository = assignmentParticipantRepository;
    this.choreSubmissionRepository = choreSubmissionRepository;
    this.userRepository = userRepository;
    this.userProgressRepository = userProgressRepository;
    this.rewardTransactionRepository = rewardTransactionRepository;
    this.achievementService = achievementService;
    this.familyChallengeService = familyChallengeService;
    this.choreChecklistItemRepository = choreChecklistItemRepository;
}

@Transactional
public List<ChoreChecklistItemResponse> updateChecklist(
        User parent,
        UUID templateId,
        UpdateChoreChecklistRequest request
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
                "Children cannot edit chore checklists."
        );
    }

    ChoreTemplate template =
            choreTemplateRepository.findById(templateId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Chore template not found."
                            )
                    );

    if (!template.getFamily()
            .getId()
            .equals(membership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "You cannot edit another family's chore checklist."
        );
    }

    choreChecklistItemRepository
            .deleteByChoreTemplate(template);

    int displayOrder = 1;

    for (ChecklistItemRequest itemRequest
            : request.items()) {

        ChoreChecklistItem item =
                new ChoreChecklistItem();

        item.setChoreTemplate(template);
        item.setText(itemRequest.text());
        item.setRequired(itemRequest.required());
        item.setDisplayOrder(displayOrder);

        choreChecklistItemRepository.save(item);

        displayOrder++;
    }

    return getChecklistResponse(template);
}

public List<ChoreChecklistItemResponse> getChecklist(
        User user,
        UUID templateId
) {

    FamilyMember membership =
            familyMemberRepository.findByUser(user)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "User does not belong to a family."
                            )
                    );

    ChoreTemplate template =
            choreTemplateRepository.findById(templateId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Chore template not found."
                            )
                    );

    if (!template.getFamily()
            .getId()
            .equals(membership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "You cannot view another family's chore checklist."
        );
    }

    return getChecklistResponse(template);
}

private List<ChoreChecklistItemResponse> getChecklistResponse(
        ChoreTemplate template
) {

    return choreChecklistItemRepository
            .findByChoreTemplateOrderByDisplayOrderAsc(
                    template
            )
            .stream()
            .map(item ->
                    new ChoreChecklistItemResponse(
                            item.getId(),
                            item.getText(),
                            item.getDisplayOrder(),
                            item.isRequired()
                    )
            )
            .toList();
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



@Transactional
public ChoreAssignment assignChore(
        User parent,
        AssignChoreRequest request
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
                "Children cannot assign chores."
        );
    }

    ChoreTemplate template =
            choreTemplateRepository.findById(request.templateId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Chore template not found."
                            )
                    );

    if (!template.isActive()) {
        throw new IllegalArgumentException(
                "This chore template is inactive."
        );
    }

    if (!template.getFamily().getId()
            .equals(parentMembership.getFamily().getId())) {
        throw new IllegalArgumentException(
                "You cannot assign another family's chore."
        );
    }

    ChoreAssignment assignment = new ChoreAssignment();

    assignment.setChoreTemplate(template);
    assignment.setAssignedByUser(parent);
    assignment.setDueAt(request.dueAt());
    assignment.setStatus(ChoreAssignmentStatus.ASSIGNED);

    // Snapshot the reward values.
    assignment.setCoinRewardSnapshot(
            template.getCoinReward()
    );

    assignment.setXpRewardSnapshot(
            template.getXpReward()
    );

    assignment.setMoneyRewardPenceSnapshot(
            template.getMoneyRewardPence()
    );

    assignment.setLatePenaltyPercentSnapshot(
            template.getLatePenaltyPercent()
    );

    assignment.setResubmissionPenaltyPercentSnapshot(
            template.getResubmissionPenaltyPercent()
    );

    ChoreAssignment savedAssignment =
            choreAssignmentRepository.save(assignment);

    for (UUID childUserId : request.childUserIds()) {

        User child = userRepository.findById(childUserId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Child user not found."
                        )
                );

        if (child.getUserType() != UserType.CHILD) {
            throw new IllegalArgumentException(
                    "Chores can only be assigned to child accounts."
            );
        }

        FamilyMember childMembership =
                familyMemberRepository.findByUser(child)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Child does not belong to a family."
                                )
                        );

        if (!childMembership.getFamily().getId()
                .equals(parentMembership.getFamily().getId())) {
            throw new IllegalArgumentException(
                    "You cannot assign chores to children in another family."
            );
        }

        AssignmentParticipant participant =
                new AssignmentParticipant();

        participant.setAssignment(savedAssignment);
        participant.setChildUser(child);
        participant.setParticipationStatus(
                ParticipationStatus.ASSIGNED
        );

        assignmentParticipantRepository.save(participant);
    }

    return savedAssignment;
}

public ChoreAssignmentResponse toAssignmentResponse(
        ChoreAssignment assignment
) {
    List<UUID> childIds =
            assignmentParticipantRepository
                    .findByAssignment(assignment)
                    .stream()
                    .map(participant ->
                            participant.getChildUser().getId()
                    )
                    .toList();

    return new ChoreAssignmentResponse(
            assignment.getId(),
            assignment.getChoreTemplate().getId(),
            assignment.getChoreTemplate().getTitle(),
            assignment.getDueAt(),
            assignment.getStatus(),
            assignment.getCoinRewardSnapshot(),
            assignment.getXpRewardSnapshot(),
            assignment.getMoneyRewardPenceSnapshot(),
            childIds
    );
}

@Transactional
public ChoreSubmission submitChore(
        User child,
        UUID assignmentId,
        SubmitChoreRequest request
) {
    if (child.getUserType() != UserType.CHILD) {
        throw new IllegalArgumentException(
                "Only children can submit chores."
        );
    }

    ChoreAssignment assignment =
            choreAssignmentRepository.findById(assignmentId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Chore assignment not found."
                            )
                    );

    boolean isParticipant =
            assignmentParticipantRepository
                    .existsByAssignmentAndChildUser(
                            assignment,
                            child
                    );

    if (!isParticipant) {
        throw new IllegalArgumentException(
                "This chore is not assigned to you."
        );
    }

    if (assignment.getStatus() == ChoreAssignmentStatus.APPROVED
            || assignment.getStatus() == ChoreAssignmentStatus.CANCELLED) {

        throw new IllegalArgumentException(
                "This chore can no longer be submitted."
        );
    }

    boolean alreadyPending =
            choreSubmissionRepository
                    .findByAssignmentAndStatus(
                            assignment,
                            ChoreSubmissionStatus.PENDING
                    )
                    .isPresent();

    if (alreadyPending) {
        throw new IllegalArgumentException(
                "This chore already has a pending submission."
        );
    }

    ChoreTemplate template = assignment.getChoreTemplate();

    if (template.isPhotoRequired()
            && (request.photoUrl() == null
            || request.photoUrl().isBlank())) {

        throw new IllegalArgumentException(
                "A photo is required for this chore."
        );
    }

    if (template.isCommentRequired()
            && (request.comment() == null
            || request.comment().isBlank())) {

        throw new IllegalArgumentException(
                "A comment is required for this chore."
        );
    }

    long previousSubmissions =
            choreSubmissionRepository.countByAssignment(
                    assignment
            );

    ChoreSubmission submission = new ChoreSubmission();

    submission.setAssignment(assignment);
    submission.setSubmittedByUser(child);
    submission.setSubmissionNumber(
            (int) previousSubmissions + 1
    );

    submission.setComment(request.comment());
    submission.setPhotoUrl(request.photoUrl());
    submission.setStatus(
            ChoreSubmissionStatus.PENDING
    );

    assignment.setStatus(
            ChoreAssignmentStatus.SUBMITTED
    );

    choreAssignmentRepository.save(assignment);

    return choreSubmissionRepository.save(submission);
}

public List<ChildChoreAssignmentResponse> getMyAssignments(
        User child,
        ChoreAssignmentStatus status
) {

    if (child.getUserType() != UserType.CHILD) {
        throw new IllegalArgumentException(
                "Only children can view child assignments."
        );
    }

    return assignmentParticipantRepository
            .findByChildUser(child)
            .stream()
            .filter(participant -> {

                ChoreAssignmentStatus assignmentStatus =
                        participant
                                .getAssignment()
                                .getStatus();

                if (status == null) {
                    return assignmentStatus
                            != ChoreAssignmentStatus.CANCELLED;
                }

                return assignmentStatus == status;
            })
            .sorted((first, second) ->
                    second.getAssignment()
                            .getCreatedAt()
                            .compareTo(
                                    first.getAssignment()
                                            .getCreatedAt()
                            )
            )
            .map(participant ->
                    toChildAssignmentResponse(
                            participant,
                            child
                    )
            )
            .toList();
}

private ChildChoreAssignmentResponse toChildAssignmentResponse(
        AssignmentParticipant participant,
        User child
) {

    ChoreAssignment assignment =
            participant.getAssignment();

    ChoreSubmission latestSubmission =
            choreSubmissionRepository
                    .findTopByAssignmentAndSubmittedByUserOrderBySubmissionNumberDesc(
                            assignment,
                            child
                    )
                    .orElse(null);

    return new ChildChoreAssignmentResponse(
            assignment.getId(),
            assignment.getChoreTemplate().getId(),
            assignment.getChoreTemplate().getTitle(),
            assignment.getChoreTemplate().getDescription(),
            assignment.getDueAt(),
            assignment.getStatus(),
            participant.getParticipationStatus(),
            assignment.getCoinRewardSnapshot(),
            assignment.getXpRewardSnapshot(),
            assignment.getMoneyRewardPenceSnapshot(),

            latestSubmission == null
                    ? null
                    : latestSubmission.getStatus(),

            latestSubmission == null
                    ? null
                    : latestSubmission.getParentFeedback(),

            assignment.getCompletedAt()
    );
}

public ChoreSubmissionResponse toSubmissionResponse(
        ChoreSubmission submission
) {
    return new ChoreSubmissionResponse(
            submission.getId(),
            submission.getAssignment().getId(),
            submission.getSubmissionNumber(),
            submission.getComment(),
            submission.getPhotoUrl(),
            submission.getStatus(),
            submission.getSubmittedAt(),
            submission.getParentFeedback()
    );
}

@Transactional
public ChoreSubmission approveSubmission(
        User parent,
        UUID submissionId
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
                "Children cannot approve chore submissions."
        );
    }

    ChoreSubmission submission =
            choreSubmissionRepository.findById(submissionId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Submission not found."
                            )
                    );

    if (submission.getStatus() != ChoreSubmissionStatus.PENDING) {
        throw new IllegalArgumentException(
                "Only pending submissions can be approved."
        );
    }

    ChoreAssignment assignment = submission.getAssignment();

    if (!assignment.getChoreTemplate()
            .getFamily()
            .getId()
            .equals(parentMembership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "You cannot approve another family's submission."
        );
    }

    int coins = assignment.getCoinRewardSnapshot();
    int xp = assignment.getXpRewardSnapshot();
    int money = assignment.getMoneyRewardPenceSnapshot() == null
            ? 0
            : assignment.getMoneyRewardPenceSnapshot();

    if (assignment.getDueAt() != null
            && submission.getSubmittedAt().isAfter(assignment.getDueAt())) {

        int penalty = assignment.getLatePenaltyPercentSnapshot();

        coins = applyPenalty(coins, penalty);
        xp = applyPenalty(xp, penalty);
        money = applyPenalty(money, penalty);
    }

    if (submission.getSubmissionNumber() > 1) {

        int penalty =
                assignment.getResubmissionPenaltyPercentSnapshot();

        coins = applyPenalty(coins, penalty);
        xp = applyPenalty(xp, penalty);
        money = applyPenalty(money, penalty);
    }

    submission.setStatus(ChoreSubmissionStatus.APPROVED);
    submission.setReviewedByUser(parent);
    submission.setReviewedAt(Instant.now());

    submission.setCoinsAwarded(coins);
    submission.setXpAwarded(xp);
    submission.setMoneyAwardedPence(money);

    assignment.setStatus(ChoreAssignmentStatus.APPROVED);
    assignment.setCompletedAt(submission.getSubmittedAt());

    // Award the final reward to every approved participant.
    List<AssignmentParticipant> participants =
            assignmentParticipantRepository.findByAssignment(assignment);

            int rewardedParticipantCount = 0;

    for (AssignmentParticipant participant : participants) {

        if (participant.getParticipationStatus()
                == ParticipationStatus.EXCLUDED) {
            continue;
        }

        User child = participant.getChildUser();

        if (rewardTransactionRepository
                .existsByChoreSubmissionAndChildUser(
                        submission,
                        child
                )) {
            throw new IllegalStateException(
                    "Reward has already been issued to this child."
            );
        }

        UserProgress progress =
                userProgressRepository.findByChildUser(child)
                        .orElseGet(() -> {
                            UserProgress newProgress = new UserProgress();
                            newProgress.setChildUser(child);
                            return newProgress;
                        });

        progress.setCoinBalance(
                progress.getCoinBalance() + coins
        );

        progress.setTotalXp(
                progress.getTotalXp() + xp
        );

        progress.setCompletedChoreCount(
                progress.getCompletedChoreCount() + 1
        );

        updateStreak(progress);

        progress.setCurrentLevel(
                calculateLevel(progress.getTotalXp())
        );

        userProgressRepository.save(progress);

        

        achievementService.checkAndUnlockAchievements(
        child,
        progress
);

        RewardTransaction transaction =
                new RewardTransaction();

        transaction.setChildUser(child);
        transaction.setTransactionType(
                RewardTransactionType.CHORE_REWARD
        );
        transaction.setAmount(coins);
        transaction.setChoreSubmission(submission);
        transaction.setDescription(
                "Reward for completing "
                        + assignment.getChoreTemplate().getTitle()
        );

        rewardTransactionRepository.save(transaction);

        participant.setParticipationStatus(
                ParticipationStatus.PARTICIPATED
        );

        participant.setConfirmedAt(Instant.now());

        assignmentParticipantRepository.save(participant);
        rewardedParticipantCount++;
    }

    int totalCoinsEarned =
        coins * rewardedParticipantCount;

if (rewardedParticipantCount > 0) {

    familyChallengeService.recordApprovedChore(
            assignment.getChoreTemplate().getFamily(),
            totalCoinsEarned
    );
}

    submission.setRewardIssued(true);
    choreAssignmentRepository.save(assignment);

    return choreSubmissionRepository.save(submission);
}

@Transactional
public ChoreSubmission rejectSubmission(
        User parent,
        UUID submissionId,
        RejectChoreSubmissionRequest request
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
                "Children cannot reject chore submissions."
        );
    }

    ChoreSubmission submission =
            choreSubmissionRepository.findById(submissionId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Submission not found."
                            )
                    );

    if (submission.getStatus() != ChoreSubmissionStatus.PENDING) {
        throw new IllegalArgumentException(
                "Only pending submissions can be rejected."
        );
    }

    ChoreAssignment assignment = submission.getAssignment();

    if (!assignment.getChoreTemplate()
            .getFamily()
            .getId()
            .equals(parentMembership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "You cannot reject another family's submission."
        );
    }

    submission.setStatus(ChoreSubmissionStatus.REJECTED);
    submission.setReviewedByUser(parent);
    submission.setReviewedAt(Instant.now());
    submission.setParentFeedback(request.feedback());

    assignment.setStatus(ChoreAssignmentStatus.REJECTED);

    choreAssignmentRepository.save(assignment);

    return choreSubmissionRepository.save(submission);
}

private int applyPenalty(
        int value,
        int percentage
) {
    return (int) Math.round(
            value * (100 - percentage) / 100.0
    );
}

private int calculateLevel(int totalXp) {
    return (totalXp / 100) + 1;
}

private void updateStreak(UserProgress progress) {

    LocalDate today = LocalDate.now();
    LocalDate lastCompleted =
            progress.getLastCompletedChoreDate();

    if (lastCompleted == null) {
        progress.setCurrentStreak(1);

    } else if (lastCompleted.equals(today)) {
        // Already completed a chore today, so the streak stays the same.

    } else if (lastCompleted.equals(today.minusDays(1))) {
        progress.setCurrentStreak(
                progress.getCurrentStreak() + 1
        );

    } else {
        progress.setCurrentStreak(1);
    }

    if (progress.getCurrentStreak()
            > progress.getLongestStreak()) {

        progress.setLongestStreak(
                progress.getCurrentStreak()
        );
    }

    progress.setLastCompletedChoreDate(today);
}

public List<ParentChoreAssignmentResponse> getFamilyAssignments(
        User parent,
        ChoreAssignmentStatus status
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
                "Children cannot view family chore history."
        );
    }

    List<ChoreAssignment> assignments;

    if (status == null) {

        assignments =
                choreAssignmentRepository
                        .findByChoreTemplate_FamilyOrderByCreatedAtDesc(
                                membership.getFamily()
                        );

    } else {

        assignments =
                choreAssignmentRepository
                        .findByChoreTemplate_FamilyAndStatusOrderByCreatedAtDesc(
                                membership.getFamily(),
                                status
                        );
    }

    return assignments
            .stream()
            .map(this::toParentAssignmentResponse)
            .toList();
}


@Transactional
public ChoreAssignment cancelAssignment(
        User parent,
        UUID assignmentId
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
                "Children cannot cancel chore assignments."
        );
    }

    ChoreAssignment assignment =
            choreAssignmentRepository.findById(assignmentId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Chore assignment not found."
                            )
                    );

    // Make sure the assignment belongs to this parent's family.
    if (!assignment.getChoreTemplate()
            .getFamily()
            .getId()
            .equals(membership.getFamily().getId())) {

        throw new IllegalArgumentException(
                "You cannot cancel another family's chore assignment."
        );
    }

    ChoreAssignmentStatus status =
            assignment.getStatus();

    if (status != ChoreAssignmentStatus.ASSIGNED
            && status != ChoreAssignmentStatus.OVERDUE
            && status != ChoreAssignmentStatus.REJECTED) {

        throw new IllegalArgumentException(
                "This chore assignment can no longer be cancelled."
        );
    }

    assignment.setStatus(
            ChoreAssignmentStatus.CANCELLED
    );

    return choreAssignmentRepository.save(
            assignment
    );
}

private ParentChoreAssignmentResponse toParentAssignmentResponse(
        ChoreAssignment assignment
) {

    List<AssignmentParticipantResponse> participants =
            assignmentParticipantRepository
                    .findByAssignment(assignment)
                    .stream()
                    .map(participant ->
                            new AssignmentParticipantResponse(
                                    participant.getChildUser().getId(),
                                    participant.getChildUser().getName(),
                                    participant.getParticipationStatus()
                            )
                    )
                    .toList();

    return new ParentChoreAssignmentResponse(
            assignment.getId(),
            assignment.getChoreTemplate().getId(),
            assignment.getChoreTemplate().getTitle(),
            assignment.getChoreTemplate().getDescription(),
            assignment.getDueAt(),
            assignment.getStatus(),
            assignment.getCoinRewardSnapshot(),
            assignment.getXpRewardSnapshot(),
            assignment.getMoneyRewardPenceSnapshot(),
            participants,
            assignment.getCompletedAt(),
            assignment.getCreatedAt()
    );
}

@Transactional
public void markOverdueAssignments() {

    Instant now = Instant.now();

    List<ChoreAssignment> overdueAssignments =
            choreAssignmentRepository
                    .findByStatusAndDueAtBefore(
                            ChoreAssignmentStatus.ASSIGNED,
                            now
                    );

    for (ChoreAssignment assignment : overdueAssignments) {

        assignment.setStatus(
                ChoreAssignmentStatus.OVERDUE
        );
    }

    choreAssignmentRepository.saveAll(
            overdueAssignments
    );
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