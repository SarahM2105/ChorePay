import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import {
  useEffect,
  useState,
  useCallback,
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
  getFamilyAssignments,
  ParentChoreAssignment,
} from '../services/chore.service';

import {
  approveJoinRequest,
  Family,
  FamilyMember,
  getFamilyMembers,
  getJoinRequests,
  getMyFamily,
  JoinRequest,
  rejectJoinRequest,
  cancelJoinRequest,
getMyLatestJoinRequest,
} from '../services/family.service';

import { commonStyles } from '../styles/common.styles';

import {
  parentDashboardStyles as styles,
} from '../styles/screens/parent-dashboard.styles';

export default function ParentDashboardScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  const {
    user,
    token,
    signOut,
  } = useAuth();

  /*
   * FAMILY
   */

  const [family, setFamily] =
    useState<Family | null>(null);

  const [loadingFamily, setLoadingFamily] =
    useState(true);

  const [familyError, setFamilyError] =
    useState('');
    const [
  myJoinRequest,
  setMyJoinRequest,
] = useState<JoinRequest | null>(null);

const [
  cancellingMyRequest,
  setCancellingMyRequest,
] = useState(false);

  /*
   * FAMILY MEMBERS
   */

  const [
    familyMembers,
    setFamilyMembers,
  ] = useState<FamilyMember[]>([]);

  const [
    loadingMembers,
    setLoadingMembers,
  ] = useState(true);

  const [
    membersError,
    setMembersError,
  ] = useState('');

  /*
   * JOIN REQUESTS
   */

  const [
    joinRequests,
    setJoinRequests,
  ] = useState<JoinRequest[]>([]);

  const [
    loadingRequests,
    setLoadingRequests,
  ] = useState(true);

  const [
    requestError,
    setRequestError,
  ] = useState('');

  const [
    processingRequestId,
    setProcessingRequestId,
  ] = useState<string | null>(null);

  /*
   * CHORES
   */

  const [
    assignments,
    setAssignments,
  ] = useState<ParentChoreAssignment[]>(
    []
  );

  const [
    loadingAssignments,
    setLoadingAssignments,
  ] = useState(true);

  const [
    assignmentsError,
    setAssignmentsError,
  ] = useState('');

  /*
   * GREETING
   */

  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';

  /*
 * LOAD FAMILY + THIS PARENT'S
 * OWN JOIN REQUEST
 */

  /*
 * CURRENT FAMILY ROLE
 */

const currentFamilyMember =
  familyMembers.find(
    (member) =>
      member.userId === user?.id
  );

