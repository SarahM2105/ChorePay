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
import java.util.HashSet;
import java.util.Set;
import com.chorepay.backend.exception.ForbiddenException;
import com.chorepay.backend.exception.NotFoundException;
import com.chorepay.backend.notification.NotificationService;
import com.chorepay.backend.notification.NotificationType;

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
    private final ChoreChecklistItemRepository choreChecklistItemRepository;
    private final ChoreSubmissionChecklistItemRepository choreSubmissionChecklistItemRepository;
    private final NotificationService notificationService;

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
        ChoreChecklistItemRepository choreChecklistItemRepository,
        ChoreSubmissionChecklistItemRepository choreSubmissionChecklistItemRepository,
        NotificationService notificationService
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
    this.choreSubmissionChecklistItemRepository =choreSubmissionChecklistItemRepository;
    this.notificationService = notificationService;
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
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot edit chore checklists."
        );
    }

    ChoreTemplate template =
            choreTemplateRepository.findById(templateId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Chore template not found."
                            )
                    );

    if (!template.getFamily()
            .getId()
            .equals(membership.getFamily().getId())) {

        throw new ForbiddenException(
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
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    ChoreTemplate template =
            choreTemplateRepository.findById(templateId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Chore template not found."
                            )
                    );

    if (!template.getFamily()
            .getId()
            .equals(membership.getFamily().getId())) {

        throw new ForbiddenException(
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
                                new ForbiddenException(
                                        "User does not belong to a family."
                                )
                        );

        if (membership.getRole() == FamilyRole.CHILD) {
            throw new ForbiddenException(
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
                            new ForbiddenException(
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
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot edit chore templates."
        );
    }

    ChoreTemplate template =
            choreTemplateRepository.findById(templateId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Chore template not found."
                            )
                    );

    if (!template.getFamily().getId()
            .equals(membership.getFamily().getId())) {
        throw new ForbiddenException(
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
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot deactivate chore templates."
        );
    }

    ChoreTemplate template =
            choreTemplateRepository.findById(templateId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Chore template not found."
                            )
                    );

    if (!template.getFamily().getId()
            .equals(membership.getFamily().getId())) {
        throw new ForbiddenException(
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
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (parentMembership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot assign chores."
        );
    }

    ChoreTemplate template =
            choreTemplateRepository.findById(request.templateId())
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Chore template not found."
                            )
                    );

    if (!template.isActive()) {
        throw new ForbiddenException(
                "This chore template is inactive."
        );
    }

    if (!template.getFamily().getId()
            .equals(parentMembership.getFamily().getId())) {
        throw new ForbiddenException(
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
                        new NotFoundException(
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
                                new ForbiddenException(
                                        "Child does not belong to a family."
                                )
                        );

        if (!childMembership.getFamily().getId()
                .equals(parentMembership.getFamily().getId())) {
            throw new ForbiddenException(
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
        notificationService.createNotification(
        child,
        NotificationType.CHORE_ASSIGNED,
        "New chore",
        "You've been assigned "
                + template.getTitle()
                + ".",
        savedAssignment.getId()
);
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

public List<ParentChoreSubmissionResponse> getPendingSubmissions(
        User parent
) {

    FamilyMember membership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot view pending chore submissions."
        );
    }

    return choreSubmissionRepository
            .findByAssignment_ChoreTemplate_FamilyAndStatusOrderBySubmittedAtAsc(
                    membership.getFamily(),
                    ChoreSubmissionStatus.PENDING
            )
            .stream()
            .map(this::toParentSubmissionResponse)
            .toList();
}

public List<ParentChoreSubmissionResponse> getSubmissionHistory(
        User parent,
        ChoreSubmissionStatus status
) {

    FamilyMember membership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot view family submission history."
        );
    }

    List<ChoreSubmission> submissions;

    if (status == null) {

        submissions =
                choreSubmissionRepository
                        .findByAssignment_ChoreTemplate_FamilyOrderBySubmittedAtDesc(
                                membership.getFamily()
                        );

    } else {

        submissions =
                choreSubmissionRepository
                        .findByAssignment_ChoreTemplate_FamilyAndStatusOrderBySubmittedAtDesc(
                                membership.getFamily(),
                                status
                        );
    }

    return submissions
            .stream()
            .map(this::toParentSubmissionResponse)
            .toList();
}

