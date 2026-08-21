import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
  useEffect,
  useMemo,
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
  getFamilyAssignments,
  ParentChoreAssignment,
} from '../services/chore.service';

import {
  choresStyles as styles,
} from '../styles/screens/chores.styles';

type ChoreFilter =
  | 'ALL'
  | 'ACTIVE'
  | 'WAITING'
  | 'COMPLETED';

export default function ChoresScreen() {
  const {
    token,
  } = useAuth();

  const [
    assignments,
    setAssignments,
  ] = useState<ParentChoreAssignment[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    filter,
    setFilter,
  ] = useState<ChoreFilter>('ALL');

  const loadChores = async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result =
        await getFamilyAssignments(token);

      setAssignments(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Could not load family chores.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChores();
  }, [token]);

  const filteredAssignments =
    useMemo(() => {
      switch (filter) {
        case 'ACTIVE':
          return assignments.filter(
            (assignment) =>
              assignment.status ===
                'ASSIGNED' ||
              assignment.status ===
                'REJECTED' ||
              assignment.status ===
                'OVERDUE'
          );

        case 'WAITING':
          return assignments.filter(
            (assignment) =>
              assignment.status ===
              'SUBMITTED'
          );

        case 'COMPLETED':
          return assignments.filter(
            (assignment) =>
              assignment.status ===
              'APPROVED'
          );

        case 'ALL':
        default:
          return assignments.filter(
            (assignment) =>
              assignment.status !==
              'CANCELLED'
          );
      }
    }, [assignments, filter]);

  const formatDueDate = (
    dueAt: string | null
  ) => {
    if (!dueAt) {
      return 'No due date';
    }

    return new Date(
      dueAt
    ).toLocaleString([], {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (
    status:
      ParentChoreAssignment['status']
  ) => {
    switch (status) {
      case 'ASSIGNED':
        return 'TO DO';

      case 'SUBMITTED':
        return 'WAITING';

      case 'APPROVED':
        return 'COMPLETED';

      case 'REJECTED':
        return 'NEEDS CHANGES';

      case 'OVERDUE':
        return 'OVERDUE';

      case 'CANCELLED':
        return 'CANCELLED';

      default:
        return status;
    }
  };

  const getStatusType = (
    status:
      ParentChoreAssignment['status']
  ) => {
    if (
      status === 'SUBMITTED'
    ) {
      return 'waiting';
    }

    if (
      status === 'APPROVED'
    ) {
      return 'completed';
    }

    if (
      status === 'REJECTED' ||
      status === 'OVERDUE'
    ) {
      return 'danger';
    }

    return 'active';
  };

  const filters: {
    key: ChoreFilter;
    label: string;
  }[] = [
    {
      key: 'ALL',
      label: 'All',
    },
    {
      key: 'ACTIVE',
      label: 'Active',
    },
    {
      key: 'WAITING',
      label: 'Waiting',
    },
    {
      key: 'COMPLETED',
      label: 'Completed',
    },
  ];

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
                style={
                  styles.brandPay
                }
              >
                PAY
              </Text>
            </View>

            <Pressable
              style={
                styles.createButtonTop
              }
              onPress={() =>
                router.push(
                  '/create-chore'
                )
              }
            >
              <Ionicons
                name="add"
                size={19}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.createButtonText
                }
              >
                Create chore
              </Text>
            </Pressable>
          </View>

          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.title}>
              Chores
            </Text>

            <Text
              style={styles.subtitle}
            >
              View and manage chores
              created for your family.
            </Text>
          </View>

          {/* SUMMARY */}

          <View
            style={styles.summaryRow}
          >
            <View
              style={styles.summaryCard}
            >
              <View
                style={[
                  styles.summaryIcon,
                  styles.purpleIcon,
                ]}
              >
                <Ionicons
                  name="clipboard-outline"
                  size={22}
                  color="#6C5CE7"
                />
              </View>

              <View>
                <Text
                  style={
                    styles.summaryNumber
                  }
                >
                  {
                    assignments.filter(
                      (assignment) =>
                        assignment.status !==
                          'APPROVED' &&
                        assignment.status !==
                          'CANCELLED'
                    ).length
                  }
                </Text>

                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Active
                </Text>
              </View>
            </View>

            <View
              style={styles.summaryCard}
            >
              <View
                style={[
                  styles.summaryIcon,
                  styles.orangeIcon,
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={22}
                  color="#D99419"
                />
              </View>

              <View>
                <Text
                  style={
                    styles.summaryNumber
                  }
                >
                  {
                    assignments.filter(
                      (assignment) =>
                        assignment.status ===
                        'SUBMITTED'
                    ).length
                  }
                </Text>

                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Waiting
                </Text>
              </View>
            </View>

            <View
              style={styles.summaryCard}
            >
              <View
                style={[
                  styles.summaryIcon,
                  styles.tealIcon,
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#4B988E"
                />
              </View>

              <View>
                <Text
                  style={
                    styles.summaryNumber
                  }
                >
                  {
                    assignments.filter(
                      (assignment) =>
                        assignment.status ===
                        'APPROVED'
                    ).length
                  }
                </Text>

                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Completed
                </Text>
              </View>
            </View>
          </View>

          {/* FILTERS */}

          <View
            style={styles.filterRow}
          >
            {filters.map(
              (option) => {
                const selected =
                  filter === option.key;

                return (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.filterButton,

                      selected &&
                        styles.filterButtonSelected,
                    ]}
                    onPress={() =>
                      setFilter(
                        option.key
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filterText,

                        selected &&
                          styles.filterTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>

          {/* CHORE LIST */}

          <View style={styles.card}>
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
                {filter === 'ALL'
                  ? 'All chores'
                  : filter === 'ACTIVE'
                    ? 'Active chores'
                    : filter ===
                        'WAITING'
                      ? 'Waiting for approval'
                      : 'Completed chores'}
              </Text>

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
                    filteredAssignments.length
                  }
                </Text>
              </View>
            </View>

            {error ? (
              <View
                style={styles.errorBox}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#C0392B"
                />

                <Text
                  style={
                    styles.errorText
                  }
                >
                  {error}
                </Text>
              </View>
            ) : loading ? (
              <View
                style={
                  styles.emptyState
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
            ) : filteredAssignments.length ===
              0 ? (
              <View
                style={
                  styles.emptyState
                }
              >
                <View
                  style={
                    styles.emptyIcon
                  }
                >
                  <Ionicons
                    name="sparkles-outline"
                    size={28}
                    color="#6C5CE7"
                  />
                </View>

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No chores here
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Create a chore and assign
                  it to someone in your
                  family.
                </Text>
              </View>
            ) : (
              <View
                style={
                  styles.choreList
                }
              >
                {filteredAssignments.map(
                  (assignment) => {
                    const statusType =
                      getStatusType(
                        assignment.status
                      );

                    return (
                      <Pressable
                        key={
                          assignment.assignmentId
                        }
                        style={
                          styles.choreCard
                        }
                      >
                        <View
                          style={
                            styles.choreIcon
                          }
                        >
                          <Ionicons
                            name="clipboard-outline"
                            size={22}
                            color="#6C5CE7"
                          />
                        </View>

                        <View
                          style={
                            styles.choreContent
                          }
                        >
                          <View
                            style={
                              styles.choreTop
                            }
                          >
                            <View
                              style={
                                styles.choreTitleArea
                              }
                            >
                              <Text
                                style={
                                  styles.choreTitle
                                }
                              >
                                {
                                  assignment.title
                                }
                              </Text>

                              {assignment.description ? (
                                <Text
                                  numberOfLines={
                                    1
                                  }
                                  style={
                                    styles.choreDescription
                                  }
                                >
                                  {
                                    assignment.description
                                  }
                                </Text>
                              ) : null}
                            </View>

                            <View
                              style={[
                                styles.statusBadge,

                                statusType ===
                                  'waiting' &&
                                  styles.waitingBadge,

                                statusType ===
                                  'completed' &&
                                  styles.completedBadge,

                                statusType ===
                                  'danger' &&
                                  styles.dangerBadge,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.statusText,

                                  statusType ===
                                    'waiting' &&
                                    styles.waitingText,

                                  statusType ===
                                    'completed' &&
                                    styles.completedText,

                                  statusType ===
                                    'danger' &&
                                    styles.dangerText,
                                ]}
                              >
                                {getStatusLabel(
                                  assignment.status
                                )}
                              </Text>
                            </View>
                          </View>

                          {/* Creator will be connected next */}

                          <View
                            style={
                              styles.createdByRow
                            }
                          >
                            <Ionicons
                              name="person-outline"
                              size={13}
                              color="#6F6B7D"
                            />

                            <Text style={styles.createdByText}>
  Created by {assignment.createdByName}
</Text>
                          </View>

                          <View
                            style={
                              styles.metaRow
                            }
                          >
                            <View
                              style={
                                styles.metaItem
                              }
                            >
                              <Ionicons
                                name="ellipse"
                                size={9}
                                color="#F4B84A"
                              />

                              <Text
                                style={
                                  styles.rewardText
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
                                styles.metaItem
                              }
                            >
                              <Ionicons
                                name="star"
                                size={12}
                                color="#6C5CE7"
                              />

                              <Text
                                style={
                                  styles.metaText
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
                                styles.metaItem
                              }
                            >
                              <Ionicons
                                name="people-outline"
                                size={13}
                                color="#6F6B7D"
                              />

                              <Text
                                style={
                                  styles.metaText
                                }
                              >
                                {
                                  assignment
                                    .participants
                                    .length
                                }{' '}
                                {assignment
                                  .participants
                                  .length === 1
                                  ? 'child'
                                  : 'children'}
                              </Text>
                            </View>

                            <View
                              style={
                                styles.metaItem
                              }
                            >
                              <Ionicons
                                name="time-outline"
                                size={13}
                                color="#6F6B7D"
                              />

                              <Text
                                style={
                                  styles.metaText
                                }
                              >
                                {formatDueDate(
                                  assignment.dueAt
                                )}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="#A7A1B0"
                        />
                      </Pressable>
                    );
                  }
                )}
              </View>
            )}

            <Pressable
              style={
                styles.createButton
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
                  styles.createButtonText
                }
              >
                Create chore
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <AppBottomNav
        active="chores"
        userType="PARENT"
      />
    </View>
  );
}