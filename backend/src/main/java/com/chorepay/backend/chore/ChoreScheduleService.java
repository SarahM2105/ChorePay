package com.chorepay.backend.chore;

import com.chorepay.backend.family.FamilyMember;
import com.chorepay.backend.family.FamilyMemberRepository;
import com.chorepay.backend.family.FamilyRole;
import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserRepository;
import com.chorepay.backend.user.UserType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ChoreScheduleService {

    private final ChoreScheduleRepository choreScheduleRepository;
    private final ChoreScheduleDayRepository choreScheduleDayRepository;
    private final ChoreScheduleParticipantRepository
            choreScheduleParticipantRepository;

    private final ChoreTemplateRepository choreTemplateRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final UserRepository userRepository;
    private final ChoreAssignmentRepository choreAssignmentRepository;
private final AssignmentParticipantRepository assignmentParticipantRepository;

    public ChoreScheduleService(
        ChoreScheduleRepository choreScheduleRepository,
        ChoreScheduleDayRepository choreScheduleDayRepository,
        ChoreScheduleParticipantRepository choreScheduleParticipantRepository,
        ChoreTemplateRepository choreTemplateRepository,
        FamilyMemberRepository familyMemberRepository,
        UserRepository userRepository,
        ChoreAssignmentRepository choreAssignmentRepository,
        AssignmentParticipantRepository assignmentParticipantRepository
) {
    this.choreScheduleRepository = choreScheduleRepository;
    this.choreScheduleDayRepository = choreScheduleDayRepository;
    this.choreScheduleParticipantRepository =
            choreScheduleParticipantRepository;
    this.choreTemplateRepository = choreTemplateRepository;
    this.familyMemberRepository = familyMemberRepository;
    this.userRepository = userRepository;
    this.choreAssignmentRepository = choreAssignmentRepository;
    this.assignmentParticipantRepository =
            assignmentParticipantRepository;
}



@Transactional
public void generateScheduledAssignments() {

    LocalDate today =
            LocalDate.now(
                    ZoneId.of("Europe/London")
            );

    List<ChoreSchedule> schedules =
            choreScheduleRepository.findByActiveTrue();

    for (ChoreSchedule schedule : schedules) {

        if (!shouldGenerateToday(schedule, today)) {
            continue;
        }

        boolean alreadyGenerated =
                choreAssignmentRepository
                        .existsByScheduleAndScheduledForDate(
                                schedule,
                                today
                        );

        if (alreadyGenerated) {
            continue;
        }

        List<ChoreScheduleParticipant> scheduleParticipants =
                choreScheduleParticipantRepository
                        .findByChoreSchedule(schedule);

        if (scheduleParticipants.isEmpty()) {
            continue;
        }

        ChoreTemplate template =
                schedule.getChoreTemplate();

        // Don't generate new assignments from an
        // inactive template.
        if (!template.isActive()) {
            continue;
        }

        ChoreAssignment assignment =
                new ChoreAssignment();

        assignment.setChoreTemplate(template);
        assignment.setSchedule(schedule);

        assignment.setAssignedByUser(
                schedule.getCreatedByUser()
        );

        assignment.setScheduledForDate(today);

        assignment.setStatus(
                ChoreAssignmentStatus.ASSIGNED
        );

        assignment.setDueAt(
                calculateDueAt(
                        today,
                        schedule.getDueTime()
                )
        );

        // Snapshot rewards so changing the template
        // later does not change this assignment.
        assignment.setCoinRewardSnapshot(
                template.getCoinReward()
        );

        assignment.setXpRewardSnapshot(
                template.getXpReward()
        );

        assignment.setMoneyRewardPenceSnapshot(
                template.getMoneyRewardPence()
        );

        assignment.setLatePenaltyPercentSnapshot(
                template.getLatePenaltyPercent()
        );

        assignment.setResubmissionPenaltyPercentSnapshot(
                template.getResubmissionPenaltyPercent()
        );

        ChoreAssignment savedAssignment =
                choreAssignmentRepository.save(
                        assignment
                );

        for (ChoreScheduleParticipant scheduleParticipant
                : scheduleParticipants) {

            AssignmentParticipant participant =
                    new AssignmentParticipant();

            participant.setAssignment(
                    savedAssignment
            );

            participant.setChildUser(
                    scheduleParticipant.getChildUser()
            );

            participant.setParticipationStatus(
                    ParticipationStatus.ASSIGNED
            );

            assignmentParticipantRepository.save(
                    participant
            );
        }
    }
}

private boolean shouldGenerateToday(
        ChoreSchedule schedule,
        LocalDate today
) {

    if (!schedule.isActive()) {
        return false;
    }

    if (today.isBefore(schedule.getStartDate())) {
        return false;
    }

    if (schedule.getEndDate() != null
            && today.isAfter(schedule.getEndDate())) {

        return false;
    }

    return switch (schedule.getScheduleType()) {

        case DAILY -> true;

        case WEEKLY, SELECTED_DAYS -> {

            DayOfWeekValue todayValue =
                    DayOfWeekValue.valueOf(
                            today.getDayOfWeek().name()
                    );

            boolean matchingDay =
                    choreScheduleDayRepository
                            .findByChoreSchedule(schedule)
                            .stream()
                            .anyMatch(scheduleDay ->
                                    scheduleDay.getDayOfWeek()
                                            == todayValue
                            );

            yield matchingDay;
        }

        case ONE_TIME -> false;
    };
}

private Instant calculateDueAt(
        LocalDate date,
        LocalTime dueTime
) {

    if (dueTime == null) {
        return null;
    }

    return date
            .atTime(dueTime)
            .atZone(
                    ZoneId.of("Europe/London")
            )
            .toInstant();
}

    @Transactional
    public ChoreSchedule createSchedule(
            User parent,
            CreateChoreScheduleRequest request
    ) {

        FamilyMember parentMembership =
                familyMemberRepository.findByUser(parent)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User does not belong to a family."
                                )
                        );

        if (parentMembership.getRole() == FamilyRole.CHILD) {
            throw new IllegalArgumentException(
                    "Children cannot create chore schedules."
            );
        }

        ChoreTemplate template =
                choreTemplateRepository
                        .findById(request.templateId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Chore template not found."
                                )
                        );

        if (!template.isActive()) {
            throw new IllegalArgumentException(
                    "Cannot schedule an inactive chore template."
            );
        }

        if (!template.getFamily()
                .getId()
                .equals(
                        parentMembership
                                .getFamily()
                                .getId()
                )) {

            throw new IllegalArgumentException(
                    "You cannot schedule another family's chore."
            );
        }

        if (request.endDate() != null
                && request.endDate()
                .isBefore(request.startDate())) {

            throw new IllegalArgumentException(
                    "End date cannot be before start date."
            );
        }

        validateScheduleDays(request);

        /*
         * Prevent the same child being supplied twice.
         */
        Set<UUID> uniqueChildIds =
                new HashSet<>(request.childUserIds());

        if (uniqueChildIds.size()
                != request.childUserIds().size()) {

            throw new IllegalArgumentException(
                    "The same child cannot be added twice."
            );
        }

        /*
         * Validate every child before creating anything.
         */
        List<User> children =
                uniqueChildIds
                        .stream()
                        .map(childId -> {

                            User child =
                                    userRepository
                                            .findById(childId)
                                            .orElseThrow(() ->
                                                    new IllegalArgumentException(
                                                            "Child user not found."
                                                    )
                                            );

                            if (child.getUserType()
                                    != UserType.CHILD) {

                                throw new IllegalArgumentException(
                                        "Schedules can only be assigned to child accounts."
                                );
                            }

                            FamilyMember childMembership =
                                    familyMemberRepository
                                            .findByUser(child)
                                            .orElseThrow(() ->
                                                    new IllegalArgumentException(
                                                            "Child does not belong to a family."
                                                    )
                                            );

                            if (!childMembership
                                    .getFamily()
                                    .getId()
                                    .equals(
                                            parentMembership
                                                    .getFamily()
                                                    .getId()
                                    )) {

                                throw new IllegalArgumentException(
                                        "You cannot schedule chores for children in another family."
                                );
                            }

                            return child;
                        })
                        .toList();

        ChoreSchedule schedule =
                new ChoreSchedule();

                schedule.setCreatedByUser(parent);
        schedule.setChoreTemplate(template);

        schedule.setScheduleType(
                request.scheduleType()
        );

        schedule.setStartDate(
                request.startDate()
        );

        schedule.setEndDate(
                request.endDate()
        );

        schedule.setDueTime(
                request.dueTime()
        );

        schedule.setActive(true);

        ChoreSchedule savedSchedule =
                choreScheduleRepository.save(
                        schedule
                );

        /*
         * Save WEEKLY / SELECTED_DAYS.
         */
        if (request.daysOfWeek() != null) {

            Set<DayOfWeekValue> uniqueDays =
                    new HashSet<>(
                            request.daysOfWeek()
                    );

            for (DayOfWeekValue day : uniqueDays) {

                ChoreScheduleDay scheduleDay =
                        new ChoreScheduleDay();

                scheduleDay.setChoreSchedule(
                        savedSchedule
                );

                scheduleDay.setDayOfWeek(day);

                choreScheduleDayRepository.save(
                        scheduleDay
                );
            }
        }

        /*
         * Save the children who should receive
         * future assignments.
         */
        for (User child : children) {

            ChoreScheduleParticipant participant =
                    new ChoreScheduleParticipant();

            participant.setChoreSchedule(
                    savedSchedule
            );

            participant.setChildUser(
                    child
            );

            choreScheduleParticipantRepository.save(
                    participant
            );
        }

        return savedSchedule;
    }

    private void validateScheduleDays(
            CreateChoreScheduleRequest request
    ) {

        List<DayOfWeekValue> days =
                request.daysOfWeek();

        switch (request.scheduleType()) {

            case DAILY -> {

                if (days != null && !days.isEmpty()) {
                    throw new IllegalArgumentException(
                            "Daily schedules do not require days of the week."
                    );
                }
            }

            case WEEKLY -> {

                if (days == null || days.size() != 1) {
                    throw new IllegalArgumentException(
                            "Weekly schedules require exactly one day of the week."
                    );
                }
            }

            case SELECTED_DAYS -> {

                if (days == null || days.isEmpty()) {
                    throw new IllegalArgumentException(
                            "Selected-day schedules require at least one day."
                    );
                }
            }

            case ONE_TIME -> {

                throw new IllegalArgumentException(
                        "Use a normal chore assignment for one-time chores."
                );
            }
        }
    }
}