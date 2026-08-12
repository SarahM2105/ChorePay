package com.chorepay.backend.progress;

import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.chorepay.backend.family.FamilyMember;
import com.chorepay.backend.family.FamilyMemberRepository;
import com.chorepay.backend.family.FamilyRole;

import java.util.List;

@Service
public class UserProgressService {

    private final UserProgressRepository userProgressRepository;
private final FamilyMemberRepository familyMemberRepository;

    public UserProgressService(
        UserProgressRepository userProgressRepository,
        FamilyMemberRepository familyMemberRepository
) {
    this.userProgressRepository = userProgressRepository;
    this.familyMemberRepository = familyMemberRepository;
}

public List<FamilyChildProgressResponse> getFamilyProgress(
        User parent
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
                "Children cannot view family progress."
        );
    }

    return familyMemberRepository
            .findByFamily(parentMembership.getFamily())
            .stream()
            .filter(member ->
                    member.getRole() == FamilyRole.CHILD
            )
            .map(member ->
                    toFamilyChildResponse(member.getUser())
            )
            .toList();
}

private FamilyChildProgressResponse toFamilyChildResponse(
        User child
) {

    UserProgress progress =
            userProgressRepository
                    .findByChildUser(child)
                    .orElse(null);

    if (progress == null) {

        return new FamilyChildProgressResponse(
                child.getId(),
                child.getName(),
                0,
                0,
                1,
                0,
                0,
                0
        );
    }

    return new FamilyChildProgressResponse(
            child.getId(),
            child.getName(),
            progress.getCoinBalance(),
            progress.getTotalXp(),
            progress.getCurrentLevel(),
            progress.getCurrentStreak(),
            progress.getLongestStreak(),
            progress.getCompletedChoreCount()
    );
}
    @Transactional
    public UserProgressResponse getMyProgress(
            User user
    ) {

        if (user.getUserType() != UserType.CHILD) {
            throw new IllegalArgumentException(
                    "Only children have child progress."
            );
        }

        UserProgress progress =
                userProgressRepository
                        .findByChildUser(user)
                        .orElseGet(() -> {
                            UserProgress newProgress =
                                    new UserProgress();

                            newProgress.setChildUser(user);

                            return userProgressRepository.save(
                                    newProgress
                            );
                        });

        return toResponse(progress);
    }

    public UserProgressResponse toResponse(
            UserProgress progress
    ) {
        return new UserProgressResponse(
                progress.getChildUser().getId(),
                progress.getCoinBalance(),
                progress.getTotalXp(),
                progress.getCurrentLevel(),
                progress.getCurrentStreak(),
                progress.getLongestStreak(),
                progress.getLastCompletedChoreDate(),
                progress.getCompletedChoreCount()
        );
    }
}