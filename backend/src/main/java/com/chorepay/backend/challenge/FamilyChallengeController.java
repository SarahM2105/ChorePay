package com.chorepay.backend.challenge;

import com.chorepay.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class FamilyChallengeController {

    private final FamilyChallengeService familyChallengeService;

    public FamilyChallengeController(
            FamilyChallengeService familyChallengeService
    ) {
        this.familyChallengeService =
                familyChallengeService;
    }

    @PostMapping
    public ResponseEntity<FamilyChallengeResponse> createChallenge(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateFamilyChallengeRequest request
    ) {

        FamilyChallenge challenge =
                familyChallengeService.createChallenge(
                        user,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        familyChallengeService.toResponse(
                                challenge
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<FamilyChallengeResponse>> getChallenges(
            @AuthenticationPrincipal User user
    ) {

        return ResponseEntity.ok(
                familyChallengeService
                        .getFamilyChallenges(user)
        );
    }
}