public ParentChoreSubmissionResponse getSubmissionDetails(
        User parent,
        UUID submissionId
) {

    FamilyMember membership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot view parent submission details."
        );
    }

    ChoreSubmission submission =
            choreSubmissionRepository.findById(submissionId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Submission not found."
                            )
                    );

    if (!submission.getAssignment()
            .getChoreTemplate()
            .getFamily()
            .getId()
            .equals(membership.getFamily().getId())) {

        throw new ForbiddenException(
                "You cannot view another family's submission."
        );
    }

    return toParentSubmissionResponse(submission);
}

private ParentChoreSubmissionResponse toParentSubmissionResponse(
        ChoreSubmission submission
) {

    List<SubmissionChecklistItemResponse> checklist =
            choreSubmissionChecklistItemRepository
                    .findBySubmission(submission)
                    .stream()
                    .map(item ->
                            new SubmissionChecklistItemResponse(
                                    item.getChecklistItemId(),
                                    item.getTextSnapshot(),
                                    item.isRequiredSnapshot(),
                                    item.isCompleted()
                            )
                    )
                    .toList();

    return new ParentChoreSubmissionResponse(
            submission.getId(),
            submission.getAssignment().getId(),
            submission.getAssignment()
                    .getChoreTemplate()
                    .getTitle(),
            submission.getSubmittedByUser().getId(),
            submission.getSubmittedByUser().getName(),
            submission.getSubmissionNumber(),
            submission.getComment(),
            submission.getPhotoUrl(),
            submission.getStatus(),
            submission.getSubmittedAt(),
            submission.getParentFeedback(),
            submission.getReviewedAt(),
            checklist
    );
}

@Transactional
public ChoreAssignment updateAssignment(
        User parent,
        UUID assignmentId,
        UpdateChoreAssignmentRequest request
) {

    FamilyMember parentMembership =
            familyMemberRepository.findByUser(parent)
                    .orElseThrow(() ->
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (parentMembership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot edit chore assignments."
        );
    }

    ChoreAssignment assignment =
            choreAssignmentRepository.findById(assignmentId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Chore assignment not found."
                            )
                    );

    if (!assignment.getChoreTemplate()
            .getFamily()
            .getId()
            .equals(parentMembership.getFamily().getId())) {

        throw new ForbiddenException(
                "You cannot edit another family's chore assignment."
        );
    }

    if (assignment.getStatus() != ChoreAssignmentStatus.ASSIGNED
            && assignment.getStatus() != ChoreAssignmentStatus.OVERDUE) {

        throw new ForbiddenException(
                "Only assigned or overdue chores can be edited."
        );
    }

    /*
     * Prevent duplicate children.
     */
    Set<UUID> uniqueChildIds =
            new HashSet<>(request.childUserIds());

    if (uniqueChildIds.size()
            != request.childUserIds().size()) {

        throw new ForbiddenException(
                "The same child cannot be assigned twice."
        );
    }

    /*
     * Validate all children before changing anything.
     */
    List<User> children =
            uniqueChildIds
                    .stream()
                    .map(childId -> {

                        User child =
                                userRepository.findById(childId)
                                        .orElseThrow(() ->
                                                new NotFoundException(
                                                        "Child user not found."
                                                )
                                        );

                        if (child.getUserType() != UserType.CHILD) {
                            throw new IllegalArgumentException(
                                    "Chores can only be assigned to child accounts."
                            );
                        }

                        FamilyMember childMembership =
                                familyMemberRepository
                                        .findByUser(child)
                                        .orElseThrow(() ->
                                                new ForbiddenException(
                                                        "Child does not belong to a family."
                                                )
                                        );

                        if (!childMembership
                                .getFamily()
                                .getId()
                                .equals(
                                        parentMembership
                                                .getFamily()
                                                .getId()
                                )) {

                            throw new ForbiddenException(
                                    "You cannot assign chores to children in another family."
                            );
                        }

                        return child;
                    })
                    .toList();

    assignment.setDueAt(
            request.dueAt()
    );

    /*
     * Recalculate whether it should still be overdue.
     */
    if (request.dueAt() != null
            && request.dueAt().isBefore(Instant.now())) {

        assignment.setStatus(
                ChoreAssignmentStatus.OVERDUE
        );

    } else {

        assignment.setStatus(
                ChoreAssignmentStatus.ASSIGNED
        );
    }

    /*
     * Replace existing participants.
     */
    assignmentParticipantRepository
            .deleteByAssignment(assignment);

    for (User child : children) {

        AssignmentParticipant participant =
                new AssignmentParticipant();

        participant.setAssignment(assignment);
        participant.setChildUser(child);

        participant.setParticipationStatus(
                ParticipationStatus.ASSIGNED
        );

        assignmentParticipantRepository.save(
                participant
        );
    }

    return choreAssignmentRepository.save(
            assignment
    );
}

