package com.chorepay.backend.chore;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UpdateChoreChecklistRequest(

        @NotNull
        @Size(max = 30)
        List<@Valid ChecklistItemRequest> items

) {
}