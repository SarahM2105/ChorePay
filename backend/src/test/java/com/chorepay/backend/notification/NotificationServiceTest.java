package com.chorepay.backend.notification;

import com.chorepay.backend.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import java.util.UUID;
import static org.mockito.Mockito.mock;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void createNotification_shouldSaveNotification() {

        User user = new User();
        user.setName("Test Child");

        UUID referenceId =
                UUID.randomUUID();

        when(notificationRepository.save(
                any(Notification.class)
        )).thenAnswer(invocation ->
                invocation.getArgument(0)
        );

        Notification result =
                notificationService.createNotification(
                        user,
                        NotificationType.CHORE_ASSIGNED,
                        "New chore",
                        "You have a new chore.",
                        referenceId
                );

        assertEquals(
                user,
                result.getUser()
        );

        assertEquals(
                NotificationType.CHORE_ASSIGNED,
                result.getNotificationType()
        );

        assertEquals(
                "New chore",
                result.getTitle()
        );

        assertEquals(
                "You have a new chore.",
                result.getMessage()
        );

        assertEquals(
                referenceId,
                result.getReferenceId()
        );

        verify(notificationRepository)
                .save(any(Notification.class));
    }

    @Test
    void getUnreadCount_shouldReturnRepositoryCount() {

        User user = new User();

        when(notificationRepository
                .countByUserAndReadAtIsNull(user))
                .thenReturn(3L);

        long result =
                notificationService.getUnreadCount(
                        user
                );

        assertEquals(
                3L,
                result
        );

        verify(notificationRepository)
                .countByUserAndReadAtIsNull(user);
    }

@Test
void markAsRead_shouldMarkNotificationAsRead() {

    UUID userId =
            UUID.randomUUID();

    User user =
            mock(User.class);

    when(user.getId())
            .thenReturn(userId);

    UUID notificationId =
            UUID.randomUUID();

    Notification notification =
            new Notification();

    notification.setUser(user);
    notification.setNotificationType(
            NotificationType.CHORE_ASSIGNED
    );
    notification.setTitle(
            "New chore"
    );
    notification.setMessage(
            "You have a new chore."
    );

    when(notificationRepository
            .findById(notificationId))
            .thenReturn(
                    java.util.Optional.of(notification)
            );

    when(notificationRepository
            .save(any(Notification.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    NotificationResponse result =
            notificationService.markAsRead(
                    user,
                    notificationId
            );

    assertNotNull(
            notification.getReadAt()
    );

    assertEquals(
            true,
            result.read()
    );

    verify(notificationRepository)
            .save(notification);
}


@Test
void markAsRead_shouldRejectAnotherUsersNotification() {

    User owner =
            mock(User.class);

    User otherUser =
            mock(User.class);

    when(owner.getId())
            .thenReturn(
                    UUID.randomUUID()
            );

    when(otherUser.getId())
            .thenReturn(
                    UUID.randomUUID()
            );

    UUID notificationId =
            UUID.randomUUID();

    Notification notification =
            new Notification();

    notification.setUser(owner);

    when(notificationRepository
            .findById(notificationId))
            .thenReturn(
                    java.util.Optional.of(notification)
            );

    assertThrows(
            IllegalArgumentException.class,
            () ->
                    notificationService.markAsRead(
                            otherUser,
                            notificationId
                    )
    );
}

}