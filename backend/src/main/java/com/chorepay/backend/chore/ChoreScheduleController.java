package com.chorepay.backend.chore;

import com.chorepay.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chore-schedules")
public class ChoreScheduleController {

    private final ChoreScheduleService choreScheduleService;

    public ChoreScheduleController(
            ChoreScheduleService choreScheduleService
    ) {
        this.choreScheduleService =
                choreScheduleService;
    }

    @PostMapping
    public ResponseEntity<ChoreScheduleResponse> createSchedule(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateChoreScheduleRequest request
    ) {

        ChoreSchedule schedule =
                choreScheduleService.createSchedule(
                        user,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        choreScheduleService.toResponse(
                                schedule
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<ChoreScheduleResponse>>
    getSchedules(
            @AuthenticationPrincipal User user
    ) {

        return ResponseEntity.ok(
                choreScheduleService
                        .getFamilySchedules(user)
        );
    }

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deactivateSchedule(
            @AuthenticationPrincipal User user,
            @PathVariable UUID scheduleId
    ) {

        choreScheduleService.deactivateSchedule(
                user,
                scheduleId
        );

        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{scheduleId}")
public ResponseEntity<ChoreScheduleResponse> updateSchedule(
        @AuthenticationPrincipal User user,
        @PathVariable UUID scheduleId,
        @Valid @RequestBody UpdateChoreScheduleRequest request
) {

    ChoreSchedule schedule =
            choreScheduleService.updateSchedule(
                    user,
                    scheduleId,
                    request
            );

    return ResponseEntity.ok(
            choreScheduleService.toResponse(
                    schedule
            )
    );
}


}