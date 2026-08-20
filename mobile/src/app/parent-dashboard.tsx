import { router } from 'expo-router';
import {
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
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
import { dashboardStyles } from '../styles/screens/dashboard.styles';

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

  const [joinRequests, setJoinRequests] =
    useState<JoinRequest[]>([]);

    const [familyMembers, setFamilyMembers] =
  useState<FamilyMember[]>([]);

const [loadingMembers, setLoadingMembers] =
  useState(true);

const [membersError, setMembersError] =
  useState('');

  const [loadingRequests, setLoadingRequests] =
    useState(true);

  const [requestError, setRequestError] =
    useState('');

  const [
    processingRequestId,
    setProcessingRequestId,
  ] = useState<string | null>(null);

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

useEffect(() => {
  if (family) {
    loadFamilyMembers();
  } else {
    setLoadingMembers(false);
  }
}, [family, token]);

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
    loadJoinRequests();
  }, [token]);

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

  return (
    <View style={dashboardStyles.screen}>
      <View style={dashboardStyles.page}>

        {/* Top navigation */}
        <View style={dashboardStyles.topBar}>
          <Text style={dashboardStyles.logo}>
            ChorePay
          </Text>

          <Pressable
            style={dashboardStyles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={dashboardStyles.logoutText}>
              Log out
            </Text>
          </Pressable>
        </View>

        {/* Welcome */}
        <View style={dashboardStyles.header}>
          <View style={dashboardStyles.roleBadge}>
            <Text
              style={
                dashboardStyles.roleBadgeText
              }
            >
              Parent
            </Text>
          </View>

          <Text style={dashboardStyles.welcome}>
            Welcome back, {user?.name} 👋
          </Text>

          <Text style={dashboardStyles.subtitle}>
            Manage your family, chores and rewards
            from one place.
          </Text>
        </View>

        {/* Family card */}
        <View
          style={[
            dashboardStyles.familyCard,
            isDesktop &&
              dashboardStyles.familyCardDesktop,
          ]}
        >
          {loadingFamily ? (
            <Text
              style={dashboardStyles.loadingText}
            >
              Loading your family...
            </Text>
          ) : familyError ? (
            <Text style={commonStyles.errorText}>
              {familyError}
            </Text>
          ) : family ? (
            <>
              <View
                style={dashboardStyles.familyInfo}
              >
                <Text
                  style={
                    dashboardStyles.sectionLabel
                  }
                >
                  YOUR FAMILY
                </Text>

                <Text
                  style={
                    dashboardStyles.familyName
                  }
                >
                  {family.name}
                </Text>

                <Text
                  style={dashboardStyles.cardText}
                >
                  Share the join code with family
                  members so they can request to
                  join.
                </Text>
              </View>

              <View
                style={
                  dashboardStyles.joinCodeSection
                }
              >
                <Text
                  style={
                    dashboardStyles.joinCodeLabel
                  }
                >
                  Family join code
                </Text>

                <View
                  style={
                    dashboardStyles.joinCodeBox
                  }
                >
                  <Text
                    style={
                      dashboardStyles.joinCode
                    }
                  >
                    {family.joinCode}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View
                style={dashboardStyles.familyInfo}
              >
                <Text
                  style={
                    dashboardStyles.sectionLabel
                  }
                >
                  YOUR FAMILY
                </Text>

                <Text
                  style={
                    dashboardStyles.familyName
                  }
                >
                  Get started
                </Text>

                <Text
                  style={dashboardStyles.cardText}
                >
                  Create a family to start
                  organising chores and rewards.
                </Text>
              </View>

              <Pressable
                style={[
                  commonStyles.primaryButton,
                  dashboardStyles.createFamilyButton,
                ]}
                onPress={() =>
                  router.push('/create-family')
                }
              >
                <Text
                  style={
                    commonStyles.primaryButtonText
                  }
                >
                  Create a family
                </Text>
              </Pressable>
            </>
          )}
        </View>

          {/* Family members */}
{family && (
  <View style={dashboardStyles.membersSection}>
    <Text style={dashboardStyles.sectionTitle}>
      Family members
    </Text>

    {membersError ? (
      <Text style={commonStyles.errorText}>
        {membersError}
      </Text>
    ) : loadingMembers ? (
      <Text style={dashboardStyles.emptyText}>
        Loading family members...
      </Text>
    ) : familyMembers.length === 0 ? (
      <Text style={dashboardStyles.emptyText}>
        No family members to show.
      </Text>
    ) : (
      <View style={dashboardStyles.membersGrid}>
        {familyMembers.map((member) => (
          <View
            key={member.userId}
            style={dashboardStyles.memberCard}
          >
            <View style={dashboardStyles.memberInfo}>
              <Text style={dashboardStyles.memberName}>
                {member.name}
              </Text>

              <Text style={dashboardStyles.memberJoined}>
                Joined{' '}
                {new Date(
                  member.joinedAt
                ).toLocaleDateString()}
              </Text>
            </View>

            <View
              style={
                dashboardStyles.memberRoleBadge
              }
            >
              <Text
                style={
                  dashboardStyles.memberRoleText
                }
              >
                {member.role === 'OWNER'
                  ? 'Owner'
                  : member.role === 'PARENT'
                    ? 'Parent'
                    : 'Child'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    )}
  </View>
)}
        {/* Join requests */}
        {family && (
          <View
            style={dashboardStyles.requestsSection}
          >
            <Text
              style={dashboardStyles.sectionTitle}
            >
              Join requests
            </Text>

            {requestError ? (
              <Text
                style={[
                  commonStyles.errorText,
                  dashboardStyles.requestError,
                ]}
              >
                {requestError}
              </Text>
            ) : null}

            {loadingRequests ? (
              <Text
                style={dashboardStyles.emptyText}
              >
                Loading requests...
              </Text>
            ) : joinRequests.length === 0 ? (
              <Text
                style={dashboardStyles.emptyText}
              >
                No pending join requests.
              </Text>
            ) : (
              joinRequests.map((request) => {
                const isProcessing =
                  processingRequestId ===
                  request.requestId;

                return (
                  <View
                    key={request.requestId}
                    style={
                      dashboardStyles.requestCard
                    }
                  >
                    <View
                      style={
                        dashboardStyles.requestTop
                      }
                    >
                      <Text
                        style={
                          dashboardStyles.requestName
                        }
                      >
                        {request.name}
                      </Text>

                      <Text
                        style={
                          dashboardStyles.requestRole
                        }
                      >
                        {request.requestedRole ===
                        'CHILD'
                          ? 'Child'
                          : 'Parent'}
                      </Text>
                    </View>

                    <Text
                      style={
                        dashboardStyles.requestDate
                      }
                    >
                      Requested{' '}
                      {new Date(
                        request.requestedAt
                      ).toLocaleDateString()}
                    </Text>

                    <View
                      style={
                        dashboardStyles.requestActions
                      }
                    >
                      <Pressable
                        disabled={isProcessing}
                        style={[
                          commonStyles.primaryButton,
                          dashboardStyles.requestButton,

                          isProcessing &&
                            commonStyles.loadingButton,
                        ]}
                        onPress={() =>
                          handleApprove(
                            request.requestId
                          )
                        }
                      >
                        <Text
                          style={
                            commonStyles.primaryButtonText
                          }
                        >
                          {isProcessing
                            ? 'Processing...'
                            : 'Approve'}
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled={isProcessing}
                        style={[
                          dashboardStyles.rejectButton,

                          isProcessing &&
                            commonStyles.loadingButton,
                        ]}
                        onPress={() =>
                          handleReject(
                            request.requestId
                          )
                        }
                      >
                        <Text
                          style={
                            dashboardStyles.rejectButtonText
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
        )}
      </View>
    </View>
  );
}