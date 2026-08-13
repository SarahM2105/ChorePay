package com.chorepay.backend.family;

import com.chorepay.backend.exception.ForbiddenException;
import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserRepository;
import com.chorepay.backend.user.UserType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import java.util.UUID;
import com.chorepay.backend.exception.ForbiddenException;


@ExtendWith(MockitoExtension.class)
class FamilyServiceTest {

    @Mock
    private FamilyRepository familyRepository;

    @Mock
    private FamilyMemberRepository familyMemberRepository;

    @Mock
    private FamilyJoinRequestRepository familyJoinRequestRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FamilyService familyService;

    @Test
    void createFamily_shouldCreateFamilyAndOwnerMembership() {

        User parent =
                mock(User.class);

        when(parent.getUserType())
                .thenReturn(UserType.PARENT);

        when(familyMemberRepository
                .existsByUser(parent))
                .thenReturn(false);

        /*
         * Whatever random join code is generated,
         * pretend it doesn't already exist.
         */
        when(familyRepository
                .existsByJoinCode(anyString()))
                .thenReturn(false);

        when(familyRepository
                .save(any(Family.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        Family result =
                familyService.createFamily(
                        parent,
                        "Miah Family"
                );

        assertEquals(
                "Miah Family",
                result.getName()
        );

        assertNotNull(
                result.getJoinCode()
        );

        assertEquals(
                8,
                result.getJoinCode().length()
        );

        /*
         * Capture the FamilyMember that was saved
         * so we can inspect it.
         */
        ArgumentCaptor<FamilyMember> memberCaptor =
                ArgumentCaptor.forClass(
                        FamilyMember.class
                );

        verify(familyMemberRepository)
                .save(
                        memberCaptor.capture()
                );

        FamilyMember savedMembership =
                memberCaptor.getValue();

        assertSame(
                result,
                savedMembership.getFamily()
        );

        assertSame(
                parent,
                savedMembership.getUser()
        );

        assertEquals(
                FamilyRole.OWNER,
                savedMembership.getRole()
        );

        verify(familyRepository)
                .save(
                        any(Family.class)
                );
    }

    @Test
void createFamily_shouldRejectWhenCreatorIsChild() {

    User child =
            mock(User.class);

    when(child.getUserType())
            .thenReturn(UserType.CHILD);

    IllegalArgumentException exception =
            assertThrows(
                    IllegalArgumentException.class,
                    () ->
                            familyService.createFamily(
                                    child,
                                    "Miah Family"
                            )
            );

    assertEquals(
            "Only parents can create a family.",
            exception.getMessage()
    );

    verifyNoInteractions(
            familyRepository
    );

    verifyNoInteractions(
            familyMemberRepository
    );
}

@Test
void requestToJoinFamily_shouldCreatePendingRequestForChild() {

    User child =
            mock(User.class);

    Family family =
            mock(Family.class);

    when(child.getUserType())
            .thenReturn(UserType.CHILD);

    when(familyMemberRepository
            .existsByUser(child))
            .thenReturn(false);

    /*
     * We deliberately use lowercase here.
     * The service should convert it to uppercase.
     */
    when(familyRepository
            .findByJoinCode("ABC12345"))
            .thenReturn(
                    Optional.of(family)
            );

    when(familyJoinRequestRepository
            .findByFamilyAndRequestedByUserAndStatus(
                    family,
                    child,
                    FamilyJoinRequestStatus.PENDING
            ))
            .thenReturn(
                    Optional.empty()
            );

    when(familyJoinRequestRepository
            .save(any(FamilyJoinRequest.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    FamilyJoinRequest result =
            familyService.requestToJoinFamily(
                    child,
                    "abc12345"
            );

    assertSame(
            family,
            result.getFamily()
    );

    assertSame(
            child,
            result.getRequestedByUser()
    );

    assertEquals(
            FamilyRole.CHILD,
            result.getRequestedRole()
    );

    assertEquals(
            FamilyJoinRequestStatus.PENDING,
            result.getStatus()
    );

    verify(familyRepository)
            .findByJoinCode(
                    "ABC12345"
            );

    verify(familyJoinRequestRepository)
            .save(
                    result
            );
}

@Test
void requestToJoinFamily_shouldRejectDuplicatePendingRequest() {

    User child =
            mock(User.class);

    Family family =
            mock(Family.class);

    FamilyJoinRequest existingRequest =
            mock(FamilyJoinRequest.class);

    when(familyMemberRepository
            .existsByUser(child))
            .thenReturn(false);

    when(familyRepository
            .findByJoinCode("ABC12345"))
            .thenReturn(
                    Optional.of(family)
            );

    when(familyJoinRequestRepository
            .findByFamilyAndRequestedByUserAndStatus(
                    family,
                    child,
                    FamilyJoinRequestStatus.PENDING
            ))
            .thenReturn(
                    Optional.of(existingRequest)
            );

    IllegalArgumentException exception =
            assertThrows(
                    IllegalArgumentException.class,
                    () ->
                            familyService.requestToJoinFamily(
                                    child,
                                    "abc12345"
                            )
            );

    assertEquals(
            "You already have a pending request for this family.",
            exception.getMessage()
    );

    verify(
            familyJoinRequestRepository,
            never()
    ).save(
            any(FamilyJoinRequest.class)
    );
}

@Test
void approveJoinRequest_shouldCreateFamilyMemberAndApproveRequest() {

    UUID requestId =
            UUID.randomUUID();

    UUID familyId =
            UUID.randomUUID();

    User parent =
            mock(User.class);

    User child =
            mock(User.class);

    Family family =
            mock(Family.class);

    when(family.getId())
            .thenReturn(familyId);

    FamilyMember parentMembership =
            new FamilyMember();

    parentMembership.setFamily(family);
    parentMembership.setUser(parent);
    parentMembership.setRole(
            FamilyRole.PARENT
    );

    FamilyJoinRequest joinRequest =
            new FamilyJoinRequest();

    joinRequest.setFamily(family);
    joinRequest.setRequestedByUser(child);
    joinRequest.setRequestedRole(
            FamilyRole.CHILD
    );

    joinRequest.setStatus(
            FamilyJoinRequestStatus.PENDING
    );

    when(familyJoinRequestRepository
            .findById(requestId))
            .thenReturn(
                    Optional.of(joinRequest)
            );

    when(familyMemberRepository
            .findByUser(parent))
            .thenReturn(
                    Optional.of(parentMembership)
            );

    when(familyMemberRepository
            .existsByUser(child))
            .thenReturn(false);

    when(familyMemberRepository
            .save(any(FamilyMember.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    when(familyJoinRequestRepository
            .save(any(FamilyJoinRequest.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    FamilyMember result =
            familyService.approveJoinRequest(
                    parent,
                    requestId
            );

    /*
     * Child was added to the family.
     */
    assertSame(
            family,
            result.getFamily()
    );

    assertSame(
            child,
            result.getUser()
    );

    assertEquals(
            FamilyRole.CHILD,
            result.getRole()
    );

    /*
     * Join request was approved.
     */
    assertEquals(
            FamilyJoinRequestStatus.APPROVED,
            joinRequest.getStatus()
    );

    assertSame(
            parent,
            joinRequest.getReviewedByUser()
    );

    assertNotNull(
            joinRequest.getReviewedAt()
    );

    verify(familyMemberRepository)
            .save(
                    any(FamilyMember.class)
            );

    verify(familyJoinRequestRepository)
            .save(
                    joinRequest
            );
}

@Test
void approveJoinRequest_shouldRejectWhenReviewerIsChild() {

    UUID requestId =
            UUID.randomUUID();

    UUID familyId =
            UUID.randomUUID();

    User childReviewer =
            mock(User.class);

    User joiningChild =
            mock(User.class);

    Family family =
            mock(Family.class);

    when(family.getId())
            .thenReturn(familyId);

    FamilyMember childMembership =
            new FamilyMember();

    childMembership.setFamily(family);
    childMembership.setUser(childReviewer);
    childMembership.setRole(
            FamilyRole.CHILD
    );

    FamilyJoinRequest joinRequest =
            new FamilyJoinRequest();

    joinRequest.setFamily(family);
    joinRequest.setRequestedByUser(
            joiningChild
    );

    joinRequest.setRequestedRole(
            FamilyRole.CHILD
    );

    joinRequest.setStatus(
            FamilyJoinRequestStatus.PENDING
    );

    when(familyJoinRequestRepository
            .findById(requestId))
            .thenReturn(
                    Optional.of(joinRequest)
            );

    when(familyMemberRepository
            .findByUser(childReviewer))
            .thenReturn(
                    Optional.of(childMembership)
            );

    ForbiddenException exception =
            assertThrows(
                    ForbiddenException.class,
                    () ->
                            familyService.approveJoinRequest(
                                    childReviewer,
                                    requestId
                            )
            );

    assertEquals(
            "Children cannot approve join requests.",
            exception.getMessage()
    );

    verify(
            familyMemberRepository,
            never()
    ).save(
            any(FamilyMember.class)
    );

    verify(
            familyJoinRequestRepository,
            never()
    ).save(
            any(FamilyJoinRequest.class)
    );
}

@Test
void cancelJoinRequest_shouldCancelOwnPendingRequest() {

    UUID requestId =
            UUID.randomUUID();

    UUID userId =
            UUID.randomUUID();

    User child =
            mock(User.class);

    when(child.getId())
            .thenReturn(userId);

    FamilyJoinRequest joinRequest =
            mock(FamilyJoinRequest.class);

    when(joinRequest
            .getRequestedByUser())
            .thenReturn(child);

    when(joinRequest.getStatus())
            .thenReturn(
                    FamilyJoinRequestStatus.PENDING
            );

    when(familyJoinRequestRepository
            .findById(requestId))
            .thenReturn(
                    Optional.of(joinRequest)
            );

    when(familyJoinRequestRepository
            .save(joinRequest))
            .thenReturn(joinRequest);

    FamilyJoinRequest result =
            familyService.cancelJoinRequest(
                    child,
                    requestId
            );

    assertSame(
            joinRequest,
            result
    );

    verify(joinRequest)
            .setStatus(
                    FamilyJoinRequestStatus.CANCELLED
            );

    verify(familyJoinRequestRepository)
            .save(joinRequest);
}

@Test
void cancelJoinRequest_shouldRejectWhenRequestBelongsToAnotherUser() {

    UUID requestId =
            UUID.randomUUID();

    UUID currentUserId =
            UUID.randomUUID();

    UUID requestOwnerId =
            UUID.randomUUID();

    User currentUser =
            mock(User.class);

    User requestOwner =
            mock(User.class);

    when(currentUser.getId())
            .thenReturn(currentUserId);

    when(requestOwner.getId())
            .thenReturn(requestOwnerId);

    FamilyJoinRequest joinRequest =
            mock(FamilyJoinRequest.class);

    when(joinRequest
            .getRequestedByUser())
            .thenReturn(requestOwner);

    when(familyJoinRequestRepository
            .findById(requestId))
            .thenReturn(
                    Optional.of(joinRequest)
            );

    ForbiddenException exception =
            assertThrows(
                    ForbiddenException.class,
                    () ->
                            familyService.cancelJoinRequest(
                                    currentUser,
                                    requestId
                            )
            );

    assertEquals(
            "You can only cancel your own join request.",
            exception.getMessage()
    );

    verify(
            familyJoinRequestRepository,
            never()
    ).save(
            any(FamilyJoinRequest.class)
    );
}

@Test
void rejectJoinRequest_shouldRejectPendingRequest() {

    UUID requestId =
            UUID.randomUUID();

    UUID familyId =
            UUID.randomUUID();

    User parent =
            mock(User.class);

    User joiningChild =
            mock(User.class);

    Family family =
            mock(Family.class);

    when(family.getId())
            .thenReturn(familyId);

    FamilyMember parentMembership =
            new FamilyMember();

    parentMembership.setFamily(family);
    parentMembership.setUser(parent);
    parentMembership.setRole(
            FamilyRole.PARENT
    );

    FamilyJoinRequest joinRequest =
            new FamilyJoinRequest();

    joinRequest.setFamily(family);
    joinRequest.setRequestedByUser(
            joiningChild
    );

    joinRequest.setRequestedRole(
            FamilyRole.CHILD
    );

    joinRequest.setStatus(
            FamilyJoinRequestStatus.PENDING
    );

    when(familyJoinRequestRepository
            .findById(requestId))
            .thenReturn(
                    Optional.of(joinRequest)
            );

    when(familyMemberRepository
            .findByUser(parent))
            .thenReturn(
                    Optional.of(parentMembership)
            );

    when(familyJoinRequestRepository
            .save(joinRequest))
            .thenReturn(joinRequest);

    FamilyJoinRequest result =
            familyService.rejectJoinRequest(
                    parent,
                    requestId
            );

    assertSame(
            joinRequest,
            result
    );

    assertEquals(
            FamilyJoinRequestStatus.REJECTED,
            result.getStatus()
    );

    assertSame(
            parent,
            result.getReviewedByUser()
    );

    assertNotNull(
            result.getReviewedAt()
    );

    verify(familyJoinRequestRepository)
            .save(joinRequest);

    verify(
            familyMemberRepository,
            never()
    ).save(
            any(FamilyMember.class)
    );
}

}