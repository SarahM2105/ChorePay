package com.chorepay.backend.chore;

import com.chorepay.backend.achievement.AchievementService;
import com.chorepay.backend.challenge.FamilyChallengeService;
import com.chorepay.backend.family.Family;
import com.chorepay.backend.family.FamilyMember;
import com.chorepay.backend.family.FamilyMemberRepository;
import com.chorepay.backend.family.FamilyRole;
import com.chorepay.backend.notification.NotificationService;
import com.chorepay.backend.progress.UserProgressRepository;
import com.chorepay.backend.reward.RewardTransactionRepository;
import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserRepository;
import com.chorepay.backend.user.UserType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.chorepay.backend.exception.ForbiddenException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.chorepay.backend.notification.NotificationType;
import com.chorepay.backend.progress.UserProgress;
import com.chorepay.backend.reward.RewardTransaction;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChoreServiceTest {

    @Mock
    private ChoreTemplateRepository choreTemplateRepository;

    @Mock
    private FamilyMemberRepository familyMemberRepository;

    @Mock
    private ChoreAssignmentRepository choreAssignmentRepository;

    @Mock
    private AssignmentParticipantRepository assignmentParticipantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ChoreSubmissionRepository choreSubmissionRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private RewardTransactionRepository rewardTransactionRepository;

    @Mock
    private AchievementService achievementService;

    @Mock
    private FamilyChallengeService familyChallengeService;

    @Mock
    private ChoreChecklistItemRepository choreChecklistItemRepository;

    @Mock
    private ChoreSubmissionChecklistItemRepository choreSubmissionChecklistItemRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ChoreService choreService;

    private User parent;
    private User child;
    private Family family;
    private FamilyMember parentMembership;
    private FamilyMember childMembership;
    private ChoreTemplate template;

    @BeforeEach
    void setUp() {

        parent = mock(User.class);
        child = mock(User.class);
        family = mock(Family.class);

        parentMembership = new FamilyMember();
        parentMembership.setFamily(family);
        parentMembership.setUser(parent);
        parentMembership.setRole(FamilyRole.PARENT);

        childMembership = new FamilyMember();
        childMembership.setFamily(family);
        childMembership.setUser(child);
        childMembership.setRole(FamilyRole.CHILD);

        template = new ChoreTemplate();
        template.setFamily(family);
        template.setTitle("Clean Bedroom");
        template.setCoinReward(20);
        template.setXpReward(24);
        template.setMoneyRewardPence(0);
        template.setLatePenaltyPercent(0);
        template.setResubmissionPenaltyPercent(0);
        template.setActive(true);
    }

    @Test
    void assignChore_shouldCreateAssignmentAndParticipant() {

        UUID templateId = UUID.randomUUID();
        UUID childId = UUID.randomUUID();

        Instant dueAt =
                Instant.now().plusSeconds(3600);

        AssignChoreRequest request =
                new AssignChoreRequest(
                        templateId,
                        List.of(childId),
                        dueAt
                );

        when(child.getUserType())
                .thenReturn(UserType.CHILD);

        when(family.getId())
                .thenReturn(UUID.randomUUID());

        when(familyMemberRepository
                .findByUser(parent))
                .thenReturn(
                        Optional.of(parentMembership)
                );

        when(choreTemplateRepository
                .findById(templateId))
                .thenReturn(
                        Optional.of(template)
                );

        when(userRepository
                .findById(childId))
                .thenReturn(
                        Optional.of(child)
                );

        when(familyMemberRepository
                .findByUser(child))
                .thenReturn(
                        Optional.of(childMembership)
                );

        when(choreAssignmentRepository
                .save(any(ChoreAssignment.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        ChoreAssignment result =
                choreService.assignChore(
                        parent,
                        request
                );

        assertEquals(
                ChoreAssignmentStatus.ASSIGNED,
                result.getStatus()
        );

        assertSame(
                template,
                result.getChoreTemplate()
        );

        assertSame(
                parent,
                result.getAssignedByUser()
        );

        assertEquals(
                20,
                result.getCoinRewardSnapshot()
        );

        assertEquals(
                24,
                result.getXpRewardSnapshot()
        );

        verify(
                assignmentParticipantRepository
        ).save(
                any(AssignmentParticipant.class)
        );

        verify(notificationService)
                .createNotification(
                        eq(child),
                        eq(com.chorepay.backend.notification.NotificationType.CHORE_ASSIGNED),
                        eq("New chore"),
                        eq("You've been assigned Clean Bedroom."),
                        any()
                );
    }


    @Test
void assignChore_shouldRejectWhenUserIsChild() {

    User childTryingToAssign =
            mock(User.class);

    FamilyMember childAsMember =
            new FamilyMember();

    childAsMember.setFamily(family);
    childAsMember.setUser(childTryingToAssign);
    childAsMember.setRole(
            FamilyRole.CHILD
    );

    UUID templateId =
            UUID.randomUUID();

    UUID childId =
            UUID.randomUUID();

    AssignChoreRequest request =
            new AssignChoreRequest(
                    templateId,
                    List.of(childId),
                    Instant.now().plusSeconds(3600)
            );

    when(familyMemberRepository
            .findByUser(childTryingToAssign))
            .thenReturn(
                    Optional.of(childAsMember)
            );

    ForbiddenException exception =
            org.junit.jupiter.api.Assertions.assertThrows(
                    ForbiddenException.class,
                    () ->
                            choreService.assignChore(
                                    childTryingToAssign,
                                    request
                            )
            );

    assertEquals(
            "Children cannot assign chores.",
            exception.getMessage()
    );

    verifyNoInteractions(
            choreTemplateRepository
    );

    verifyNoInteractions(
            choreAssignmentRepository
    );

    verifyNoInteractions(
            assignmentParticipantRepository
    );

    verifyNoInteractions(
            notificationService
    );
}


@Test
void assignChore_shouldRejectWhenAssignedUserIsNotChild() {

    User nonChildUser =
            mock(User.class);

    UUID templateId =
            UUID.randomUUID();

    UUID nonChildUserId =
            UUID.randomUUID();

    AssignChoreRequest request =
            new AssignChoreRequest(
                    templateId,
                    List.of(nonChildUserId),
                    Instant.now().plusSeconds(3600)
            );

    when(family.getId())
            .thenReturn(UUID.randomUUID());

    when(familyMemberRepository
            .findByUser(parent))
            .thenReturn(
                    Optional.of(parentMembership)
            );

    when(choreTemplateRepository
            .findById(templateId))
            .thenReturn(
                    Optional.of(template)
            );

    /*
     * assignChore saves the assignment before it
     * starts validating each selected participant.
     */
    when(choreAssignmentRepository
            .save(any(ChoreAssignment.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    when(userRepository
            .findById(nonChildUserId))
            .thenReturn(
                    Optional.of(nonChildUser)
            );

    when(nonChildUser.getUserType())
            .thenReturn(UserType.PARENT);

    IllegalArgumentException exception =
            org.junit.jupiter.api.Assertions.assertThrows(
                    IllegalArgumentException.class,
                    () ->
                            choreService.assignChore(
                                    parent,
                                    request
                            )
            );

    assertEquals(
            "Chores can only be assigned to child accounts.",
            exception.getMessage()
    );

    verify(
            assignmentParticipantRepository,
            never()
    ).save(
            any(AssignmentParticipant.class)
    );

    verifyNoInteractions(
            notificationService
    );
}

@Test
void assignChore_shouldRejectChildFromAnotherFamily() {

    Family otherFamily =
            mock(Family.class);

    UUID thisFamilyId =
            UUID.randomUUID();

    UUID otherFamilyId =
            UUID.randomUUID();

    UUID templateId =
            UUID.randomUUID();

    UUID childId =
            UUID.randomUUID();

    AssignChoreRequest request =
            new AssignChoreRequest(
                    templateId,
                    List.of(childId),
                    Instant.now().plusSeconds(3600)
            );

    /*
     * Parent/template belong to this family.
     */
    when(family.getId())
            .thenReturn(thisFamilyId);

    /*
     * Child belongs to a completely different family.
     */
    when(otherFamily.getId())
            .thenReturn(otherFamilyId);

    FamilyMember otherFamilyChildMembership =
            new FamilyMember();

    otherFamilyChildMembership.setFamily(
            otherFamily
    );

    otherFamilyChildMembership.setUser(
            child
    );

    otherFamilyChildMembership.setRole(
            FamilyRole.CHILD
    );

    when(familyMemberRepository
            .findByUser(parent))
            .thenReturn(
                    Optional.of(parentMembership)
            );

    when(choreTemplateRepository
            .findById(templateId))
            .thenReturn(
                    Optional.of(template)
            );

    /*
     * The current service saves the assignment
     * before validating the selected child.
     */
    when(choreAssignmentRepository
            .save(any(ChoreAssignment.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    when(userRepository
            .findById(childId))
            .thenReturn(
                    Optional.of(child)
            );

    when(child.getUserType())
            .thenReturn(
                    UserType.CHILD
            );

    when(familyMemberRepository
            .findByUser(child))
            .thenReturn(
                    Optional.of(
                            otherFamilyChildMembership
                    )
            );

    ForbiddenException exception =
            org.junit.jupiter.api.Assertions.assertThrows(
                    ForbiddenException.class,
                    () ->
                            choreService.assignChore(
                                    parent,
                                    request
                            )
            );

    assertEquals(
            "You cannot assign chores to children in another family.",
            exception.getMessage()
    );

    verify(
            assignmentParticipantRepository,
            never()
    ).save(
            any(AssignmentParticipant.class)
    );

    verifyNoInteractions(
            notificationService
    );
}

@Test
void submitChore_shouldCreatePendingSubmission() {

    UUID assignmentId =
            UUID.randomUUID();

    ChoreAssignment assignment =
            new ChoreAssignment();

    assignment.setChoreTemplate(
            template
    );

    assignment.setStatus(
            ChoreAssignmentStatus.ASSIGNED
    );

    SubmitChoreRequest request =
            new SubmitChoreRequest(
                    "Finished!",
                    null,
                    List.of()
            );

    when(child.getUserType())
            .thenReturn(
                    UserType.CHILD
            );

    when(choreAssignmentRepository
            .findById(assignmentId))
            .thenReturn(
                    Optional.of(assignment)
            );

    when(assignmentParticipantRepository
            .existsByAssignmentAndChildUser(
                    assignment,
                    child
            ))
            .thenReturn(true);

    when(choreSubmissionRepository
            .findByAssignmentAndStatus(
                    assignment,
                    ChoreSubmissionStatus.PENDING
            ))
            .thenReturn(
                    Optional.empty()
            );

    /*
     * This chore has no checklist for this test.
     */
    when(choreChecklistItemRepository
            .findByChoreTemplateOrderByDisplayOrderAsc(
                    template
            ))
            .thenReturn(
                    List.of()
            );

    when(choreSubmissionRepository
            .countByAssignment(assignment))
            .thenReturn(0L);

    when(choreSubmissionRepository
            .save(any(ChoreSubmission.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    ChoreSubmission result =
            choreService.submitChore(
                    child,
                    assignmentId,
                    request
            );

    assertEquals(
            ChoreSubmissionStatus.PENDING,
            result.getStatus()
    );

    assertSame(
            assignment,
            result.getAssignment()
    );

    assertSame(
            child,
            result.getSubmittedByUser()
    );

    assertEquals(
            1,
            result.getSubmissionNumber()
    );

    assertEquals(
            "Finished!",
            result.getComment()
    );

    assertEquals(
            ChoreAssignmentStatus.SUBMITTED,
            assignment.getStatus()
    );

    verify(choreSubmissionRepository)
            .save(
                    any(ChoreSubmission.class)
            );

    verify(choreAssignmentRepository)
            .save(assignment);
}


@Test
void submitChore_shouldRejectChildWhoIsNotAssigned() {

    UUID assignmentId =
            UUID.randomUUID();

    ChoreAssignment assignment =
            new ChoreAssignment();

    assignment.setChoreTemplate(
            template
    );

    assignment.setStatus(
            ChoreAssignmentStatus.ASSIGNED
    );

    SubmitChoreRequest request =
            new SubmitChoreRequest(
                    "Finished!",
                    null,
                    List.of()
            );

    when(child.getUserType())
            .thenReturn(
                    UserType.CHILD
            );

    when(choreAssignmentRepository
            .findById(assignmentId))
            .thenReturn(
                    Optional.of(assignment)
            );

    when(assignmentParticipantRepository
            .existsByAssignmentAndChildUser(
                    assignment,
                    child
            ))
            .thenReturn(false);

    ForbiddenException exception =
            org.junit.jupiter.api.Assertions.assertThrows(
                    ForbiddenException.class,
                    () ->
                            choreService.submitChore(
                                    child,
                                    assignmentId,
                                    request
                            )
            );

    assertEquals(
            "This chore is not assigned to you.",
            exception.getMessage()
    );

    verify(
            choreSubmissionRepository,
            never()
    ).save(
            any(ChoreSubmission.class)
    );

    verify(
            choreAssignmentRepository,
            never()
    ).save(
            assignment
    );
}

@Test
void submitChore_shouldRejectWhenRequiredChecklistItemIsNotCompleted() {

    UUID assignmentId =
            UUID.randomUUID();

    ChoreAssignment assignment =
            new ChoreAssignment();

    assignment.setChoreTemplate(
            template
    );

    assignment.setStatus(
            ChoreAssignmentStatus.ASSIGNED
    );

    ChoreChecklistItem requiredItem =
            new ChoreChecklistItem();

    requiredItem.setChoreTemplate(
            template
    );

    requiredItem.setText(
            "Make the bed"
    );

    requiredItem.setRequired(
            true
    );

    requiredItem.setDisplayOrder(
            1
    );

    /*
     * Empty list means the child has not
     * ticked any checklist items.
     */
    SubmitChoreRequest request =
            new SubmitChoreRequest(
                    "Finished!",
                    null,
                    List.of()
            );

    when(child.getUserType())
            .thenReturn(
                    UserType.CHILD
            );

    when(choreAssignmentRepository
            .findById(assignmentId))
            .thenReturn(
                    Optional.of(assignment)
            );

    when(assignmentParticipantRepository
            .existsByAssignmentAndChildUser(
                    assignment,
                    child
            ))
            .thenReturn(true);

    when(choreSubmissionRepository
            .findByAssignmentAndStatus(
                    assignment,
                    ChoreSubmissionStatus.PENDING
            ))
            .thenReturn(
                    Optional.empty()
            );

    when(choreChecklistItemRepository
            .findByChoreTemplateOrderByDisplayOrderAsc(
                    template
            ))
            .thenReturn(
                    List.of(requiredItem)
            );

    IllegalArgumentException exception =
            org.junit.jupiter.api.Assertions.assertThrows(
                    IllegalArgumentException.class,
                    () ->
                            choreService.submitChore(
                                    child,
                                    assignmentId,
                                    request
                            )
            );

    assertEquals(
            "All required checklist items must be completed.",
            exception.getMessage()
    );

    verify(
            choreSubmissionRepository,
            never()
    ).save(
            any(ChoreSubmission.class)
    );

    verify(
            choreAssignmentRepository,
            never()
    ).save(
            assignment
    );
}

@Test
void approveSubmission_shouldRewardChildAndApproveChore() {

    UUID submissionId =
            UUID.randomUUID();

    when(family.getId())
            .thenReturn(UUID.randomUUID());

    ChoreAssignment assignment =
            new ChoreAssignment();

    assignment.setChoreTemplate(template);
    assignment.setAssignedByUser(parent);

    assignment.setStatus(
            ChoreAssignmentStatus.SUBMITTED
    );

    assignment.setCoinRewardSnapshot(20);
    assignment.setXpRewardSnapshot(24);
    assignment.setMoneyRewardPenceSnapshot(0);

    assignment.setLatePenaltyPercentSnapshot(0);
    assignment.setResubmissionPenaltyPercentSnapshot(0);

    ChoreSubmission submission =
            new ChoreSubmission();

    submission.setAssignment(assignment);
    submission.setSubmittedByUser(child);

    submission.setStatus(
            ChoreSubmissionStatus.PENDING
    );

    submission.setSubmissionNumber(1);

    AssignmentParticipant participant =
            new AssignmentParticipant();

    participant.setAssignment(assignment);
    participant.setChildUser(child);

    participant.setParticipationStatus(
            ParticipationStatus.ASSIGNED
    );

    UserProgress progress =
            new UserProgress();

    progress.setChildUser(child);
    progress.setCoinBalance(0);
    progress.setTotalXp(0);
    progress.setCompletedChoreCount(0);
    progress.setCurrentLevel(1);

    when(familyMemberRepository
            .findByUser(parent))
            .thenReturn(
                    Optional.of(parentMembership)
            );

    when(choreSubmissionRepository
            .findById(submissionId))
            .thenReturn(
                    Optional.of(submission)
            );

    when(assignmentParticipantRepository
            .findByAssignment(assignment))
            .thenReturn(
                    List.of(participant)
            );

    when(rewardTransactionRepository
            .existsByChoreSubmissionAndChildUser(
                    submission,
                    child
            ))
            .thenReturn(false);

    when(userProgressRepository
            .findByChildUser(child))
            .thenReturn(
                    Optional.of(progress)
            );

    when(choreSubmissionRepository
            .save(any(ChoreSubmission.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    ChoreSubmission result =
            choreService.approveSubmission(
                    parent,
                    submissionId
            );

    /*
     * Submission approved.
     */
    assertEquals(
            ChoreSubmissionStatus.APPROVED,
            result.getStatus()
    );

    assertEquals(
            20,
            result.getCoinsAwarded()
    );

    assertEquals(
            24,
            result.getXpAwarded()
    );

    /*
     * Assignment completed.
     */
    assertEquals(
            ChoreAssignmentStatus.APPROVED,
            assignment.getStatus()
    );

    /*
     * Child progress updated.
     */
    assertEquals(
            20,
            progress.getCoinBalance()
    );

    assertEquals(
            24,
            progress.getTotalXp()
    );

    assertEquals(
            1,
            progress.getCompletedChoreCount()
    );

    assertEquals(
            1,
            progress.getCurrentStreak()
    );

    /*
     * Reward transaction created.
     */
    verify(rewardTransactionRepository)
            .save(
                    any(RewardTransaction.class)
            );

    /*
     * Achievement system checked.
     */
    verify(achievementService)
            .checkAndUnlockAchievements(
                    child,
                    progress
            );

    /*
     * Family challenge progress updated.
     */
    verify(familyChallengeService)
            .recordApprovedChore(
                    family,
                    20
            );

    /*
     * Child receives approval notification.
     */
    verify(notificationService)
            .createNotification(
                    eq(child),
                    eq(NotificationType.CHORE_APPROVED),
                    eq("Chore approved!"),
                    eq("Clean Bedroom was approved."),
                    any()
            );
}

@Test
void approveSubmission_shouldRejectDuplicateReward() {

    UUID submissionId =
            UUID.randomUUID();

    when(family.getId())
            .thenReturn(UUID.randomUUID());

    ChoreAssignment assignment =
            new ChoreAssignment();

    assignment.setChoreTemplate(template);

    assignment.setStatus(
            ChoreAssignmentStatus.SUBMITTED
    );

    assignment.setCoinRewardSnapshot(20);
    assignment.setXpRewardSnapshot(24);
    assignment.setMoneyRewardPenceSnapshot(0);

    assignment.setLatePenaltyPercentSnapshot(0);
    assignment.setResubmissionPenaltyPercentSnapshot(0);

    ChoreSubmission submission =
            new ChoreSubmission();

    submission.setAssignment(assignment);
    submission.setSubmittedByUser(child);

    submission.setStatus(
            ChoreSubmissionStatus.PENDING
    );

    submission.setSubmissionNumber(1);

    AssignmentParticipant participant =
            new AssignmentParticipant();

    participant.setAssignment(assignment);
    participant.setChildUser(child);

    participant.setParticipationStatus(
            ParticipationStatus.ASSIGNED
    );

    when(familyMemberRepository
            .findByUser(parent))
            .thenReturn(
                    Optional.of(parentMembership)
            );

    when(choreSubmissionRepository
            .findById(submissionId))
            .thenReturn(
                    Optional.of(submission)
            );

    when(assignmentParticipantRepository
            .findByAssignment(assignment))
            .thenReturn(
                    List.of(participant)
            );

    /*
     * Pretend a reward transaction already
     * exists for this submission + child.
     */
    when(rewardTransactionRepository
            .existsByChoreSubmissionAndChildUser(
                    submission,
                    child
            ))
            .thenReturn(true);

    IllegalStateException exception =
            org.junit.jupiter.api.Assertions.assertThrows(
                    IllegalStateException.class,
                    () ->
                            choreService.approveSubmission(
                                    parent,
                                    submissionId
                            )
            );

    assertEquals(
            "Reward has already been issued to this child.",
            exception.getMessage()
    );

    /*
     * No second reward transaction.
     */
    verify(
            rewardTransactionRepository,
            never()
    ).save(
            any(RewardTransaction.class)
    );

    /*
     * Progress should not be changed.
     */
    verifyNoInteractions(
            userProgressRepository
    );

    /*
     * No achievement/challenge side effects.
     */
    verifyNoInteractions(
            achievementService
    );

    verifyNoInteractions(
            familyChallengeService
    );

    /*
     * Don't send an approval notification
     * when approval fails.
     */
    verifyNoInteractions(
            notificationService
    );
}
 @Test
void approveSubmission_shouldApplyLatePenalty() {

    UUID submissionId =
            UUID.randomUUID();

    when(family.getId())
            .thenReturn(UUID.randomUUID());

    Instant dueAt =
            Instant.now().minusSeconds(3600);

    Instant submittedAt =
            Instant.now();

    ChoreAssignment assignment =
            new ChoreAssignment();

    assignment.setChoreTemplate(template);
    assignment.setStatus(
            ChoreAssignmentStatus.SUBMITTED
    );

    assignment.setDueAt(dueAt);

    assignment.setCoinRewardSnapshot(20);
    assignment.setXpRewardSnapshot(24);
    assignment.setMoneyRewardPenceSnapshot(0);

    /*
     * 25% late penalty:
     *
     * 20 coins -> 15
     * 24 XP    -> 18
     */
    assignment.setLatePenaltyPercentSnapshot(25);
    assignment.setResubmissionPenaltyPercentSnapshot(0);

    ChoreSubmission submission =
            mock(ChoreSubmission.class);

    when(submission.getStatus())
            .thenReturn(
                    ChoreSubmissionStatus.PENDING
            );

    when(submission.getAssignment())
            .thenReturn(assignment);

    when(submission.getSubmittedAt())
            .thenReturn(submittedAt);

    when(submission.getSubmissionNumber())
            .thenReturn(1);

    when(submission.getSubmittedByUser())
            .thenReturn(child);

    AssignmentParticipant participant =
            new AssignmentParticipant();

    participant.setAssignment(assignment);
    participant.setChildUser(child);

    participant.setParticipationStatus(
            ParticipationStatus.ASSIGNED
    );

    UserProgress progress =
            new UserProgress();

    progress.setChildUser(child);
    progress.setCoinBalance(0);
    progress.setTotalXp(0);
    progress.setCompletedChoreCount(0);
    progress.setCurrentLevel(1);

    when(familyMemberRepository
            .findByUser(parent))
            .thenReturn(
                    Optional.of(parentMembership)
            );

    when(choreSubmissionRepository
            .findById(submissionId))
            .thenReturn(
                    Optional.of(submission)
            );

    when(assignmentParticipantRepository
            .findByAssignment(assignment))
            .thenReturn(
                    List.of(participant)
            );

    when(rewardTransactionRepository
            .existsByChoreSubmissionAndChildUser(
                    submission,
                    child
            ))
            .thenReturn(false);

    when(userProgressRepository
            .findByChildUser(child))
            .thenReturn(
                    Optional.of(progress)
            );

    when(choreSubmissionRepository
            .save(submission))
            .thenReturn(submission);

    choreService.approveSubmission(
            parent,
            submissionId
    );

    /*
     * 25% deducted from 20 coins.
     */
    assertEquals(
            15,
            progress.getCoinBalance()
    );

    /*
     * 25% deducted from 24 XP.
     */
    assertEquals(
            18,
            progress.getTotalXp()
    );

    verify(submission)
            .setCoinsAwarded(15);

    verify(submission)
            .setXpAwarded(18);

    verify(rewardTransactionRepository)
            .save(
                    argThat(transaction ->
                            transaction.getAmount() == 15
                    )
            );

    verify(familyChallengeService)
            .recordApprovedChore(
                    family,
                    15
            );
}

}