@Transactional
public ChoreSubmission submitChore(
        User child,
        UUID assignmentId,
        SubmitChoreRequest request
) {

    if (child.getUserType() != UserType.CHILD) {
        throw new ForbiddenException(
                "Only children can submit chores."
        );
    }

    ChoreAssignment assignment =
            choreAssignmentRepository.findById(assignmentId)
                    .orElseThrow(() ->
                            new NotFoundException(
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
        throw new ForbiddenException(
                "This chore is not assigned to you."
        );
    }

    if (assignment.getStatus()
            == ChoreAssignmentStatus.APPROVED
            || assignment.getStatus()
            == ChoreAssignmentStatus.CANCELLED) {

        throw new ForbiddenException(
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
        throw new ForbiddenException(
                "This chore already has a pending submission."
        );
    }

    ChoreTemplate template =
            assignment.getChoreTemplate();

    if (template.isPhotoRequired()
            && (request.photoUrl() == null
            || request.photoUrl().isBlank())) {

        throw new ForbiddenException(
                "A photo is required for this chore."
        );
    }

    if (template.isCommentRequired()
            && (request.comment() == null
            || request.comment().isBlank())) {

        throw new ForbiddenException(
                "A comment is required for this chore."
        );
    }

    /*
     * Load the checklist belonging to this chore.
     */
    List<ChoreChecklistItem> checklist =
            choreChecklistItemRepository
                    .findByChoreTemplateOrderByDisplayOrderAsc(
                            template
                    );

    /*
     * Convert submitted IDs into a Set.
     * Null means the child ticked nothing.
     */
    List<UUID> submittedChecklistIds =
            request.completedChecklistItemIds() == null
                    ? List.of()
                    : request.completedChecklistItemIds();

    Set<UUID> completedIds =
            new HashSet<>(submittedChecklistIds);

    /*
     * Prevent duplicate checklist IDs.
     */
    if (completedIds.size()
            != submittedChecklistIds.size()) {

        throw new ForbiddenException(
                "The same checklist item cannot be submitted twice."
        );
    }

    /*
     * Ensure every submitted ID actually belongs
     * to this chore's checklist.
     */
    Set<UUID> validChecklistIds =
            checklist.stream()
                    .map(ChoreChecklistItem::getId)
                    .collect(
                            java.util.stream.Collectors.toSet()
                    );

    for (UUID completedId : completedIds) {

        if (!validChecklistIds.contains(completedId)) {
            throw new ForbiddenException(
                    "A submitted checklist item does not belong to this chore."
            );
        }
    }

    /*
     * Every required checklist step must be completed.
     */
    for (ChoreChecklistItem checklistItem : checklist) {

        if (checklistItem.isRequired()
                && !completedIds.contains(
                        checklistItem.getId()
                )) {

            throw new IllegalArgumentException(
                    "All required checklist items must be completed."
            );
        }
    }

    long previousSubmissions =
            choreSubmissionRepository
                    .countByAssignment(
                            assignment
                    );

    ChoreSubmission submission =
            new ChoreSubmission();

    submission.setAssignment(
            assignment
    );

    submission.setSubmittedByUser(
            child
    );

    submission.setSubmissionNumber(
            (int) previousSubmissions + 1
    );

    submission.setComment(
            request.comment()
    );

    submission.setPhotoUrl(
            request.photoUrl()
    );

    submission.setStatus(
            ChoreSubmissionStatus.PENDING
    );

    /*
     * Save first because checklist rows need
     * the submission ID.
     */
    ChoreSubmission savedSubmission =
            choreSubmissionRepository.save(
                    submission
            );

    /*
     * Snapshot the full checklist and record
     * which items the child completed.
     */
    for (ChoreChecklistItem checklistItem : checklist) {

        ChoreSubmissionChecklistItem submissionItem =
                new ChoreSubmissionChecklistItem();

        submissionItem.setSubmission(
                savedSubmission
        );

        submissionItem.setChecklistItemId(
                checklistItem.getId()
        );

        submissionItem.setTextSnapshot(
                checklistItem.getText()
        );

        submissionItem.setRequiredSnapshot(
                checklistItem.isRequired()
        );

        submissionItem.setCompleted(
                completedIds.contains(
                        checklistItem.getId()
                )
        );

        choreSubmissionChecklistItemRepository.save(
                submissionItem
        );
    }

    assignment.setStatus(
            ChoreAssignmentStatus.SUBMITTED
    );

    choreAssignmentRepository.save(
            assignment
    );

    return savedSubmission;
}

public List<ChildChoreAssignmentResponse> getMyAssignments(
        User child,
        ChoreAssignmentStatus status
) {

    if (child.getUserType() != UserType.CHILD) {
        throw new ForbiddenException(
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

    List<ChoreChecklistItemResponse> checklist =
            choreChecklistItemRepository
                    .findByChoreTemplateOrderByDisplayOrderAsc(
                            assignment.getChoreTemplate()
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
            checklist,

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

    List<SubmissionChecklistItemResponse> checklist =
            choreSubmissionChecklistItemRepository
                    .findBySubmission(submission)
                    .stream()
                    .map(item ->
                            new SubmissionChecklistItemResponse(
                                    item.getChecklistItemId(),
                                    item.getTextSnapshot(),
                                    item.isRequiredSnapshot(),
                                    item.isCompleted()
                            )
                    )
                    .toList();

    return new ChoreSubmissionResponse(
            submission.getId(),
            submission.getAssignment().getId(),
            submission.getSubmissionNumber(),
            submission.getComment(),
            submission.getPhotoUrl(),
            submission.getStatus(),
            submission.getSubmittedAt(),
            submission.getParentFeedback(),
            checklist
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
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (parentMembership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot approve chore submissions."
        );
    }

    ChoreSubmission submission =
            choreSubmissionRepository.findById(submissionId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Submission not found."
                            )
                    );

    if (submission.getStatus() != ChoreSubmissionStatus.PENDING) {
        throw new ForbiddenException(
                "Only pending submissions can be approved."
        );
    }

    ChoreAssignment assignment = submission.getAssignment();

    if (!assignment.getChoreTemplate()
            .getFamily()
            .getId()
            .equals(parentMembership.getFamily().getId())) {

        throw new ForbiddenException(
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
    notificationService.createNotification(
        submission.getSubmittedByUser(),
        NotificationType.CHORE_APPROVED,
        "Chore approved!",
        assignment.getChoreTemplate().getTitle()
                + " was approved.",
        assignment.getId()
);
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
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (parentMembership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot reject chore submissions."
        );
    }

    ChoreSubmission submission =
            choreSubmissionRepository.findById(submissionId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Submission not found."
                            )
                    );

    if (submission.getStatus() != ChoreSubmissionStatus.PENDING) {
        throw new ForbiddenException(
                "Only pending submissions can be rejected."
        );
    }

    ChoreAssignment assignment = submission.getAssignment();

    if (!assignment.getChoreTemplate()
            .getFamily()
            .getId()
            .equals(parentMembership.getFamily().getId())) {

        throw new ForbiddenException(
                "You cannot reject another family's submission."
        );
    }

    submission.setStatus(
        ChoreSubmissionStatus.REJECTED
);

submission.setReviewedByUser(parent);
submission.setReviewedAt(Instant.now());

submission.setParentFeedback(
        request.feedback()
);

assignment.setStatus(
        ChoreAssignmentStatus.REJECTED
);

choreAssignmentRepository.save(
        assignment
);

notificationService.createNotification(
        submission.getSubmittedByUser(),
        NotificationType.CHORE_REJECTED,
        "Chore needs another try",
        assignment.getChoreTemplate().getTitle()
                + " was sent back for another try.",
        assignment.getId()
);

return choreSubmissionRepository.save(
        submission
);
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
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
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
                            new ForbiddenException(
                                    "User does not belong to a family."
                            )
                    );

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot cancel chore assignments."
        );
    }

    ChoreAssignment assignment =
            choreAssignmentRepository.findById(assignmentId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Chore assignment not found."
                            )
                    );

    // Make sure the assignment belongs to this parent's family.
    if (!assignment.getChoreTemplate()
            .getFamily()
            .getId()
            .equals(membership.getFamily().getId())) {

        throw new ForbiddenException(
                "You cannot cancel another family's chore assignment."
        );
    }

    ChoreAssignmentStatus status =
            assignment.getStatus();

    if (status != ChoreAssignmentStatus.ASSIGNED
            && status != ChoreAssignmentStatus.OVERDUE
            && status != ChoreAssignmentStatus.REJECTED) {

        throw new ForbiddenException(
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

    ChoreTemplate template =
            assignment.getChoreTemplate();

    User createdBy =
            template.getCreatedByUser();

    return new ParentChoreAssignmentResponse(
            assignment.getId(),
            template.getId(),
            template.getTitle(),
            template.getDescription(),

            createdBy.getId(),
            createdBy.getName(),

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