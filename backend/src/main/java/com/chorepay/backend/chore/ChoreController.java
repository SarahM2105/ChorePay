package com.chorepay.backend.chore;

import com.chorepay.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/chore-templates")
public class ChoreController {

    private final ChoreService choreService;

    public ChoreController(ChoreService choreService) {
        this.choreService = choreService;
    }

    @PostMapping
    public ResponseEntity<ChoreTemplateResponse> createTemplate(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateChoreTemplateRequest request
    ) {
        ChoreTemplate template =
                choreService.createTemplate(user, request);

        ChoreTemplateResponse response =
                toResponse(template);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<ChoreTemplateResponse>> getTemplates(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                choreService.getTemplates(user)
        );
    }

    @PutMapping("/{templateId}")
public ResponseEntity<ChoreTemplateResponse> updateTemplate(
        @AuthenticationPrincipal User user,
        @PathVariable java.util.UUID templateId,
        @Valid @RequestBody UpdateChoreTemplateRequest request
) {
    ChoreTemplate template =
            choreService.updateTemplate(
                    user,
                    templateId,
                    request
            );

    return ResponseEntity.ok(
            toResponse(template)
    );
}

@DeleteMapping("/{templateId}")
public ResponseEntity<Void> deactivateTemplate(
        @AuthenticationPrincipal User user,
        @PathVariable java.util.UUID templateId
) {
    choreService.deactivateTemplate(
            user,
            templateId
    );

    return ResponseEntity.noContent().build();
}


@PostMapping("/assign")
public ResponseEntity<ChoreAssignmentResponse> assignChore(
        @AuthenticationPrincipal User user,
        @Valid @RequestBody AssignChoreRequest request
) {
    ChoreAssignment assignment =
            choreService.assignChore(user, request);

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(
                    choreService.toAssignmentResponse(
                            assignment
                    )
            );
}

@GetMapping("/my-assignments")
public ResponseEntity<List<ChoreAssignmentResponse>> getMyAssignments(
        @AuthenticationPrincipal User user
) {
    return ResponseEntity.ok(
            choreService.getMyAssignments(user)
    );
}

@PostMapping("/assignments/{assignmentId}/submit")
public ResponseEntity<ChoreSubmissionResponse> submitChore(
        @AuthenticationPrincipal User user,
        @PathVariable UUID assignmentId,
        @Valid @RequestBody SubmitChoreRequest request
) {
    ChoreSubmission submission =
            choreService.submitChore(
                    user,
                    assignmentId,
                    request
            );

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(
                    choreService.toSubmissionResponse(
                            submission
                    )
            );
}

@PostMapping("/submissions/{submissionId}/approve")
public ResponseEntity<ChoreSubmissionResponse> approveSubmission(
        @AuthenticationPrincipal User user,
        @PathVariable UUID submissionId
) {
    ChoreSubmission submission =
            choreService.approveSubmission(
                    user,
                    submissionId
            );

    return ResponseEntity.ok(
            choreService.toSubmissionResponse(submission)
    );
}

@PostMapping("/submissions/{submissionId}/reject")
public ResponseEntity<ChoreSubmissionResponse> rejectSubmission(
        @AuthenticationPrincipal User user,
        @PathVariable UUID submissionId,
        @Valid @RequestBody RejectChoreSubmissionRequest request
) {
    ChoreSubmission submission =
            choreService.rejectSubmission(
                    user,
                    submissionId,
                    request
            );

    return ResponseEntity.ok(
            choreService.toSubmissionResponse(submission)
    );
}

    private ChoreTemplateResponse toResponse(
            ChoreTemplate template
    ) {
        return new ChoreTemplateResponse(
                template.getId(),
                template.getTitle(),
                template.getDescription(),
                template.getCategory(),
                template.getDifficulty(),
                template.getEstimatedMinutes(),
                template.getCoinReward(),
                template.getXpReward(),
                template.getMoneyRewardPence(),
                template.getLatePenaltyPercent(),
                template.getResubmissionPenaltyPercent(),
                template.isPhotoRequired(),
                template.isCommentRequired(),
                template.isActive()
        );
    }
}