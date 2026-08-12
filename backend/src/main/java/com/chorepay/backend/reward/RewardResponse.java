package com.chorepay.backend.reward;

import java.time.Instant;
import java.util.UUID;

public record RewardResponse(
        UUID id,
        String name,
        String description,
        String category,
        Integer coinCost,
        boolean unlimitedStock,
        Integer stockQuantity,
        Integer minimumLevel,
        Instant availableFrom,
        Instant availableUntil,
        RewardFulfillmentType fulfillmentType,
        boolean active
) {
}