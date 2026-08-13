package com.chorepay.backend.chore;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record ChoreScheduleResponse(

        UUID id,

        UUID templateId,

        String choreTitle,

        ChoreScheduleType scheduleType,

        LocalDate startDate,

        LocalDate endDate,

        LocalTime dueTime,

        List<DayOfWeekValue> daysOfWeek,

        List<ChoreScheduleParticipantResponse> participants,

        boolean active

) {
}