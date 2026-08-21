package com.chorepay.backend.family;

import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.chorepay.backend.user.UserType;
import java.util.UUID;
import com.chorepay.backend.exception.ForbiddenException;
import com.chorepay.backend.exception.NotFoundException;
import java.util.Optional;

import java.security.SecureRandom;

@Service
public class FamilyService {

    private final FamilyRepository familyRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final FamilyJoinRequestRepository familyJoinRequestRepository;
    private final UserRepository userRepository;

    private static final String CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 8;
    private final SecureRandom random = new SecureRandom();

    public FamilyService(
            FamilyRepository familyRepository,
            FamilyMemberRepository familyMemberRepository,
            FamilyJoinRequestRepository familyJoinRequestRepository,
            UserRepository userRepository
    ) {
        this.familyRepository = familyRepository;
        this.familyMemberRepository = familyMemberRepository;
        this.familyJoinRequestRepository = familyJoinRequestRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Family createFamily(User creator, String familyName) {

        if (creator.getUserType() != UserType.PARENT) {
            throw new IllegalArgumentException("Only parents can create a family.");
        }

        if (familyMemberRepository.existsByUser(creator)) {
            throw new IllegalArgumentException("User already belongs to a family.");
        }

        Family family = new Family();
        family.setName(familyName);
        family.setJoinCode(generateUniqueJoinCode());

        Family savedFamily = familyRepository.save(family);

        FamilyMember ownerMembership = new FamilyMember();
        ownerMembership.setFamily(savedFamily);
        ownerMembership.setUser(creator);
        ownerMembership.setRole(FamilyRole.OWNER);

        familyMemberRepository.save(ownerMembership);

        return savedFamily;
    }


    @Transactional
public FamilyJoinRequest requestToJoinFamily(
        User user,
        String joinCode
) {
    if (familyMemberRepository.existsByUser(user)) {
        throw new IllegalArgumentException(
                "User already belongs to a family."
        );
    }

    Family family = familyRepository.findByJoinCode(
            joinCode.toUpperCase()
    ).orElseThrow(() ->
            new IllegalArgumentException("Invalid family join code.")
    );

    boolean alreadyPending =
            familyJoinRequestRepository
                    .findByFamilyAndRequestedByUserAndStatus(
                            family,
                            user,
                            FamilyJoinRequestStatus.PENDING
                    )
                    .isPresent();

    if (alreadyPending) {
        throw new IllegalArgumentException(
                "You already have a pending request for this family."
        );
    }

    FamilyJoinRequest request = new FamilyJoinRequest();

    request.setFamily(family);
    request.setRequestedByUser(user);

    if (user.getUserType() == com.chorepay.backend.user.UserType.PARENT) {
        request.setRequestedRole(FamilyRole.PARENT);
    } else {
        request.setRequestedRole(FamilyRole.CHILD);
    }

    request.setStatus(FamilyJoinRequestStatus.PENDING);

    return familyJoinRequestRepository.save(request);
}

@Transactional
public FamilyMember approveJoinRequest(
        User reviewer,
        UUID requestId
) {

    FamilyJoinRequest request =
            familyJoinRequestRepository.findById(requestId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Join request not found."
                            )
                    );

    if (request.getStatus() != FamilyJoinRequestStatus.PENDING) {
        throw new IllegalArgumentException(
                "Only pending requests can be approved."
        );
    }

    FamilyMember reviewerMembership =
            familyMemberRepository.findByUser(reviewer)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Reviewer does not belong to a family."
                            )
                    );

    /*
     * The reviewer must belong to the
     * same family as the join request.
     */
    if (!reviewerMembership
            .getFamily()
            .getId()
            .equals(request.getFamily().getId())) {

        throw new ForbiddenException(
                "You cannot review requests for another family."
        );
    }

    /*
     * Children cannot approve anyone.
     */
    if (reviewerMembership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot approve join requests."
        );
    }

    /*
     * Only the OWNER can add another PARENT.
     *
     * A normal parent can still approve a
     * child joining the family.
     */
    if (request.getRequestedRole() == FamilyRole.PARENT
            && reviewerMembership.getRole() != FamilyRole.OWNER) {

        throw new ForbiddenException(
                "Only the family owner can approve a parent."
        );
    }

    User joiningUser =
            request.getRequestedByUser();

    if (familyMemberRepository.existsByUser(joiningUser)) {
        throw new ForbiddenException(
                "User already belongs to a family."
        );
    }

    FamilyMember newMember =
            new FamilyMember();

    newMember.setFamily(
            request.getFamily()
    );

    newMember.setUser(
            joiningUser
    );

    newMember.setRole(
            request.getRequestedRole()
    );

    FamilyMember savedMember =
            familyMemberRepository.save(
                    newMember
            );

    request.setStatus(
            FamilyJoinRequestStatus.APPROVED
    );

    request.setReviewedByUser(
            reviewer
    );

    request.setReviewedAt(
            java.time.Instant.now()
    );

    familyJoinRequestRepository.save(
            request
    );

    return savedMember;
}

