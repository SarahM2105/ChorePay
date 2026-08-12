package com.chorepay.backend.family;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FamilyRepository extends JpaRepository<Family, UUID> {

    Optional<Family> findByJoinCode(String joinCode);

    boolean existsByJoinCode(String joinCode);

}