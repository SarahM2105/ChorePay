package com.chorepay.backend.reward;

import com.chorepay.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    private final RewardService rewardService;

    public RewardController(
            RewardService rewardService
    ) {
        this.rewardService = rewardService;
    }

    @PostMapping
    public ResponseEntity<RewardResponse> createReward(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateRewardRequest request
    ) {

        Reward reward =
                rewardService.createReward(
                        user,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        rewardService.toResponse(reward)
                );
    }

    @GetMapping
    public ResponseEntity<List<RewardResponse>> getRewards(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                rewardService.getRewards(user)
        );
    }

    @PostMapping("/redeem")
public ResponseEntity<RewardRedemptionResponse> redeemReward(
        @AuthenticationPrincipal User user,
        @Valid @RequestBody RedeemRewardRequest request
) {

    RewardRedemption redemption =
            rewardService.redeemReward(
                    user,
                    request
            );

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(
                    rewardService.toRedemptionResponse(
                            redemption
                    )
            );
}

@GetMapping("/my-redemptions")
public ResponseEntity<List<RewardRedemptionResponse>> getMyRedemptions(
        @AuthenticationPrincipal User user
) {
    return ResponseEntity.ok(
            rewardService.getMyRedemptions(user)
    );
}

@GetMapping("/redemptions/pending")
public ResponseEntity<List<RewardRedemptionResponse>> getPendingRedemptions(
        @AuthenticationPrincipal User user
) {
    return ResponseEntity.ok(
            rewardService.getPendingRedemptions(user)
    );
}

@PostMapping("/redemptions/{redemptionId}/approve")
public ResponseEntity<RewardRedemptionResponse> approveRedemption(
        @AuthenticationPrincipal User user,
        @PathVariable UUID redemptionId
) {

    RewardRedemption redemption =
            rewardService.approveRedemption(
                    user,
                    redemptionId
            );

    return ResponseEntity.ok(
            rewardService.toRedemptionResponse(redemption)
    );
}

@PostMapping("/redemptions/{redemptionId}/cancel")
public ResponseEntity<RewardRedemptionResponse> cancelRedemption(
        @AuthenticationPrincipal User user,
        @PathVariable UUID redemptionId
) {

    RewardRedemption redemption =
            rewardService.cancelRedemption(
                    user,
                    redemptionId
            );

    return ResponseEntity.ok(
            rewardService.toRedemptionResponse(redemption)
    );
}

@PostMapping("/redemptions/{redemptionId}/fulfill")
public ResponseEntity<RewardRedemptionResponse> fulfillRedemption(
        @AuthenticationPrincipal User user,
        @PathVariable UUID redemptionId
) {

    RewardRedemption redemption =
            rewardService.fulfillRedemption(
                    user,
                    redemptionId
            );

    return ResponseEntity.ok(
            rewardService.toRedemptionResponse(redemption)
    );
}

@GetMapping("/transactions/me")
public ResponseEntity<List<RewardTransactionResponse>> getMyTransactions(
        @AuthenticationPrincipal User user
) {
    return ResponseEntity.ok(
            rewardService.getMyTransactions(user)
    );
}

@PutMapping("/{rewardId}")
public ResponseEntity<RewardResponse> updateReward(
        @AuthenticationPrincipal User user,
        @PathVariable UUID rewardId,
        @Valid @RequestBody UpdateRewardRequest request
) {

    Reward reward =
            rewardService.updateReward(
                    user,
                    rewardId,
                    request
            );

    return ResponseEntity.ok(
            rewardService.toResponse(reward)
    );
}

@DeleteMapping("/{rewardId}")
public ResponseEntity<Void> deactivateReward(
        @AuthenticationPrincipal User user,
        @PathVariable UUID rewardId
) {

    rewardService.deactivateReward(
            user,
            rewardId
    );

    return ResponseEntity.noContent().build();
}

@PostMapping("/redemptions/{redemptionId}/reject")
public ResponseEntity<RewardRedemptionResponse> rejectRedemption(
        @AuthenticationPrincipal User user,
        @PathVariable UUID redemptionId,
        @Valid @RequestBody RejectRewardRedemptionRequest request
) {

    RewardRedemption redemption =
            rewardService.rejectRedemption(
                    user,
                    redemptionId,
                    request
            );

    return ResponseEntity.ok(
            rewardService.toRedemptionResponse(redemption)
    );
}


}