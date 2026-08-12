// JoinRequestResponse.java
package com.chorepay.backend.family;

import java.time.Instant;
import java.util.UUID;

public record JoinRequestResponse(
        UUID requestId,
        UUID userId,
        String name,
        FamilyRole requestedRole,
        FamilyJoinRequestStatus status,
        Instant requestedAt
) {
}