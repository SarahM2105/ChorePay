import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppBottomNav } from '../components/AppBottomNav';

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

import {
  familyStyles as styles,
} from '../styles/screens/family.styles';

export default function FamilyScreen() {
  const {
    user,
    token,
  } = useAuth();

  const [
    family,
    setFamily,
  ] = useState<Family | null>(null);

  const [
    members,
    setMembers,
  ] = useState<FamilyMember[]>([]);

  const [
    requests,
    setRequests,
  ] = useState<JoinRequest[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    processingRequestId,
    setProcessingRequestId,
  ] = useState<string | null>(null);

  const loadFamilyPage = async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const familyResult =
        await getMyFamily(token);

      setFamily(familyResult);

      if (!familyResult) {
        setMembers([]);
        setRequests([]);

        return;
      }

      const [
        memberResults,
        requestResults,
      ] = await Promise.all([
        getFamilyMembers(token),
        getJoinRequests(token),
      ]);

      setMembers(memberResults);
      setRequests(requestResults);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Could not load family.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilyPage();
  }, [token]);

  const currentMember =
    members.find(
      (member) =>
        member.userId === user?.id
    );

  const isOwner =
    currentMember?.role === 'OWNER';

  const handleApprove = async (
    request: JoinRequest
  ) => {
    if (!token) {
      return;
    }

    /*
     * UI rule:
     * another parent must be approved
     * by the OWNER.
     *
     * We will enforce this in the
     * backend next as well.
     */

    if (
      request.requestedRole ===
        'PARENT' &&
      !isOwner
    ) {
      setError(
        'Only the family owner can approve another parent.'
      );

      return;
    }

    try {
      setProcessingRequestId(
        request.requestId
      );

      setError('');

      await approveJoinRequest(
        request.requestId,
        token
      );

      await loadFamilyPage();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
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
      setProcessingRequestId(
        requestId
      );

      setError('');

      await rejectJoinRequest(
        requestId,
        token
      );

      await loadFamilyPage();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Could not reject request.'
        );
      }
    } finally {
      setProcessingRequestId(null);
    }
  };

  const getRoleLabel = (
    role: FamilyMember['role']
  ) => {
    if (role === 'OWNER') {
      return 'Owner';
    }

    if (role === 'PARENT') {
      return 'Parent';
    }

    return 'Child';
  };

  const getRoleIcon = (
    role: FamilyMember['role']
  ) => {
    if (role === 'OWNER') {
      return 'star';
    }

    if (role === 'PARENT') {
      return 'person';
    }

    return 'happy-outline';
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingText}>
          Loading family...
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

            <Pressable
              style={styles.backButton}
              onPress={() =>
                router.replace(
                  '/parent-dashboard'
                )
              }
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color="#6C5CE7"
              />

              <Text
                style={styles.backText}
              >
                Home
              </Text>
            </Pressable>
          </View>

          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.title}>
              Family
            </Text>

            <Text
              style={styles.subtitle}
            >
              Manage the people in your
              ChorePay family.
            </Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color="#C0392B"
              />

              <Text
                style={styles.errorText}
              >
                {error}
              </Text>
            </View>
          ) : null}

          {!family ? (
            <View
              style={styles.emptyCard}
            >
              <Ionicons
                name="people-outline"
                size={38}
                color="#6C5CE7"
              />

              <Text
                style={styles.emptyTitle}
              >
                No family yet
              </Text>

              <Text
                style={styles.emptyText}
              >
                Create a family before
                managing members.
              </Text>

              <Pressable
                style={
                  styles.primaryButton
                }
                onPress={() =>
                  router.push(
                    '/create-family'
                  )
                }
              >
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Create family
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* FAMILY HERO */}

              <View
                style={
                  styles.familyHero
                }
              >
                <View
                  style={
                    styles.familyHeroTop
                  }
                >
                  <View
                    style={
                      styles.familyIcon
                    }
                  >
                    <Ionicons
                      name="people"
                      size={28}
                      color="#6C5CE7"
                    />
                  </View>

                  <View
                    style={
                      styles.familyHeroInfo
                    }
                  >
                    <Text
                      style={
                        styles.familyName
                      }
                    >
                      {family.name}
                    </Text>

                    <Text
                      style={
                        styles.familyMeta
                      }
                    >
                      {members.length}{' '}
                      {members.length === 1
                        ? 'member'
                        : 'members'}
                    </Text>
                  </View>

                  {isOwner && (
                    <View
                      style={
                        styles.ownerBadge
                      }
                    >
                      <Ionicons
                        name="star"
                        size={12}
                        color="#6C5CE7"
                      />

                      <Text
                        style={
                          styles.ownerBadgeText
                        }
                      >
                        You own this family
                      </Text>
                    </View>
                  )}
                </View>

                {/* JOIN CODE */}

                <View
                  style={
                    styles.codeCard
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.codeLabel
                      }
                    >
                      Family join code
                    </Text>

                    <Text
                      style={
                        styles.codeHint
                      }
                    >
                      Share this with
                      someone you want to
                      invite.
                    </Text>
                  </View>

                  <View
                    style={
                      styles.codeBox
                    }
                  >
                    <Ionicons
                      name="key-outline"
                      size={18}
                      color="#4B988E"
                    />

                    <Text
                      style={
                        styles.codeText
                      }
                    >
                      {family.joinCode}
                    </Text>
                  </View>
                </View>
              </View>

              {/* MEMBERS */}

              <View
                style={styles.card}
              >
                <View
                  style={
                    styles.sectionHeader
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      Members
                    </Text>

                    <Text
                      style={
                        styles.sectionSubtitle
                      }
                    >
                      Everyone currently in
                      this family.
                    </Text>
                  </View>

                  <View
                    style={
                      styles.countBadge
                    }
                  >
                    <Text
                      style={
                        styles.countText
                      }
                    >
                      {members.length}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.membersList
                  }
                >
                  {members.map(
                    (member) => {
                      const isYou =
                        member.userId ===
                        user?.id;

                      return (
                        <View
                          key={
                            member.userId
                          }
                          style={
                            styles.memberRow
                          }
                        >
                          <View
                            style={[
                              styles.avatar,

                              member.role ===
                                'OWNER' &&
                                styles.ownerAvatar,
                            ]}
                          >
                            <Ionicons
                              name={
                                getRoleIcon(
                                  member.role
                                ) as any
                              }
                              size={20}
                              color={
                                member.role ===
                                'OWNER'
                                  ? '#6C5CE7'
                                  : '#4B988E'
                              }
                            />
                          </View>

                          <View
                            style={
                              styles.memberInfo
                            }
                          >
                            <View
                              style={
                                styles.nameRow
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

                              {isYou && (
                                <Text
                                  style={
                                    styles.youText
                                  }
                                >
                                  You
                                </Text>
                              )}
                            </View>

                            <Text
                              style={
                                styles.joinedText
                              }
                            >
                              Joined{' '}
                              {new Date(
                                member.joinedAt
                              ).toLocaleDateString()}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.roleBadge,

                              member.role ===
                                'OWNER' &&
                                styles.ownerRoleBadge,
                            ]}
                          >
                            <Text
                              style={[
                                styles.roleText,

                                member.role ===
                                  'OWNER' &&
                                  styles.ownerRoleText,
                              ]}
                            >
                              {getRoleLabel(
                                member.role
                              )}
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  )}
                </View>
              </View>

              {/* JOIN REQUESTS */}

              <View
                style={styles.card}
              >
                <View
                  style={
                    styles.sectionHeader
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      Pending requests
                    </Text>

                    <Text
                      style={
                        styles.sectionSubtitle
                      }
                    >
                      People waiting to
                      join your family.
                    </Text>
                  </View>

                  {requests.length >
                    0 && (
                    <View
                      style={
                        styles.countBadge
                      }
                    >
                      <Text
                        style={
                          styles.countText
                        }
                      >
                        {
                          requests.length
                        }
                      </Text>
                    </View>
                  )}
                </View>

                {requests.length ===
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
                        styles.noRequestsTitle
                      }
                    >
                      You're all caught up
                    </Text>

                    <Text
                      style={
                        styles.noRequestsText
                      }
                    >
                      There are no pending
                      family requests.
                    </Text>
                  </View>
                ) : (
                  <View
                    style={
                      styles.requestList
                    }
                  >
                    {requests.map(
                      (request) => {
                        const processing =
                          processingRequestId ===
                          request.requestId;

                        const parentRequest =
                          request.requestedRole ===
                          'PARENT';

                        const canApprove =
                          !parentRequest ||
                          isOwner;

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
                                  size={20}
                                  color="#D99419"
                                />
                              </View>

                              <View
                                style={
                                  styles.requestInfo
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
                                  Wants to join
                                  as{' '}
                                  {parentRequest
                                    ? 'Parent'
                                    : 'Child'}
                                </Text>
                              </View>

                              <View
                                style={[
                                  styles.requestRoleBadge,

                                  parentRequest &&
                                    styles.parentRequestBadge,
                                ]}
                              >
                                <Text
                                  style={
                                    styles.requestRoleText
                                  }
                                >
                                  {parentRequest
                                    ? 'Parent'
                                    : 'Child'}
                                </Text>
                              </View>
                            </View>

                            {parentRequest &&
                              !isOwner && (
                                <View
                                  style={
                                    styles.ownerOnlyNotice
                                  }
                                >
                                  <Ionicons
                                    name="lock-closed-outline"
                                    size={
                                      15
                                    }
                                    color="#6F6B7D"
                                  />

                                  <Text
                                    style={
                                      styles.ownerOnlyText
                                    }
                                  >
                                    Owner
                                    approval
                                    required
                                  </Text>
                                </View>
                              )}

                            <View
                              style={
                                styles.requestActions
                              }
                            >
                              {canApprove && (
  <>
    <Pressable
      disabled={processing}
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

    <Pressable
      disabled={processing}
      style={styles.approveButton}
      onPress={() =>
        handleApprove(request)
      }
    >
      <Text style={styles.approveText}>
        {processing
          ? 'Working...'
          : 'Approve'}
      </Text>
    </Pressable>
  </>
)}
                            </View>
                          </View>
                        );
                      }
                    )}
                  </View>
                )}
              </View>

              {/* OWNER SETTINGS PLACEHOLDER */}

              {isOwner && (
                <View
                  style={
                    styles.ownerSettings
                  }
                >
                  <View
                    style={
                      styles.ownerSettingsIcon
                    }
                  >
                    <Ionicons
                      name="settings-outline"
                      size={22}
                      color="#6C5CE7"
                    />
                  </View>

                  <View
                    style={
                      styles.ownerSettingsInfo
                    }
                  >
                    <Text
                      style={
                        styles.ownerSettingsTitle
                      }
                    >
                      Family settings
                    </Text>

                    <Text
                      style={
                        styles.ownerSettingsText
                      }
                    >
                      As the owner, you'll
                      be able to manage
                      parents, children and
                      family settings here.
                    </Text>
                  </View>

                  <View
                    style={
                      styles.comingSoonBadge
                    }
                  >
                    <Text
                      style={
                        styles.comingSoonText
                      }
                    >
                      Next
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <AppBottomNav
        active="family"
        userType="PARENT"
      />
    </View>
  );
}