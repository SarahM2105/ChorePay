// FamilyMemberResponse.java
package com.chorepay.backend.family;

import java.time.Instant;
import java.util.UUID;

public record FamilyMemberResponse(
        UUID userId,
        String name,
        FamilyRole role,
        Instant joinedAt
) {
}