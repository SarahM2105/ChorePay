package com.chorepay.backend.family;

import com.chorepay.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FamilyJoinRequestRepository
        extends JpaRepository<FamilyJoinRequest, UUID> {

    List<FamilyJoinRequest> findByFamilyAndStatus(
            Family family,
            FamilyJoinRequestStatus status
    );

    Optional<FamilyJoinRequest> findByFamilyAndRequestedByUserAndStatus(
            Family family,
            User requestedByUser,
            FamilyJoinRequestStatus status
    );

    Optional<FamilyJoinRequest>
    findFirstByRequestedByUserOrderByRequestedAtDesc(
            User requestedByUser
    );
}