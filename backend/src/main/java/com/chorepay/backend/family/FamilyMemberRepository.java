package com.chorepay.backend.family;

import com.chorepay.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, UUID> {

    Optional<FamilyMember> findByUser(User user);

    List<FamilyMember> findByFamily(Family family);

    boolean existsByUser(User user);

}