const isFamilyOwner =
  currentFamilyMember?.role === 'OWNER';

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

      /*
       * They're already in a family.
       */
      if (familyResult) {
        setMyJoinRequest(null);
        return;
      }

      /*
       * They're not in a family.
       * Check if they have sent
       * a join request.
       */
      const requestResult =
        await getMyLatestJoinRequest(
          token
        );

      setMyJoinRequest(
        requestResult
      );
    } catch (err) {
      if (err instanceof Error) {
        setFamilyError(
          err.message
        );
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
  /*
   * LOAD FAMILY MEMBERS
   */

  const loadFamilyMembers =
    async () => {
      if (!token) {
        return;
      }

      try {
        setLoadingMembers(true);
        setMembersError('');

        const members =
          await getFamilyMembers(token);

        setFamilyMembers(members);
      } catch (err) {
        if (err instanceof Error) {
          setMembersError(err.message);
        } else {
          setMembersError(
            'Could not load family members.'
          );
        }
      } finally {
        setLoadingMembers(false);
      }
    };

  /*
   * LOAD JOIN REQUESTS
   */

  const loadJoinRequests =
    async () => {
      if (!token) {
        return;
      }

      try {
        setLoadingRequests(true);
        setRequestError('');

        const requests =
          await getJoinRequests(token);

        setJoinRequests(requests);
      } catch (err) {
        if (err instanceof Error) {
          setRequestError(err.message);
        } else {
          setRequestError(
            'Could not load join requests.'
          );
        }
      } finally {
        setLoadingRequests(false);
      }
    };

  /*
   * LOAD FAMILY CHORES
   */

  const loadAssignments =
    async () => {
      if (!token) {
        return;
      }

      try {
        setLoadingAssignments(true);
        setAssignmentsError('');

        const result =
          await getFamilyAssignments(
            token
          );

        setAssignments(result);
      } catch (err) {
        if (err instanceof Error) {
          setAssignmentsError(
            err.message
          );
        } else {
          setAssignmentsError(
            'Could not load family chores.'
          );
        }
      } finally {
        setLoadingAssignments(false);
      }
    };

  /*
   * LOAD FAMILY DATA ONCE
   * FAMILY EXISTS
   */

  useEffect(() => {
    if (!family) {
      setLoadingMembers(false);
      setLoadingRequests(false);
      setLoadingAssignments(false);

      setFamilyMembers([]);
      setJoinRequests([]);
      setAssignments([]);

      return;
    }

    loadFamilyMembers();
    loadJoinRequests();
    loadAssignments();
  }, [family, token]);


const handleCancelMyRequest =
  async () => {
    if (
      !token ||
      !myJoinRequest ||
      myJoinRequest.status !== 'PENDING'
    ) {
      return;
    }

    try {
      setCancellingMyRequest(true);
      setFamilyError('');

      await cancelJoinRequest(
        myJoinRequest.requestId,
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
      setCancellingMyRequest(false);
    }
  };
  
  
  /*
   * LOGOUT
   */

  const handleLogout = async () => {
    await signOut();

    router.replace('/login');
  };



  /*
   * JOIN REQUEST APPROVAL
   */

  const handleApprove = async (
    requestId: string
  ) => {
    if (!token) {
      return;
    }

    try {
      setProcessingRequestId(
        requestId
      );

      setRequestError('');

      await approveJoinRequest(
        requestId,
        token
      );

      await Promise.all([
        loadJoinRequests(),
        loadFamilyMembers(),
      ]);
    } catch (err) {
      if (err instanceof Error) {
        setRequestError(err.message);
      } else {
        setRequestError(
          'Could not approve request.'
        );
      }
    } finally {
      setProcessingRequestId(null);
    }
  };

  /*
   * JOIN REQUEST REJECTION
   */

  const handleReject = async (
    requestId: string
  ) => {
    if (!token) {
      return;
    }

    try {
      setProcessingRequestId(
        requestId
      );

      setRequestError('');

      await rejectJoinRequest(
        requestId,
        token
      );

      await loadJoinRequests();
    } catch (err) {
      if (err instanceof Error) {
        setRequestError(err.message);
      } else {
        setRequestError(
          'Could not reject request.'
        );
      }
    } finally {
      setProcessingRequestId(null);
    }
  };

  /*
   * CHORE DASHBOARD DATA
   *
   * Completed and cancelled chores don't
   * belong in the active dashboard list.
   */

  const activeAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status !==
          'APPROVED' &&
        assignment.status !==
          'CANCELLED'
    );

  /*
   * For now this counts assignments
   * marked SUBMITTED.
   *
   * Later we can connect the dedicated
   * /submissions/pending endpoint for
   * participant-level approval counts.
   */

  const needApprovalCount =
    assignments.filter(
      (assignment) =>
        assignment.status ===
        'SUBMITTED'
    ).length;

  /*
   * HELPERS
   */

  const formatDueDate = (
    value: string | null
  ) => {
    if (!value) {
      return 'No due date';
    }

    const date = new Date(value);

    return date.toLocaleString(
      [],
      {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

  const getStatusLabel = (
    status:
      ParentChoreAssignment['status']
  ) => {
    switch (status) {
      case 'ASSIGNED':
        return 'To do';

      case 'SUBMITTED':
        return 'Needs approval';

      case 'REJECTED':
        return 'Needs changes';

      case 'OVERDUE':
        return 'Overdue';

      case 'APPROVED':
        return 'Completed';

      case 'CANCELLED':
        return 'Cancelled';

      default:
        return status;
    }
  };

  /*
   * INITIAL LOADING
   */

  if (loadingFamily) {
    return (
      <View
        style={[
          styles.screen,
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text>
          Loading your dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.page}>
          {/* TOP BAR */}

          <View style={styles.topBar}>
            <View style={styles.brand}>
              <Text
                style={
                  styles.brandChore
                }
              >
                CHORE
              </Text>

              <Text
                style={styles.brandPay}
              >
                PAY
              </Text>
            </View>

            <View
              style={styles.topActions}
            >
              <View
                style={
                  styles.notificationButton
                }
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#17152B"
                />

                {joinRequests.length >
                  0 && (
                  <View
                    style={
                      styles.notificationBadge
                    }
                  >
                    <Text
                      style={
                        styles.notificationBadgeText
                      }
                    >
                      {
                        joinRequests.length
                      }
                    </Text>
                  </View>
                )}
              </View>

              <Pressable
                style={
                  styles.logoutButton
                }
                onPress={handleLogout}
              >
                <Ionicons
                  name="log-out-outline"
                  size={17}
                  color="#6C5CE7"
                />

                {isDesktop && (
                  <Text
                    style={
                      styles.logoutText
                    }
                  >
                    Log out
                  </Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* GREETING */}

          <View style={styles.header}>
            <Text
              style={styles.welcome}
            >
              {greeting}, {user?.name}!
              {' 👋'}
            </Text>

            <Text
              style={styles.subtitle}
            >
              Here's what's happening
              with your family today.
            </Text>
          </View>

          {familyError ? (
            <Text
              style={
                commonStyles.errorText
              }
            >
              {familyError}
            </Text>
          ) : null}

          {!family ? (
  myJoinRequest?.status === 'PENDING' ? (
    /*
     * WAITING FOR OWNER APPROVAL
     */

    <View style={styles.onboardingCard}>
      <View style={styles.onboardingIcon}>
        <Ionicons
          name="time-outline"
          size={34}
          color="#6C5CE7"
        />
      </View>

      <Text style={styles.onboardingTitle}>
        Request sent!
      </Text>

      <Text style={styles.onboardingText}>
        Your request has been sent to the
        family owner. Once they approve you,
        you'll be able to access the family.
      </Text>

      <Pressable
        disabled={cancellingMyRequest}
        style={styles.joinFamilyButton}
        onPress={handleCancelMyRequest}
      >
        <Ionicons
          name="close-circle-outline"
          size={20}
          color="#6C5CE7"
        />

        <Text
          style={
            styles.joinFamilyButtonText
          }
        >
          {cancellingMyRequest
            ? 'Cancelling...'
            : 'Cancel request'}
        </Text>
      </Pressable>
    </View>
  ) : (
    /*
     * NO REQUEST YET
     */

    <View style={styles.onboardingCard}>
      <View style={styles.onboardingIcon}>
        <Ionicons
          name="people-outline"
          size={34}
          color="#6C5CE7"
        />
      </View>

      <Text style={styles.onboardingTitle}>
        Set up your family
      </Text>

      <Text style={styles.onboardingText}>
        Create a new ChorePay family or
        join an existing one using their
        family code.
      </Text>

      <View style={styles.onboardingActions}>
        <Pressable
          style={styles.createChoreButton}
          onPress={() =>
            router.push('/create-family')
          }
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text
            style={
              styles.createChoreButtonText
            }
          >
            Create a family
          </Text>
        </Pressable>

        <Pressable
          style={styles.joinFamilyButton}
          onPress={() =>
            router.push('/join-family')
          }
        >
          <Ionicons
            name="key-outline"
            size={20}
            color="#6C5CE7"
          />

          <Text
            style={
              styles.joinFamilyButtonText
            }
          >
            Join an existing family
          </Text>
        </Pressable>
      </View>
    </View>
  )
) : (
  <>
    {/* STATS */}
           

              <View
                style={[
                  styles.statsGrid,

                  isDesktop &&
                    styles.statsGridDesktop,
                ]}
              >
                {/* MEMBERS */}

                <View
                  style={styles.statCard}
                >
                  <View
                    style={[
                      styles.statIcon,
                      styles.tealIcon,
                    ]}
                  >
                    <Ionicons
                      name="people-outline"
                      size={24}
                      color="#4B988E"
                    />
                  </View>

                  <View>
                    <Text
                      style={
                        styles.statNumber
                      }
                    >
                      {loadingMembers
                        ? '—'
                        : familyMembers.length}
                    </Text>

                    <Text
                      style={
                        styles.statLabel
                      }
                    >
                      Family members
                    </Text>
                  </View>
                </View>

                {/* ACTIVE CHORES */}

                <View
                  style={styles.statCard}
                >
                  <View
                    style={[
                      styles.statIcon,
                      styles.purpleIcon,
                    ]}
                  >
                    <Ionicons
                      name="clipboard-outline"
                      size={24}
                      color="#6C5CE7"
                    />
                  </View>

                  <View>
                    <Text
                      style={
                        styles.statNumber
                      }
                    >
                      {loadingAssignments
                        ? '—'
                        : activeAssignments.length}
                    </Text>

                    <Text
                      style={
                        styles.statLabel
                      }
                    >
                      Active chores
                    </Text>
                  </View>
                </View>

                {/* NEED APPROVAL */}

                <View
                  style={styles.statCard}
                >
                  <View
                    style={[
                      styles.statIcon,
                      styles.orangeIcon,
                    ]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color="#D99419"
                    />
                  </View>

                  <View>
                    <Text
                      style={
                        styles.statNumber
                      }
                    >
                      {loadingAssignments
                        ? '—'
                        : needApprovalCount}
                    </Text>

                    <Text
                      style={
                        styles.statLabel
                      }
                    >
                      Need approval
                    </Text>
                  </View>
                </View>
              </View>

              {/* CHORES + QUICK ACTIONS */}

              <View
                style={[
                  styles.mainGrid,

                  isDesktop &&
                    styles.mainGridDesktop,
                ]}
              >
                {/* ACTIVE CHORES */}

                <View
                  style={
                    styles.choresCard
                  }
                >
                  <View
                    style={
                      styles.sectionHeader
                    }
                  >
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      Active chores
                    </Text>

                    <View
                      style={
                        styles.sectionCount
                      }
                    >
                      <Text
                        style={
                          styles.sectionCountText
                        }
                      >
                        {loadingAssignments
                          ? '—'
                          : activeAssignments.length}
                      </Text>
                    </View>
                  </View>

                  {assignmentsError ? (
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      {assignmentsError}
                    </Text>
                  ) : loadingAssignments ? (
                    <View
                      style={
                        styles.emptyChores
                      }
                    >
                      <Text
                        style={
                          styles.emptyText
                        }
                      >
                        Loading chores...
                      </Text>
                    </View>
                  ) : activeAssignments.length ===
                    0 ? (
                    <View
                      style={
                        styles.emptyChores
                      }
                    >
                      <View
                        style={
                          styles.emptyIcon
                        }
                      >
                        <Ionicons
                          name="sparkles-outline"
                          size={26}
                          color="#6C5CE7"
                        />
                      </View>

                      <Text
                        style={
                          styles.emptyTitle
                        }
                      >
                        No active chores
                      </Text>

                      <Text
                        style={
                          styles.emptyText
                        }
                      >
                        Create a chore and
                        assign it to someone
                        in your family.
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={
                        styles.choreList
                      }
                    >
                      {activeAssignments.map(
                        (
                          assignment
                        ) => {
                          const isSubmitted =
                            assignment.status ===
                            'SUBMITTED';

                          const isDanger =
                            assignment.status ===
                              'REJECTED' ||
                            assignment.status ===
                              'OVERDUE';

                          return (
                            <View
                              key={
                                assignment.assignmentId
                              }
                              style={
                                styles.choreRow
                              }
                            >
                              <View
                                style={
                                  styles.choreIcon
                                }
                              >
                                <Ionicons
                                  name="clipboard-outline"
                                  size={
                                    21
                                  }
                                  color="#6C5CE7"
                                />
                              </View>

                              <View
                                style={
                                  styles.choreInfo
                                }
                              >
                                <View
                                  style={
                                    styles.choreTopRow
                                  }
                                >
                                  <Text
                                    style={
                                      styles.choreTitle
                                    }
                                    numberOfLines={
                                      1
                                    }
                                  >
                                    {
                                      assignment.title
                                    }
                                  </Text>

                                  <View
                                    style={[
                                      styles.choreStatus,

                                      isSubmitted
                                        ? styles.choreStatusSubmitted
                                        : isDanger
                                          ? styles.choreStatusDanger
                                          : styles.choreStatusAssigned,
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.choreStatusText,

                                        isSubmitted
                                          ? styles.choreStatusSubmittedText
                                          : isDanger
                                            ? styles.choreStatusDangerText
                                            : undefined,
                                      ]}
                                    >
                                      {getStatusLabel(
                                        assignment.status
                                      )}
                                    </Text>
                                  </View>
                                </View>

                                <View
                                  style={
                                    styles.choreMeta
                                  }
                                >
                                  <View
                                    style={
                                      styles.choreMetaItem
                                    }
                                  >
                                    <Ionicons
                                      name="ellipse"
                                      size={
                                        9
                                      }
                                      color="#F4B84A"
                                    />

                                    <Text
                                      style={
                                        styles.choreRewardText
                                      }
                                    >
                                      {
                                        assignment.coinReward
                                      }{' '}
                                      coins
                                    </Text>
                                  </View>

                                  <View
                                    style={
                                      styles.choreMetaItem
                                    }
                                  >
                                    <Ionicons
                                      name="star"
                                      size={
                                        11
                                      }
                                      color="#6C5CE7"
                                    />

                                    <Text
                                      style={
                                        styles.choreMetaText
                                      }
                                    >
                                      {
                                        assignment.xpReward
                                      }{' '}
                                      XP
                                    </Text>
                                  </View>

                                  <View
                                    style={
                                      styles.choreMetaItem
                                    }
                                  >
                                    <Ionicons
                                      name="people-outline"
                                      size={
                                        12
                                      }
                                      color="#6F6B7D"
                                    />

                                    <Text
                                      style={
                                        styles.choreMetaText
                                      }
                                    >
                                      {
                                        assignment
                                          .participants
                                          .length
                                      }{' '}
                                      {assignment
                                        .participants
                                        .length ===
                                      1
                                        ? 'child'
                                        : 'children'}
                                    </Text>
                                  </View>

                                  <View
                                    style={
                                      styles.choreMetaItem
                                    }
                                  >
                                    <Ionicons
                                      name="time-outline"
                                      size={
                                        12
                                      }
                                      color="#6F6B7D"
                                    />

                                    <Text
                                      style={
                                        styles.choreMetaText
                                      }
                                    >
                                      {formatDueDate(
                                        assignment.dueAt
                                      )}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          );
                        }
                      )}
                    </View>
                  )}

                  <Pressable
                    style={
                      styles.createChoreButton
                    }
                    onPress={() =>
                      router.push(
                        '/create-chore'
                      )
                    }
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.createChoreButtonText
                      }
                    >
                      Create chore
                    </Text>
                  </Pressable>
                </View>

                {/* QUICK ACTIONS */}

                <View
                  style={
                    styles.quickActionsCard
                  }
                >
                  <View
                    style={
                      styles.sectionHeader
                    }
                  >
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      Quick actions
                    </Text>
                  </View>

                  <Pressable
                    style={[
                      styles.quickAction,
                      styles.quickActionPrimary,
                    ]}
                    onPress={() =>
                      router.push(
                        '/create-chore'
                      )
                    }
                  >
                    <View
                      style={
                        styles.quickActionIcon
                      }
                    >
                      <Ionicons
                        name="add"
                        size={21}
                        color="#6C5CE7"
                      />
                    </View>

                    <View
                      style={
                        styles.quickActionTextContainer
                      }
                    >
                      <Text
                        style={
                          styles.quickActionTitle
                        }
                      >
                        Create chore
                      </Text>

                      <Text
                        style={
                          styles.quickActionSubtitle
                        }
                      >
                        Assign something
                        new
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#6C5CE7"
                    />
                  </Pressable>

                  <View
                    style={
                      styles.quickAction
                    }
                  >
                    <View
                      style={
                        styles.quickActionIcon
                      }
                    >
                      <Ionicons
                        name="gift-outline"
                        size={20}
                        color="#D99419"
                      />
                    </View>

                    <View
                      style={
                        styles.quickActionTextContainer
                      }
                    >
                      <Text
                        style={
                          styles.quickActionTitle
                        }
                      >
                        Add reward
                      </Text>

                      <Text
                        style={
                          styles.quickActionSubtitle
                        }
                      >
                        Coming soon
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.quickAction
                    }
                  >
                    <View
                      style={
                        styles.quickActionIcon
                      }
                    >
                      <Ionicons
                        name="key-outline"
                        size={20}
                        color="#4B988E"
                      />
                    </View>

                    <View
                      style={
                        styles.quickActionTextContainer
                      }
                    >
                      <Text
                        style={
                          styles.quickActionTitle
                        }
                      >
                        Family code
                      </Text>

                      <Text
                        style={
                          styles.quickActionSubtitle
                        }
                      >
                        {family.joinCode}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* FAMILY + JOIN REQUESTS */}

              <View
                style={[
                  styles.lowerGrid,

                  isDesktop &&
                    styles.lowerGridDesktop,
                ]}
              >
                {/* FAMILY */}

                <View
                  style={
                    styles.familyPanel
                  }
                >
                  <View
                    style={
                      styles.familyHeader
                    }
                  >
                    <View>
                      <Text
                        style={
                          styles.sectionTitle
                        }
                      >
                        Family
                      </Text>

                      <Text
                        style={
                          styles.familyName
                        }
                      >
                        {family.name}
                      </Text>

                      <Text
                        style={
                          styles.familyHint
                        }
                      >
                        {
                          familyMembers.length
                        }{' '}
                        {familyMembers.length ===
                        1
                          ? 'member'
                          : 'members'}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.joinCodeBox
                      }
                    >
                      <Text
                        style={
                          styles.joinCodeLabel
                        }
                      >
                        Join code
                      </Text>

                      <Text
                        style={
                          styles.joinCode
                        }
                      >
                        {family.joinCode}
                      </Text>
                    </View>
                  </View>

                  {membersError ? (
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      {membersError}
                    </Text>
                  ) : loadingMembers ? (
                    <Text
                      style={
                        styles.emptyText
                      }
                    >
                      Loading family
                      members...
                    </Text>
                  ) : (
                    familyMembers.map(
                      (member) => (
                        <View
                          key={
                            member.userId
                          }
                          style={
                            styles.memberRow
                          }
                        >
                          <View
                            style={
                              styles.memberAvatar
                            }
                          >
                            <Ionicons
                              name="person-outline"
                              size={
                                18
                              }
                              color="#4B988E"
                            />
                          </View>

                          <View
                            style={
                              styles.memberInfo
                            }
                          >
                            <Text
                              style={
                                styles.memberName
                              }
                            >
                              {
                                member.name
                              }
                            </Text>

                            <Text
                              style={
                                styles.memberJoined
                              }
                            >
                              Joined{' '}
                              {new Date(
                                member.joinedAt
                              ).toLocaleDateString()}
                            </Text>
                          </View>

                          <View
                            style={
                              styles.memberRoleBadge
                            }
                          >
                            <Text
                              style={
                                styles.memberRoleText
                              }
                            >
                              {member.role ===
                              'OWNER'
                                ? 'Owner'
                                : member.role ===
                                    'PARENT'
                                  ? 'Parent'
                                  : 'Child'}
                            </Text>
                          </View>
                        </View>
                      )
                    )
                  )}
                </View>

                {/* JOIN REQUESTS */}

                <View
                  style={
                    styles.requestsPanel
                  }
                >
                  <View
                    style={
                      styles.sectionHeader
                    }
                  >
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      Join requests
                    </Text>

                    {joinRequests.length >
                      0 && (
                      <View
                        style={
                          styles.sectionCount
                        }
                      >
                        <Text
                          style={
                            styles.sectionCountText
                          }
                        >
                          {
                            joinRequests.length
                          }
                        </Text>
                      </View>
                    )}
                  </View>

                  {requestError ? (
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      {requestError}
                    </Text>
                  ) : loadingRequests ? (
                    <Text
                      style={
                        styles.emptyText
                      }
                    >
                      Loading requests...
                    </Text>
                  ) : joinRequests.length ===
                    0 ? (
                    <View
                      style={
                        styles.noRequests
                      }
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={30}
                        color="#72B8AD"
                      />

                      <Text
                        style={
                          styles.noRequestsText
                        }
                      >
                        No pending
                        requests. You're all
                        caught up!
                      </Text>
                    </View>
                  ) : (
                    joinRequests.map(
                      (request) => {
                        const isProcessing =
                          processingRequestId ===
                          request.requestId;
                          const canReviewRequest =
                        request.requestedRole === 'CHILD' ||
                        isFamilyOwner;

                        return (
                          <View
                            key={
                              request.requestId
                            }
                            style={
                              styles.requestCard
                            }
                          >
                            <View
                              style={
                                styles.requestTop
                              }
                            >
                              <View
                                style={
                                  styles.requestAvatar
                                }
                              >
                                <Ionicons
                                  name="person-add-outline"
                                  size={
                                    17
                                  }
                                  color="#D99419"
                                />
                              </View>

                              <View
                                style={
                                  styles.requestNameContainer
                                }
                              >
                                <Text
                                  style={
                                    styles.requestName
                                  }
                                >
                                  {
                                    request.name
                                  }
                                </Text>

                                <Text
                                  style={
                                    styles.requestMeta
                                  }
                                >
                                  {request.requestedRole ===
                                  'CHILD'
                                    ? 'Child'
                                    : 'Parent'}
                                  {' • '}
                                  {new Date(
                                    request.requestedAt
                                  ).toLocaleDateString()}
                                </Text>
                              </View>
                            </View>

                            {canReviewRequest ? (
  <View style={styles.requestActions}>
    <Pressable
      disabled={isProcessing}
      style={styles.approveButton}
      onPress={() =>
        handleApprove(
          request.requestId
        )
      }
    >
      <Text style={styles.approveText}>
        {isProcessing
          ? 'Working...'
          : 'Approve'}
      </Text>
    </Pressable>

    <Pressable
      disabled={isProcessing}
      style={styles.rejectButton}
      onPress={() =>
        handleReject(
          request.requestId
        )
      }
    >
      <Text style={styles.rejectText}>
        Reject
      </Text>
    </Pressable>
  </View>
) : (
  <Text style={styles.requestMeta}>
    Owner approval required
  </Text>
)}

                            
                          </View>
                        );
                      }
                    )
                  )}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <AppBottomNav
        active="home"
        userType="PARENT"
      />
    </View>
  );
}