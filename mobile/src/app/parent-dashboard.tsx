import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppBottomNav } from '../components/AppBottomNav';

import {
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';

import {
  approveJoinRequest,
  Family,
  FamilyMember,
  getFamilyMembers,
  getJoinRequests,
  getMyFamily,
  JoinRequest,
  rejectJoinRequest,
} from '../services/family.service';

import { commonStyles } from '../styles/common.styles';

import { parentDashboardStyles as styles } from '../styles/screens/parent-dashboard.styles';

export default function ParentDashboardScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  const {
    user,
    token,
    signOut,
  } = useAuth();

  const [family, setFamily] =
    useState<Family | null>(null);

  const [loadingFamily, setLoadingFamily] =
    useState(true);

  const [familyError, setFamilyError] =
    useState('');

  const [familyMembers, setFamilyMembers] =
    useState<FamilyMember[]>([]);

  const [loadingMembers, setLoadingMembers] =
    useState(true);

  const [membersError, setMembersError] =
    useState('');

  const [joinRequests, setJoinRequests] =
    useState<JoinRequest[]>([]);

  const [loadingRequests, setLoadingRequests] =
    useState(true);

  const [requestError, setRequestError] =
    useState('');

  const [
    processingRequestId,
    setProcessingRequestId,
  ] = useState<string | null>(null);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';

  useEffect(() => {
    const loadFamily = async () => {
      if (!token) {
        return;
      }

      try {
        setLoadingFamily(true);
        setFamilyError('');

        const result =
          await getMyFamily(token);

        setFamily(result);
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
    };

    loadFamily();
  }, [token]);

  const loadFamilyMembers = async () => {
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

  const loadJoinRequests = async () => {
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

  useEffect(() => {
    if (!family) {
      setLoadingMembers(false);
      setLoadingRequests(false);
      return;
    }

    loadFamilyMembers();
    loadJoinRequests();
  }, [family, token]);

  const handleLogout = async () => {
    await signOut();

    router.replace('/login');
  };

  const handleApprove = async (
    requestId: string
  ) => {
    if (!token) {
      return;
    }

    try {
      setProcessingRequestId(requestId);
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

  const handleReject = async (
    requestId: string
  ) => {
    if (!token) {
      return;
    }

    try {
      setProcessingRequestId(requestId);
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
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.page}>

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
            <View
              style={styles.notificationButton}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#17152B"
              />

              {joinRequests.length > 0 && (
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
                    {joinRequests.length}
                  </Text>
                </View>
              )}
            </View>

            <Pressable
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={17}
                color="#6C5CE7"
              />

              {isDesktop && (
                <Text style={styles.logoutText}>
                  Log out
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* GREETING */}

        <View style={styles.header}>
  <Text style={styles.welcome}>
    {greeting}, {user?.name}! 👋
  </Text>

          <Text style={styles.subtitle}>
            Here's what's happening with your
            family today.
          </Text>
        </View>

        {familyError ? (
          <Text style={commonStyles.errorText}>
            {familyError}
          </Text>
        ) : null}

        {!family ? (
          /* NO FAMILY YET */

          <View style={styles.onboardingCard}>
            <View style={styles.onboardingIcon}>
              <Ionicons
                name="people-outline"
                size={34}
                color="#6C5CE7"
              />
            </View>

            <Text style={styles.onboardingTitle}>
              Create your family
            </Text>

            <Text style={styles.onboardingText}>
              Start your ChorePay family to assign
              chores, invite children and manage
              rewards from one place.
            </Text>

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
                Create family
              </Text>
            </Pressable>
          </View>
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
              <View style={styles.statCard}>
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
                  <Text style={styles.statNumber}>
                    {loadingMembers
                      ? '—'
                      : familyMembers.length}
                  </Text>

                  <Text style={styles.statLabel}>
                    Family members
                  </Text>
                </View>
              </View>

              <View style={styles.statCard}>
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
                  <Text style={styles.statNumber}>
                    0
                  </Text>

                  <Text style={styles.statLabel}>
                    Active chores
                  </Text>
                </View>
              </View>

              <View style={styles.statCard}>
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
                  <Text style={styles.statNumber}>
                    {loadingRequests
                      ? '—'
                      : joinRequests.length}
                  </Text>

                  <Text style={styles.statLabel}>
                    Need approval
                  </Text>
                </View>
              </View>
            </View>

            {/* TODAY + QUICK ACTIONS */}

            <View
              style={[
                styles.mainGrid,
                isDesktop &&
                  styles.mainGridDesktop,
              ]}
            >
              <View style={styles.choresCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Today's chores
                  </Text>

                  <View
                    style={styles.sectionCount}
                  >
                    <Text
                      style={
                        styles.sectionCountText
                      }
                    >
                      0
                    </Text>
                  </View>
                </View>

                <View style={styles.emptyChores}>
                  <View style={styles.emptyIcon}>
                    <Ionicons
                      name="sparkles-outline"
                      size={26}
                      color="#6C5CE7"
                    />
                  </View>

                  <Text style={styles.emptyTitle}>
                    No chores yet
                  </Text>

                  <Text style={styles.emptyText}>
                    Create your first chore and
                    assign it to someone in your
                    family.
                  </Text>
                </View>

                <Pressable
                  style={
                    styles.createChoreButton
                  }
                  onPress={() =>
                    router.push('/create-chore')
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

              <View
                style={styles.quickActionsCard}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Quick actions
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.quickAction,
                    styles.quickActionPrimary,
                  ]}
                  onPress={() =>
                    router.push('/create-chore')
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
                      Assign something new
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#6C5CE7"
                  />
                </Pressable>

                <View style={styles.quickAction}>
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

                <View style={styles.quickAction}>
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
              <View style={styles.familyPanel}>
                <View style={styles.familyHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>
                      Family
                    </Text>

                    <Text style={styles.familyName}>
                      {family.name}
                    </Text>

                    <Text style={styles.familyHint}>
                      {familyMembers.length}{' '}
                      {familyMembers.length === 1
                        ? 'member'
                        : 'members'}
                    </Text>
                  </View>

                  <View style={styles.joinCodeBox}>
                    <Text
                      style={
                        styles.joinCodeLabel
                      }
                    >
                      Join code
                    </Text>

                    <Text style={styles.joinCode}>
                      {family.joinCode}
                    </Text>
                  </View>
                </View>

                {membersError ? (
                  <Text style={styles.errorText}>
                    {membersError}
                  </Text>
                ) : loadingMembers ? (
                  <Text style={styles.emptyText}>
                    Loading family members...
                  </Text>
                ) : (
                  familyMembers.map((member) => (
                    <View
                      key={member.userId}
                      style={styles.memberRow}
                    >
                      <View
                        style={
                          styles.memberAvatar
                        }
                      >
                        <Ionicons
                          name="person-outline"
                          size={18}
                          color="#4B988E"
                        />
                      </View>

                      <View
                        style={styles.memberInfo}
                      >
                        <Text
                          style={styles.memberName}
                        >
                          {member.name}
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
                        style={styles.roleBadge}
                      >
                        <Text
                          style={styles.roleText}
                        >
                          {member.role === 'OWNER'
                            ? 'Owner'
                            : member.role ===
                                'PARENT'
                              ? 'Parent'
                              : 'Child'}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>

              <View
                style={styles.requestsPanel}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Join requests
                  </Text>

                  {joinRequests.length > 0 && (
                    <View
                      style={styles.sectionCount}
                    >
                      <Text
                        style={
                          styles.sectionCountText
                        }
                      >
                        {joinRequests.length}
                      </Text>
                    </View>
                  )}
                </View>

                {requestError ? (
                  <Text style={styles.errorText}>
                    {requestError}
                  </Text>
                ) : loadingRequests ? (
                  <Text style={styles.emptyText}>
                    Loading requests...
                  </Text>
                ) : joinRequests.length === 0 ? (
                  <View style={styles.noRequests}>
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
                      No pending requests. You're
                      all caught up!
                    </Text>
                  </View>
                ) : (
                  joinRequests.map((request) => {
                    const isProcessing =
                      processingRequestId ===
                      request.requestId;

                    return (
                      <View
                        key={request.requestId}
                        style={styles.requestCard}
                      >
                        <View
                          style={styles.requestTop}
                        >
                          <View
                            style={
                              styles.requestAvatar
                            }
                          >
                            <Ionicons
                              name="person-add-outline"
                              size={17}
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
                              {request.name}
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

                        <View
                          style={
                            styles.requestActions
                          }
                        >
                          <Pressable
                            disabled={isProcessing}
                            style={
                              styles.approveButton
                            }
                            onPress={() =>
                              handleApprove(
                                request.requestId
                              )
                            }
                          >
                            <Text
                              style={
                                styles.approveText
                              }
                            >
                              {isProcessing
                                ? 'Working...'
                                : 'Approve'}
                            </Text>
                          </Pressable>

                          <Pressable
                            disabled={isProcessing}
                            style={
                              styles.rejectButton
                            }
                            onPress={() =>
                              handleReject(
                                request.requestId
                              )
                            }
                          >
                            <Text
                              style={
                                styles.rejectText
                              }
                            >
                              Reject
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    );
                  })
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