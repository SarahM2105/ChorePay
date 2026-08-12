package com.chorepay.backend.chore;

import com.chorepay.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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