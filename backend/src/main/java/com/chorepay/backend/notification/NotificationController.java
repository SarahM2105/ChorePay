package com.chorepay.backend.notification;

import com.chorepay.backend.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService =
                notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
    getNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(
                    defaultValue = "false"
            )
            boolean unreadOnly
    ) {

        return ResponseEntity.ok(
                notificationService
                        .getMyNotifications(
                                user,
                                unreadOnly
                        )
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<UnreadNotificationCountResponse>
    getUnreadCount(
            @AuthenticationPrincipal User user
    ) {

        long count =
                notificationService
                        .getUnreadCount(user);

        return ResponseEntity.ok(
                new UnreadNotificationCountResponse(
                        count
                )
        );
    }

    @PostMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse>
    markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable UUID notificationId
    ) {

        return ResponseEntity.ok(
                notificationService.markAsRead(
                        user,
                        notificationId
                )
        );
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal User user
    ) {

        notificationService.markAllAsRead(
                user
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}