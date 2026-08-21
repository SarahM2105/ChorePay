import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  ChildChoreAssignment,
  getMyAssignments,
} from '../services/chore.service';

import {
  useCallback,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppBottomNav } from '../components/AppBottomNav';

import { useAuth } from '../context/AuthContext';

import {
  cancelJoinRequest,
  Family,
  getMyFamily,
  getMyLatestJoinRequest,
  JoinRequest,
} from '../services/family.service';

import {
  childDashboardStyles as styles,
} from '../styles/screens/child-dashboard.styles';

export default function ChildDashboardScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  const {
    user,
    token,
    signOut,
  } = useAuth();

  const [family, setFamily] =
    useState<Family | null>(null);

  const [joinRequest, setJoinRequest] =
    useState<JoinRequest | null>(null);

  const [loadingFamily, setLoadingFamily] =
    useState(true);

  const [familyError, setFamilyError] =
    useState('');

  const [
    cancellingRequest,
    setCancellingRequest,
  ] = useState(false);


  const [assignments, setAssignments] =
  useState<ChildChoreAssignment[]>([]);

const [loadingAssignments, setLoadingAssignments] =
  useState(true);

const [assignmentsError, setAssignmentsError] =
  useState('');
  /*
   * Temporary display values.
   * Later these will come from the
   * progress / rewards backend.
   */
  const coins = 0;
  const level = 1;
  const xp = 0;
  const nextLevelXp = 100;
  const streak = 0;

  const loadFamilyState =
    useCallback(async () => {
      if (!token) {
        return;
      }

      try {
        setLoadingFamily(true);
        setFamilyError('');

        const familyResult =
          await getMyFamily(token);

        setFamily(familyResult);

        if (familyResult) {
  setJoinRequest(null);

  try {
    setLoadingAssignments(true);
    setAssignmentsError('');

    const results =
      await getMyAssignments(token);

    setAssignments(results);
  } catch (err) {
    if (err instanceof Error) {
      setAssignmentsError(err.message);
    } else {
      setAssignmentsError(
        'Could not load your chores.'
      );
    }
  } finally {
    setLoadingAssignments(false);
  }

  return;
}

setAssignments([]);
setLoadingAssignments(false);

        const requestResult =
          await getMyLatestJoinRequest(token);

        setJoinRequest(requestResult);
      } catch (err) {
        if (err instanceof Error) {
          setFamilyError(err.message);
        } else {
          setFamilyError(
            'Could not load your family.'
          );
        }
      } finally {
        setLoadingFamily(false);
      }
    }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadFamilyState();
    }, [loadFamilyState])
  );

  const handleCancelRequest = async () => {
    if (
      !token ||
      !joinRequest ||
      joinRequest.status !== 'PENDING'
    ) {
      return;
    }

    try {
      setCancellingRequest(true);
      setFamilyError('');

      await cancelJoinRequest(
        joinRequest.requestId,
        token
      );

      await loadFamilyState();
    } catch (err) {
      if (err instanceof Error) {
        setFamilyError(err.message);
      } else {
        setFamilyError(
          'Could not cancel your request.'
        );
      }
    } finally {
      setCancellingRequest(false);
    }
  };

  const handleLogout = async () => {
    await signOut();

    router.replace('/login');
  };

  const canJoinFamily =
    !joinRequest ||
    joinRequest.status === 'REJECTED' ||
    joinRequest.status === 'CANCELLED';
const activeAssignments =
  assignments.filter(
    (assignment) =>
      assignment.status !== 'APPROVED' &&
      assignment.status !== 'CANCELLED'
  );
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          {/* TOP BAR */}

          {/* TOP BAR */}

<View style={styles.topBar}>
  <View style={styles.brand}>
    <Text style={styles.brandChore}>
      CHORE
    </Text>

    <Text style={styles.brandPay}>
      PAY
    </Text>
  </View>

  <View style={styles.topActions}>
    <Pressable style={styles.iconButton}>
      <Ionicons
        name="notifications-outline"
        size={21}
        color="#17152B"
      />
    </Pressable>

    <Pressable
      style={styles.iconButton}
      onPress={handleLogout}
    >
      <Ionicons
        name="log-out-outline"
        size={20}
        color="#6C5CE7"
      />
    </Pressable>
  </View>
