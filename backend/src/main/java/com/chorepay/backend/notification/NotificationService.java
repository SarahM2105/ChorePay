package com.chorepay.backend.notification;

import com.chorepay.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository
    ) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(
            User user,
            NotificationType type,
            String title,
            String message,
            UUID referenceId
    ) {

        Notification notification =
                new Notification();

        notification.setUser(user);
        notification.setNotificationType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setReferenceId(referenceId);

        return notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications(
            User user,
            boolean unreadOnly
    ) {

        List<Notification> notifications;

        if (unreadOnly) {

            notifications =
                    notificationRepository
                            .findByUserAndReadAtIsNullOrderByCreatedAtDesc(
                                    user
                            );

        } else {

            notifications =
                    notificationRepository
                            .findByUserOrderByCreatedAtDesc(
                                    user
                            );
        }

        return notifications
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public long getUnreadCount(
            User user
    ) {
        return notificationRepository
                .countByUserAndReadAtIsNull(user);
    }

    @Transactional
    public NotificationResponse markAsRead(
            User user,
            UUID notificationId
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Notification not found."
                                )
                        );

        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You cannot modify another user's notification."
            );
        }

        if (!notification.isRead()) {
            notification.setReadAt(
                    Instant.now()
            );

            notificationRepository.save(
                    notification
            );
        }

        return toResponse(notification);
    }

    @Transactional
    public void markAllAsRead(
            User user
    ) {

        List<Notification> unreadNotifications =
                notificationRepository
                        .findByUserAndReadAtIsNullOrderByCreatedAtDesc(
                                user
                        );

        Instant now = Instant.now();

        for (Notification notification
                : unreadNotifications) {

            notification.setReadAt(now);
        }

        notificationRepository.saveAll(
                unreadNotifications
        );
    }

    public NotificationResponse toResponse(
            Notification notification
    ) {

        return new NotificationResponse(
                notification.getId(),
                notification.getNotificationType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getReferenceId(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}