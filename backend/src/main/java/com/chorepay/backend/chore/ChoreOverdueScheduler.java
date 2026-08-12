package com.chorepay.backend.chore;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ChoreOverdueScheduler {

    private final ChoreService choreService;

    public ChoreOverdueScheduler(
            ChoreService choreService
    ) {
        this.choreService = choreService;
    }

    @Scheduled(fixedRate = 60000)
    public void updateOverdueChores() {

        choreService.markOverdueAssignments();
    }
}