@Transactional
public FamilyJoinRequest rejectJoinRequest(
        User reviewer,
        UUID requestId
) {

    FamilyJoinRequest request =
            familyJoinRequestRepository.findById(requestId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Join request not found."
                            )
                    );

    if (request.getStatus() != FamilyJoinRequestStatus.PENDING) {
        throw new ForbiddenException(
                "Only pending requests can be rejected."
        );
    }

    FamilyMember reviewerMembership =
            familyMemberRepository.findByUser(reviewer)
                    .orElseThrow(() ->
                            new ForbiddenException(
                                    "Reviewer does not belong to a family."
                            )
                    );

    /*
     * Reviewer must belong to the same family.
     */
    if (!reviewerMembership
            .getFamily()
            .getId()
            .equals(request.getFamily().getId())) {

        throw new ForbiddenException(
                "You cannot review requests for another family."
        );
    }

    /*
     * Children cannot reject requests.
     */
    if (reviewerMembership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot reject join requests."
        );
    }

    /*
     * Only the owner can reject somebody
     * asking to join as another parent.
     */
    if (request.getRequestedRole() == FamilyRole.PARENT
            && reviewerMembership.getRole() != FamilyRole.OWNER) {

        throw new ForbiddenException(
                "Only the family owner can reject a parent request."
        );
    }

    request.setStatus(
            FamilyJoinRequestStatus.REJECTED
    );

    request.setReviewedByUser(
            reviewer
    );

    request.setReviewedAt(
            java.time.Instant.now()
    );

    return familyJoinRequestRepository.save(
            request
    );
}


public FamilyMember getMembership(User user) {
    return familyMemberRepository.findByUser(user)
            .orElseThrow(() ->
                    new NotFoundException(
                            "User does not belong to a family."
                    )
            );
}

public java.util.List<FamilyMemberResponse> getFamilyMembers(User user) {

    FamilyMember membership = getMembership(user);

    return familyMemberRepository
            .findByFamily(membership.getFamily())
            .stream()
            .map(member -> new FamilyMemberResponse(
                    member.getUser().getId(),
                    member.getUser().getName(),
                    member.getRole(),
                    member.getJoinedAt()
            ))
            .toList();
}

public java.util.List<JoinRequestResponse> getPendingJoinRequests(
        User user
) {
    FamilyMember membership = getMembership(user);

    if (membership.getRole() == FamilyRole.CHILD) {
        throw new ForbiddenException(
                "Children cannot view join requests."
        );
    }

    return familyJoinRequestRepository
            .findByFamilyAndStatus(
                    membership.getFamily(),
                    FamilyJoinRequestStatus.PENDING
            )
            .stream()
            .map(request -> new JoinRequestResponse(
                    request.getId(),
                    request.getRequestedByUser().getId(),
                    request.getRequestedByUser().getName(),
                    request.getRequestedRole(),
                    request.getStatus(),
                    request.getRequestedAt()
            ))
            .toList();
}

public Optional<JoinRequestResponse> getMyLatestJoinRequest(
        User user
) {
    return familyJoinRequestRepository
            .findFirstByRequestedByUserOrderByRequestedAtDesc(user)
            .map(request -> new JoinRequestResponse(
                    request.getId(),
                    request.getRequestedByUser().getId(),
                    request.getRequestedByUser().getName(),
                    request.getRequestedRole(),
                    request.getStatus(),
                    request.getRequestedAt()
            ));
}

@Transactional
public FamilyJoinRequest cancelJoinRequest(
        User user,
        UUID requestId
) {
    FamilyJoinRequest request =
            familyJoinRequestRepository.findById(requestId)
                    .orElseThrow(() ->
                            new NotFoundException(
                                    "Join request not found."
                            )
                    );

    if (!request.getRequestedByUser().getId().equals(user.getId())) {
        throw new ForbiddenException(
                "You can only cancel your own join request."
        );
    }

    if (request.getStatus() != FamilyJoinRequestStatus.PENDING) {
        throw new IllegalArgumentException(
                "Only pending requests can be cancelled."
        );
    }

    request.setStatus(FamilyJoinRequestStatus.CANCELLED);

    return familyJoinRequestRepository.save(request);
}
    private String generateUniqueJoinCode() {

        String code;

        do {
            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < CODE_LENGTH; i++) {
                int index = random.nextInt(CODE_CHARACTERS.length());
                builder.append(CODE_CHARACTERS.charAt(index));
            }

            code = builder.toString();

        } while (familyRepository.existsByJoinCode(code));

        return code;
    }
}