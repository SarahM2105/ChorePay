package com.chorepay.backend.progress;

import com.chorepay.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserProgressRepository
        extends JpaRepository<UserProgress, UUID> {

    Optional<UserProgress> findByChildUser(User childUser);
}