</View>
          {loadingFamily ? (
            <View style={styles.onboardingCard}>
              <Text style={styles.onboardingText}>
                Loading your dashboard...
              </Text>
            </View>
          ) : familyError ? (
            <View style={styles.onboardingCard}>
              <Ionicons
                name="alert-circle-outline"
                size={34}
                color="#C0392B"
              />

              <Text style={styles.error}>
                {familyError}
              </Text>
            </View>
          ) : family ? (
            <>
              {/* PROFILE + COINS */}

              <View
                style={[
                  styles.hero,

                  isDesktop &&
                    styles.heroDesktop,
                ]}
              >
                <View style={styles.profileCard}>
                  <View style={styles.profileTop}>
                    <View style={styles.avatar}>
                      <Ionicons
                        name="person"
                        size={34}
                        color="#6C5CE7"
                      />
                    </View>

                    <View
                      style={styles.profileInfo}
                    >
                      <Text style={styles.greeting}>
                        Hi, {user?.name}! 👋
                      </Text>

                      <View
                        style={styles.levelRow}
                      >
                        <View
                          style={styles.levelIcon}
                        >
                          <Ionicons
                            name="star"
                            size={15}
                            color="#6C5CE7"
                          />
                        </View>

                        <Text
                          style={styles.levelText}
                        >
                          Level {level}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.xpBarBackground
                        }
                      >
                        <View
                          style={styles.xpBarFill}
                        />
                      </View>

                      <Text style={styles.xpText}>
                        {xp} / {nextLevelXp} XP
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.coinsCard}>
                  <View style={styles.coinIcon}>
                    <Ionicons
                      name="flash"
                      size={24}
                      color="#E49A12"
                    />
                  </View>

                  <View>
                    <Text
                      style={styles.coinNumber}
                    >
                      {coins}
                    </Text>

                    <Text
                      style={styles.coinLabel}
                    >
                      Coins
                    </Text>
                  </View>
                </View>
              </View>

              {/* STREAK */}

              <View style={styles.streakCard}>
                <View style={styles.streakIcon}>
                  <Ionicons
                    name="flame"
                    size={22}
                    color="#E87575"
                  />
                </View>

                <View style={styles.streakInfo}>
                  <Text style={styles.streakTitle}>
                    {streak === 0
                      ? 'Start your streak!'
                      : `${streak} Day Streak! 🔥`}
                  </Text>

                  <Text style={styles.streakText}>
                    Complete chores regularly to
                    build your streak.
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color="#17152B"
                />
              </View>

              {/* QUESTS + SIDE CARDS */}

              <View
                style={[
                  styles.contentGrid,

                  isDesktop &&
                    styles.contentGridDesktop,
                ]}
              >
                <View
                  style={styles.questsColumn}
                >
                  <View style={styles.questPanel}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>
      Your quests
    </Text>

    <View style={styles.countBadge}>
      <Text style={styles.countText}>
        {loadingAssignments
          ? '—'
          : activeAssignments.length}
      </Text>
    </View>
  </View>

  {assignmentsError ? (
    <Text style={styles.error}>
      {assignmentsError}
    </Text>
  ) : loadingAssignments ? (
    <View style={styles.emptyQuest}>
      <Text style={styles.emptyQuestText}>
        Loading your quests...
      </Text>
    </View>
  ) : activeAssignments.length === 0 ? (
    <View style={styles.emptyQuest}>
      <View style={styles.emptyQuestIcon}>
        <Ionicons
          name="sparkles-outline"
          size={27}
          color="#6C5CE7"
        />
      </View>

      <Text style={styles.emptyQuestTitle}>
        No quests yet
      </Text>

      <Text style={styles.emptyQuestText}>
        When a parent assigns you a chore,
        it will appear here.
      </Text>
    </View>
  ) : (
    <View style={styles.questList}>
      {activeAssignments.map(
        (assignment) => {
          const dueDate = assignment.dueAt
            ? new Date(assignment.dueAt)
            : null;

          const statusLabel =
            assignment.status === 'ASSIGNED'
              ? 'TO DO'
              : assignment.status ===
                  'SUBMITTED'
                ? 'WAITING FOR APPROVAL'
                : assignment.status ===
                    'REJECTED'
                  ? 'NEEDS CHANGES'
                  : assignment.status ===
                      'OVERDUE'
                    ? 'OVERDUE'
                    : assignment.status;

          const statusStyle =
            assignment.status === 'SUBMITTED'
              ? styles.submittedStatus
              : assignment.status ===
                    'REJECTED' ||
                  assignment.status ===
                    'OVERDUE'
                ? styles.rejectedStatus
                : styles.assignedStatus;

          const statusTextStyle =
            assignment.status === 'SUBMITTED'
              ? styles.questStatusSubmittedText
              : assignment.status ===
                    'REJECTED' ||
                  assignment.status ===
                    'OVERDUE'
                ? styles.questStatusDangerText
                : undefined;

          return (
            <Pressable
              key={assignment.assignmentId}
              style={styles.questCard}
            >
              <View style={styles.questIcon}>
                <Ionicons
                  name="clipboard-outline"
                  size={22}
                  color="#4B988E"
                />
              </View>

              <View style={styles.questInfo}>
                <View
                  style={[
                    styles.questStatus,
                    statusStyle,
                  ]}
                >
                  <Text
                    style={[
                      styles.questStatusText,
                      statusTextStyle,
                    ]}
                  >
                    {statusLabel}
                  </Text>
                </View>

                <Text style={styles.questTitle}>
                  {assignment.title}
                </Text>

                <View style={styles.questMeta}>
                  <View
                    style={styles.questMetaItem}
                  >
                    <Ionicons
                      name="ellipse"
                      size={10}
                      color="#F4B84A"
                    />

                    <Text
                      style={styles.coinText}
                    >
                      {assignment.coinReward}
                    </Text>
                  </View>

                  <View
                    style={styles.questMetaItem}
                  >
                    <Ionicons
                      name="star"
                      size={12}
                      color="#6C5CE7"
                    />

                    <Text
                      style={styles.xpMetaText}
                    >
                      {assignment.xpReward} XP
                    </Text>
                  </View>

                  {dueDate && (
                    <View
                      style={
                        styles.questMetaItem
                      }
                    >
                      <Ionicons
                        name="time-outline"
                        size={13}
                        color="#6F6B7D"
                      />

                      <Text
                        style={
                          styles.questMetaText
                        }
                      >
                        {dueDate.toLocaleDateString(
                          [],
                          {
                            day: 'numeric',
                            month: 'short',
                          }
                        )}
                        {' · '}
                        {dueDate.toLocaleTimeString(
                          [],
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#6C5CE7"
              />
            </Pressable>
          );
        }
      )}
    </View>
  )}
</View>
                
                </View>

                <View style={styles.sideColumn}>
                  {/* SHOP */}

                  <Pressable style={styles.shopCard}>
                    <View style={styles.shopHeader}>
                      <View
                        style={styles.shopIcon}
                      >
                        <Ionicons
                          name="bag-handle-outline"
                          size={22}
                          color="#6C5CE7"
                        />
                      </View>

                      <View style={styles.shopInfo}>
                        <Text
                          style={styles.shopTitle}
                        >
                          Shop
                        </Text>

                        <Text
                          style={styles.shopText}
                        >
                          Spend your coins on
                          rewards!
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={19}
                        color="#6C5CE7"
                      />
                    </View>
                  </Pressable>

                  {/* FAMILY */}

                  <View style={styles.familyCard}>
                    <View style={styles.familyTop}>
                      <View
                        style={styles.familyIcon}
                      >
                        <Ionicons
                          name="people-outline"
                          size={21}
                          color="#4B988E"
                        />
                      </View>

                      <View
                        style={styles.familyInfo}
                      >
                        <Text
                          style={
                            styles.familyLabel
                          }
                        >
                          Your family
                        </Text>

                        <Text
                          style={
                            styles.familyName
                          }
                        >
                          {family.name}
                        </Text>
                      </View>

                      <Ionicons
                        name="checkmark-circle"
                        size={21}
                        color="#72B8AD"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : joinRequest?.status ===
            'PENDING' ? (
            /* WAITING FOR APPROVAL */

            <View style={styles.onboardingCard}>
              <View
                style={styles.onboardingIcon}
              >
                <Ionicons
                  name="time-outline"
                  size={32}
                  color="#6C5CE7"
                />
              </View>

              <View style={styles.statusBadge}>
                <Text
                  style={styles.statusBadgeText}
                >
                  WAITING FOR APPROVAL
                </Text>
              </View>

              <Text
                style={styles.onboardingTitle}
              >
                Request sent!
              </Text>

              <Text
                style={styles.onboardingText}
              >
                A parent needs to approve your
                request before you can start using
                your ChorePay family.
              </Text>

              <Pressable
                disabled={cancellingRequest}
                style={styles.secondaryButton}
                onPress={handleCancelRequest}
              >
                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  {cancellingRequest
                    ? 'Cancelling...'
                    : 'Cancel request'}
                </Text>
              </Pressable>
            </View>
          ) : joinRequest?.status ===
            'REJECTED' ? (
            /* REJECTED */

            <View style={styles.onboardingCard}>
              <View
                style={styles.onboardingIcon}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={34}
                  color="#E87575"
                />
              </View>

              <Text
                style={styles.onboardingTitle}
              >
                Request declined
              </Text>

              <Text
                style={styles.onboardingText}
              >
                Your previous request wasn't
                approved. You can enter another
                family code and try again.
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={() =>
                  router.push('/join-family')
                }
              >
                <Ionicons
                  name="key-outline"
                  size={19}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Try another code
                </Text>
              </Pressable>
            </View>
          ) : canJoinFamily ? (
            /* NOT IN A FAMILY */

            <View style={styles.onboardingCard}>
              <View
                style={styles.onboardingIcon}
              >
                <Ionicons
                  name="people-outline"
                  size={34}
                  color="#6C5CE7"
                />
              </View>

              <Text
                style={styles.onboardingTitle}
              >
                Join your family
              </Text>

              <Text
                style={styles.onboardingText}
              >
                Ask your parent for their ChorePay
                family code, then enter it to send
                a join request.
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={() =>
                  router.push('/join-family')
                }
              >
                <Ionicons
                  name="key-outline"
                  size={19}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Enter family code
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <AppBottomNav
        active="home"
        userType="CHILD"
      />
    </View>
  );
}