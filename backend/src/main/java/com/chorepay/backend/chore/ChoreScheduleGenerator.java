package com.chorepay.backend.chore;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ChoreScheduleGenerator {

    private final ChoreScheduleService choreScheduleService;

    public ChoreScheduleGenerator(
            ChoreScheduleService choreScheduleService
    ) {
        this.choreScheduleService =
                choreScheduleService;
    }

    @Scheduled(fixedRate = 300000)
    public void generateAssignments() {

        choreScheduleService
                .generateScheduledAssignments();
    }
}