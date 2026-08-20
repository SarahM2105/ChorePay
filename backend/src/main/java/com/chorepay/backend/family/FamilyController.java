package com.chorepay.backend.family;

import com.chorepay.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/families")
public class FamilyController {

    private final FamilyService familyService;

    public FamilyController(FamilyService familyService) {
        this.familyService = familyService;
    }

    @GetMapping("/me")
public ResponseEntity<FamilyResponse> getMyFamily(
        @AuthenticationPrincipal User user
) {
    FamilyMember membership = familyService.getMembership(user);

    Family family = membership.getFamily();

    return ResponseEntity.ok(
            new FamilyResponse(
                    family.getId(),
                    family.getName(),
                    family.getJoinCode()
            )
    );
}

@GetMapping("/members")
public ResponseEntity<java.util.List<FamilyMemberResponse>> getMembers(
        @AuthenticationPrincipal User user
) {
    return ResponseEntity.ok(
            familyService.getFamilyMembers(user)
    );
}

@GetMapping("/join-requests")
public ResponseEntity<java.util.List<JoinRequestResponse>> getJoinRequests(
        @AuthenticationPrincipal User user
) {
    return ResponseEntity.ok(
            familyService.getPendingJoinRequests(user)
    );
}

    @PostMapping
    public ResponseEntity<FamilyResponse> createFamily(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateFamilyRequest request
    ) {
        Family family = familyService.createFamily(
                user,
                request.name()
        );

        FamilyResponse response = new FamilyResponse(
                family.getId(),
                family.getName(),
                family.getJoinCode()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

@GetMapping("/join-request/me")
public ResponseEntity<JoinRequestResponse> getMyLatestJoinRequest(
        @AuthenticationPrincipal User user
) {
    return familyService
            .getMyLatestJoinRequest(user)
            .map(ResponseEntity::ok)
            .orElseGet(() ->
                    ResponseEntity.noContent().build()
            );
}

    @PostMapping("/join")
    public ResponseEntity<Void> requestToJoinFamily(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody JoinFamilyRequest request
    ) {
        familyService.requestToJoinFamily(
                user,
                request.joinCode()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @PostMapping("/join-requests/{requestId}/approve")
    public ResponseEntity<Void> approveJoinRequest(
            @AuthenticationPrincipal User user,
            @PathVariable UUID requestId
    ) {
        familyService.approveJoinRequest(
                user,
                requestId
        );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/join-requests/{requestId}/reject")
    public ResponseEntity<Void> rejectJoinRequest(
            @AuthenticationPrincipal User user,
            @PathVariable UUID requestId
    ) {
        familyService.rejectJoinRequest(
                user,
                requestId
        );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/join-requests/{requestId}/cancel")
    public ResponseEntity<Void> cancelJoinRequest(
            @AuthenticationPrincipal User user,
            @PathVariable UUID requestId
    ) {
        familyService.cancelJoinRequest(
                user,
                requestId
        );

        return ResponseEntity.ok().build();
    }
}