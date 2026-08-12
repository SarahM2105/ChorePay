package com.chorepay.backend.reward;

import com.chorepay.backend.chore.ChoreSubmission;
import com.chorepay.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RewardTransactionRepository
        extends JpaRepository<RewardTransaction, UUID> {

    boolean existsByChoreSubmissionAndChildUser(
            ChoreSubmission submission,
            User childUser
    );

    List<RewardTransaction> findByChildUserOrderByCreatedAtDesc(
            User childUser
    );
}