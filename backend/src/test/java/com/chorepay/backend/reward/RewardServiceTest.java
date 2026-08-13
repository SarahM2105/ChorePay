package com.chorepay.backend.reward;

import com.chorepay.backend.exception.NotFoundException;
import com.chorepay.backend.family.Family;
import com.chorepay.backend.family.FamilyMember;
import com.chorepay.backend.family.FamilyMemberRepository;
import com.chorepay.backend.family.FamilyRole;
import com.chorepay.backend.notification.NotificationService;
import com.chorepay.backend.notification.NotificationType;
import com.chorepay.backend.progress.UserProgress;
import com.chorepay.backend.progress.UserProgressRepository;
import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RewardServiceTest {

    @Mock
    private RewardRepository rewardRepository;

    @Mock
    private FamilyMemberRepository familyMemberRepository;

    @Mock
    private RewardRedemptionRepository rewardRedemptionRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private RewardTransactionRepository rewardTransactionRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private RewardService rewardService;

    private User child;
    private Family family;
    private FamilyMember membership;
    private Reward reward;
    private UserProgress progress;

    @BeforeEach
    void setUp() {

        child = mock(User.class);

        when(child.getUserType())
                .thenReturn(UserType.CHILD);

        family = mock(Family.class);

        membership = new FamilyMember();
        membership.setFamily(family);
        membership.setUser(child);

        reward = new Reward();
        reward.setFamily(family);
        reward.setName("Movie Night");
        reward.setCoinCost(50);
        reward.setMinimumLevel(1);
        reward.setUnlimitedStock(true);
        reward.setActive(true);

        progress = new UserProgress();
        progress.setChildUser(child);
        progress.setCoinBalance(100);
        progress.setCurrentLevel(1);
    }

    @Test
    void redeemReward_shouldCreatePendingRedemption() {

        when(family.getId())
                .thenReturn(UUID.randomUUID());

        UUID rewardId =
                UUID.randomUUID();

        RedeemRewardRequest request =
                new RedeemRewardRequest(
                        rewardId
                );

        when(familyMemberRepository
                .findByUser(child))
                .thenReturn(
                        Optional.of(membership)
                );

        when(rewardRepository
                .findById(rewardId))
                .thenReturn(
                        Optional.of(reward)
                );

        when(rewardRedemptionRepository
                .findByChildUserAndRewardAndStatus(
                        child,
                        reward,
                        RewardRedemptionStatus.PENDING
                ))
                .thenReturn(
                        Optional.empty()
                );

        when(userProgressRepository
                .findByChildUser(child))
                .thenReturn(
                        Optional.of(progress)
                );

        when(rewardRedemptionRepository
                .save(any(RewardRedemption.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        when(familyMemberRepository
                .findByFamily(family))
                .thenReturn(
                        List.of()
                );

        RewardRedemption result =
                rewardService.redeemReward(
                        child,
                        request
                );

        assertEquals(
                RewardRedemptionStatus.PENDING,
                result.getStatus()
        );

        assertSame(
                reward,
                result.getReward()
        );

        assertSame(
                child,
                result.getChildUser()
        );

        assertEquals(
                "Movie Night",
                result.getRewardNameSnapshot()
        );

        assertEquals(
                50,
                result.getCoinCostSnapshot()
        );

        verify(rewardRedemptionRepository)
                .save(any(RewardRedemption.class));
    }

    @Test
    void redeemReward_shouldRejectWhenChildHasInsufficientCoins() {

        when(family.getId())
                .thenReturn(UUID.randomUUID());

        UUID rewardId =
                UUID.randomUUID();

        RedeemRewardRequest request =
                new RedeemRewardRequest(
                        rewardId
                );

        progress.setCoinBalance(
                20
        );

        when(familyMemberRepository
                .findByUser(child))
                .thenReturn(
                        Optional.of(membership)
                );

        when(rewardRepository
                .findById(rewardId))
                .thenReturn(
                        Optional.of(reward)
                );

        when(rewardRedemptionRepository
                .findByChildUserAndRewardAndStatus(
                        child,
                        reward,
                        RewardRedemptionStatus.PENDING
                ))
                .thenReturn(
                        Optional.empty()
                );

        when(userProgressRepository
                .findByChildUser(child))
                .thenReturn(
                        Optional.of(progress)
                );

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () ->
                                rewardService.redeemReward(
                                        child,
                                        request
                                )
                );

        assertEquals(
                "You do not have enough coins for this reward.",
                exception.getMessage()
        );

        verify(
                rewardRedemptionRepository,
                never()
        ).save(
                any(RewardRedemption.class)
        );

        verifyNoInteractions(
                notificationService
        );
    }

    @Test
    void redeemReward_shouldRejectWhenRewardDoesNotExist() {

        UUID rewardId =
                UUID.randomUUID();

        RedeemRewardRequest request =
                new RedeemRewardRequest(
                        rewardId
                );

        when(familyMemberRepository
                .findByUser(child))
                .thenReturn(
                        Optional.of(membership)
                );

        when(rewardRepository
                .findById(rewardId))
                .thenReturn(
                        Optional.empty()
                );

        NotFoundException exception =
                assertThrows(
                        NotFoundException.class,
                        () ->
                                rewardService.redeemReward(
                                        child,
                                        request
                                )
                );

        assertEquals(
                "Reward not found.",
                exception.getMessage()
        );

        verify(
                rewardRedemptionRepository,
                never()
        ).save(
                any(RewardRedemption.class)
        );

        verifyNoInteractions(
                notificationService
        );
    }

    @Test
void redeemReward_shouldNotifyParentWhenRequestCreated() {

    when(family.getId())
            .thenReturn(UUID.randomUUID());

    UUID rewardId =
            UUID.randomUUID();

    RedeemRewardRequest request =
            new RedeemRewardRequest(
                    rewardId
            );

    User parent =
            mock(User.class);

    FamilyMember parentMember =
            new FamilyMember();

    parentMember.setFamily(family);
    parentMember.setUser(parent);
    parentMember.setRole(
            FamilyRole.PARENT
    );

    when(familyMemberRepository
            .findByUser(child))
            .thenReturn(
                    Optional.of(membership)
            );

    when(rewardRepository
            .findById(rewardId))
            .thenReturn(
                    Optional.of(reward)
            );

    when(rewardRedemptionRepository
            .findByChildUserAndRewardAndStatus(
                    child,
                    reward,
                    RewardRedemptionStatus.PENDING
            ))
            .thenReturn(
                    Optional.empty()
            );

    when(userProgressRepository
            .findByChildUser(child))
            .thenReturn(
                    Optional.of(progress)
            );

    when(rewardRedemptionRepository
            .save(any(RewardRedemption.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    when(familyMemberRepository
            .findByFamily(family))
            .thenReturn(
                    List.of(parentMember)
            );

    when(child.getName())
            .thenReturn("Test Child");

    RewardRedemption result =
            rewardService.redeemReward(
                    child,
                    request
            );

    verify(notificationService)
            .createNotification(
                    parent,
                    NotificationType.REWARD_REQUESTED,
                    "Reward request",
                    "Test Child requested Movie Night.",
                    result.getId()
            );
}
}