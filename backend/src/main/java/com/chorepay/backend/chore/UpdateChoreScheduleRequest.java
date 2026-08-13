package com.chorepay.backend.chore;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record UpdateChoreScheduleRequest(

        @NotNull
        ChoreScheduleType scheduleType,

        @NotEmpty
        List<UUID> childUserIds,

        @NotNull
        LocalDate startDate,

        LocalDate endDate,

        LocalTime dueTime,

        List<DayOfWeekValue> daysOfWeek

) {
}