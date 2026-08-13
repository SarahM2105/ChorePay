package com.chorepay.backend.notification;

import com.chorepay.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository
        extends JpaRepository<Notification, UUID> {

    List<Notification>
    findByUserOrderByCreatedAtDesc(
            User user
    );

    List<Notification>
    findByUserAndReadAtIsNullOrderByCreatedAtDesc(
            User user
    );

    long countByUserAndReadAtIsNull(
            User user
    );
}