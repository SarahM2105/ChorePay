import { router } from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';

import {
  assignChore,
  ChoreDifficulty,
  ChoreTemplate,
  createChoreTemplate,
} from '../services/chore.service';

import {
  FamilyMember,
  getFamilyMembers,
} from '../services/family.service';

import { commonStyles } from '../styles/common.styles';

import {
  createChoreStyles,
} from '../styles/screens/create-chore.styles';
import { DueDateTimePicker } from '@/components/DueDateTimePicker.web';

const durationOptions = [
  10,
  20,
  30,
  45,
  60,
];

export default function CreateChoreScreen() {
  const { token } = useAuth();

  /*
   * BASIC CHORE DETAILS
   */

  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [difficulty, setDifficulty] =
    useState<ChoreDifficulty>('EASY');

  const [
    estimatedMinutes,
    setEstimatedMinutes,
  ] = useState('');

  const [
    moneyReward,
    setMoneyReward,
  ] = useState('');

  /*
   * OPTIONAL REQUIREMENTS
   */

  const [
    photoRequired,
    setPhotoRequired,
  ] = useState(false);

  const [
    commentRequired,
    setCommentRequired,
  ] = useState(false);

  /*
   * ADVANCED OPTIONS
   */

  const [
    showAdvanced,
    setShowAdvanced,
  ] = useState(false);

  const [
    latePenalty,
    setLatePenalty,
  ] = useState('');

  const [
    resubmissionPenalty,
    setResubmissionPenalty,
  ] = useState('');

  /*
   * TEMPLATE CREATION
   */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [
    createdChore,
    setCreatedChore,
  ] = useState<ChoreTemplate | null>(
    null
  );

  /*
   * ASSIGNMENT
   */

  const [
    familyMembers,
    setFamilyMembers,
  ] = useState<FamilyMember[]>([]);

  const [
    selectedChildren,
    setSelectedChildren,
  ] = useState<string[]>([]);

  const [
    loadingChildren,
    setLoadingChildren,
  ] = useState(false);

  const [
    assigning,
    setAssigning,
  ] = useState(false);

  const [
    assignmentError,
    setAssignmentError,
  ] = useState('');

  const [
    assigned,
    setAssigned,
  ] = useState(false);

  const [
    dueDate,
    setDueDate,
  ] = useState('');

  const [
    dueTime,
    setDueTime,
  ] = useState('');

  /*
   * LIVE REWARD PREVIEW
   *
   * This mirrors the backend formula.
   *
   * The backend remains the real
   * authority for rewards.
   */

  const calculatePreviewCoins = () => {
    const minutes =
      Number(estimatedMinutes);

    if (
      Number.isNaN(minutes) ||
      minutes < 1
    ) {
      return 0;
    }

    const baseCoins =
      Math.ceil(
        minutes / 10
      ) * 5;

    const multiplier =
      difficulty === 'EASY'
        ? 1
        : difficulty === 'MEDIUM'
          ? 1.25
          : 1.5;

    const calculatedCoins =
      Math.round(
        baseCoins * multiplier
      );

    const roundedCoins =
      Math.round(
        calculatedCoins / 5
      ) * 5;

    return Math.max(
      5,
      roundedCoins
    );
  };

  const previewCoins =
    calculatePreviewCoins();

  const previewXp =
    previewCoins;

  /*
   * CREATE TEMPLATE
   */

  const handleCreateChore =
    async () => {
      setError('');

      if (!title.trim()) {
        setError(
          'Please enter a chore title.'
        );

        return;
      }

      if (!estimatedMinutes.trim()) {
        setError(
          'Choose how long the chore should take.'
        );

        return;
      }

      const minutes =
        Number(estimatedMinutes);

      if (
        Number.isNaN(minutes) ||
        minutes < 1
      ) {
        setError(
          'Estimated time must be at least 1 minute.'
        );

        return;
      }

      if (moneyReward) {
        const money =
          Number(moneyReward);

        if (
          Number.isNaN(money) ||
          money < 0
        ) {
          setError(
            'Money reward must be 0 or more.'
          );

          return;
        }
      }

      if (
        latePenalty &&
        (
          Number(latePenalty) < 0 ||
          Number(latePenalty) > 100
        )
      ) {
        setError(
          'Late penalty must be between 0 and 100.'
        );

        return;
      }

      if (
        resubmissionPenalty &&
        (
          Number(
            resubmissionPenalty
          ) < 0 ||
          Number(
            resubmissionPenalty
          ) > 100
        )
      ) {
        setError(
          'Resubmission penalty must be between 0 and 100.'
        );

        return;
      }

      if (!token) {
        setError(
          'Your session has expired. Please log in again.'
        );

        return;
      }

      try {
        setLoading(true);

        const chore =
          await createChoreTemplate(
            {
              title:
                title.trim(),

              description:
                description.trim() ||
                undefined,

              category:
                category.trim() ||
                undefined,

              difficulty,

              estimatedMinutes:
                minutes,

              moneyRewardPence:
                moneyReward
                  ? Math.round(
                      Number(
                        moneyReward
                      ) * 100
                    )
                  : undefined,

              latePenaltyPercent:
                latePenalty
                  ? Number(
                      latePenalty
                    )
                  : undefined,

              resubmissionPenaltyPercent:
                resubmissionPenalty
                  ? Number(
                      resubmissionPenalty
                    )
                  : undefined,

              photoRequired,

              commentRequired,
            },

            token
          );

        setCreatedChore(chore);
      } catch (err) {
        if (
          err instanceof Error
        ) {
          setError(err.message);
        } else {
          setError(
            'Something went wrong.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

  /*
   * LOAD CHILDREN ONCE THE
   * TEMPLATE HAS BEEN CREATED
   */

  useEffect(() => {
    const loadChildren =
      async () => {
        if (
          !token ||
          !createdChore
        ) {
          return;
        }

        try {
          setLoadingChildren(true);

          setAssignmentError('');

          const members =
            await getFamilyMembers(
              token
            );

          const children =
            members.filter(
              (member) =>
                member.role ===
                'CHILD'
            );

          setFamilyMembers(
            children
          );
        } catch (err) {
          if (
            err instanceof Error
          ) {
            setAssignmentError(
              err.message
            );
          } else {
            setAssignmentError(
              'Could not load family members.'
            );
          }
        } finally {
          setLoadingChildren(false);
        }
      };

    loadChildren();
  }, [createdChore, token]);

  /*
   * CHILD SELECTION
   */

  const toggleChild = (
    userId: string
  ) => {
    setSelectedChildren(
      (current) => {
        if (
          current.includes(userId)
        ) {
          return current.filter(
            (id) =>
              id !== userId
          );
        }

        return [
          ...current,
          userId,
        ];
      }
    );
  };

  /*
   * ASSIGN CHORE
   */

  const handleAssignChore =
    async () => {
      if (
        !createdChore ||
        !token
      ) {
        return;
      }

      setAssignmentError('');

      if (
        selectedChildren.length ===
        0
      ) {
        setAssignmentError(
          'Choose at least one child.'
        );

        return;
      }

      let dueAt:
        | string
        | undefined;

      if (
        dueDate ||
        dueTime
      ) {
        if (
          !dueDate ||
          !dueTime
        ) {
          setAssignmentError(
            'Enter both a due date and time.'
          );

          return;
        }

        const parsedDate =
          new Date(
            `${dueDate}T${dueTime}:00`
          );

        if (
          Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          setAssignmentError(
            'Enter a valid due date and time.'
          );

          return;
        }

        if (
          parsedDate.getTime() <
          Date.now()
        ) {
          setAssignmentError(
            'Due date must be in the future.'
          );

          return;
        }

        dueAt =
          parsedDate.toISOString();
      }

      try {
        setAssigning(true);

        await assignChore(
          {
            templateId:
              createdChore.id,

            childUserIds:
              selectedChildren,

            dueAt,
          },

          token
        );

        setAssigned(true);
      } catch (err) {
        if (
          err instanceof Error
        ) {
          setAssignmentError(
            err.message
          );
        } else {
          setAssignmentError(
            'Could not assign chore.'
          );
        }
      } finally {
        setAssigning(false);
      }
    };

  return (
    <ScrollView
      style={
        createChoreStyles.screen
      }
      contentContainerStyle={
        createChoreStyles.scrollContent
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={
          createChoreStyles.page
        }
      >
        {/* TOP BAR */}

        <View
          style={
            createChoreStyles.topBar
          }
        >
          <View
            style={
              createChoreStyles.brand
            }
          >
            <Text
              style={
                createChoreStyles.brandChore
              }
            >
              CHORE
            </Text>

            <Text
              style={
                createChoreStyles.brandPay
              }
            >
              PAY
            </Text>
          </View>

          <Pressable
            style={
              createChoreStyles.backButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                commonStyles.linkText
              }
            >
              ← Back
            </Text>
          </Pressable>
        </View>

        {!createdChore ? (
          <>
            {/* STEP 1 */}

            <Text
              style={
                createChoreStyles.title
              }
            >
              Create a chore
            </Text>

            <Text
              style={
                createChoreStyles.subtitle
              }
            >
              Tell ChorePay what needs
              doing. We'll work out a
              fair game reward for you.
            </Text>

            <View
              style={
                createChoreStyles.formCard
              }
            >
              {/* TITLE */}

              <View>
                <Text
                  style={
                    commonStyles.fieldLabel
                  }
                >
                  What needs doing?
                </Text>

                <TextInput
                  style={
                    commonStyles.input
                  }
                  value={title}
                  onChangeText={
                    setTitle
                  }
                  placeholder="e.g. Clean your bedroom"
                  maxLength={120}
                />
              </View>

              {/* DESCRIPTION */}

              <View>
                <Text
                  style={
                    commonStyles.fieldLabel
                  }
                >
                  Instructions
                  (optional)
                </Text>

                <TextInput
                  style={[
                    commonStyles.input,
                    createChoreStyles.textArea,
                  ]}
                  value={
                    description
                  }
                  onChangeText={
                    setDescription
                  }
                  placeholder="e.g. Make the bed and put clothes away"
                  multiline
                />
              </View>

              {/* CATEGORY */}

              <View>
                <Text
                  style={
                    commonStyles.fieldLabel
                  }
                >
                  Category
                  (optional)
                </Text>

                <TextInput
                  style={
                    commonStyles.input
                  }
                  value={category}
                  onChangeText={
                    setCategory
                  }
                  placeholder="e.g. Bedroom"
                />
              </View>

              {/* DIFFICULTY */}

              <View>
                <Text
                  style={
                    commonStyles.fieldLabel
                  }
                >
                  How difficult is it?
                </Text>

                <View
                  style={
                    createChoreStyles.difficultyRow
                  }
                >
                  {(
                    [
                      'EASY',
                      'MEDIUM',
                      'HARD',
                    ] as ChoreDifficulty[]
                  ).map(
                    (option) => {
                      const selected =
                        difficulty ===
                        option;

                      return (
                        <Pressable
                          key={
                            option
                          }
                          style={[
                            createChoreStyles.difficultyButton,

                            selected &&
                              createChoreStyles.difficultySelected,
                          ]}
                          onPress={() =>
                            setDifficulty(
                              option
                            )
                          }
                        >
                          <Text
                            style={[
                              createChoreStyles.difficultyText,

                              selected &&
                                createChoreStyles.difficultySelectedText,
                            ]}
                          >
                            {option ===
                            'EASY'
                              ? 'Easy'
                              : option ===
                                  'MEDIUM'
                                ? 'Medium'
                                : 'Hard'}
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </View>

              {/* DURATION */}

              <View>
                <Text
                  style={
                    commonStyles.fieldLabel
                  }
                >
                  How long will it take?
                </Text>

                <View
                  style={
                    createChoreStyles.durationRow
                  }
                >
                  {durationOptions.map(
                    (minutes) => {
                      const selected =
                        estimatedMinutes ===
                        String(minutes);

                      return (
                        <Pressable
                          key={
                            minutes
                          }
                          style={[
                            createChoreStyles.durationButton,

                            selected &&
                              createChoreStyles.durationButtonSelected,
                          ]}
                          onPress={() =>
                            setEstimatedMinutes(
                              String(
                                minutes
                              )
                            )
                          }
                        >
                          <Text
                            style={[
                              createChoreStyles.durationText,

                              selected &&
                                createChoreStyles.durationTextSelected,
                            ]}
                          >
                            {minutes} min
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>

                <Text
                  style={
                    createChoreStyles.customTimeLabel
                  }
                >
                  Or enter a custom time
                </Text>

                <TextInput
                  style={
                    commonStyles.input
                  }
                  value={
                    estimatedMinutes
                  }
                  onChangeText={
                    setEstimatedMinutes
                  }
                  placeholder="Minutes"
                  keyboardType="number-pad"
                />
              </View>

              {/* AUTO REWARD */}

              <View
                style={
                  createChoreStyles.rewardCard
                }
              >
                <View
                  style={
                    createChoreStyles.rewardHeader
                  }
                >
                  <Text
                    style={
                      createChoreStyles.rewardTitle
                    }
                  >
                    🎮 ChorePay reward
                  </Text>

                  <View
                    style={
                      createChoreStyles.autoBadge
                    }
                  >
                    <Text
                      style={
                        createChoreStyles.autoBadgeText
                      }
                    >
                      AUTO
                    </Text>
                  </View>
                </View>

                {previewCoins >
                0 ? (
                  <>
                    <View
                      style={
                        createChoreStyles.rewardValues
                      }
                    >
                      <View
                        style={
                          createChoreStyles.rewardValue
                        }
                      >
                        <Text
                          style={
                            createChoreStyles.rewardEmoji
                          }
                        >
                          🪙
                        </Text>

                        <View>
                          <Text
                            style={
                              createChoreStyles.rewardNumber
                            }
                          >
                            {
                              previewCoins
                            }
                          </Text>

                          <Text
                            style={
                              createChoreStyles.rewardLabel
                            }
                          >
                            coins
                          </Text>
                        </View>
                      </View>

                      <View
                        style={
                          createChoreStyles.rewardDivider
                        }
                      />

                      <View
                        style={
                          createChoreStyles.rewardValue
                        }
                      >
                        <Text
                          style={
                            createChoreStyles.rewardEmoji
                          }
                        >
                          ⭐
                        </Text>

                        <View>
                          <Text
                            style={
                              createChoreStyles.rewardNumber
                            }
                          >
                            {
                              previewXp
                            }
                          </Text>

                          <Text
                            style={
                              createChoreStyles.rewardLabel
                            }
                          >
                            XP
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text
                      style={
                        createChoreStyles.rewardHint
                      }
                    >
                      Calculated from
                      difficulty and
                      estimated time.
                    </Text>
                  </>
                ) : (
                  <Text
                    style={
                      createChoreStyles.rewardHint
                    }
                  >
                    Choose a time to see
                    the reward.
                  </Text>
                )}
              </View>

              {/* OPTIONAL CASH */}

              <View>
                <Text
                  style={
                    commonStyles.fieldLabel
                  }
                >
                  Cash reward
                  (optional)
                </Text>

                <TextInput
                  style={
                    commonStyles.input
                  }
                  value={
                    moneyReward
                  }
                  onChangeText={
                    setMoneyReward
                  }
                  placeholder="e.g. 2.50"
                  keyboardType="decimal-pad"
                />

                <Text
                  style={
                    createChoreStyles.helperText
                  }
                >
                  Game coins are
                  automatic. Cash rewards
                  are completely optional.
                </Text>
              </View>

              {/* REQUIRE PHOTO */}

              <View
                style={
                  createChoreStyles.switchRow
                }
              >
                <View
                  style={
                    createChoreStyles.switchInfo
                  }
                >
                  <Text
                    style={
                      createChoreStyles.switchTitle
                    }
                  >
                    Require photo
                  </Text>

                  <Text
                    style={
                      createChoreStyles.switchDescription
                    }
                  >
                    Ask for a photo when
                    the chore is submitted.
                  </Text>
                </View>

                <Switch
                  value={
                    photoRequired
                  }
                  onValueChange={
                    setPhotoRequired
                  }
                />
              </View>

              {/* REQUIRE COMMENT */}

              <View
                style={
                  createChoreStyles.switchRow
                }
              >
                <View
                  style={
                    createChoreStyles.switchInfo
                  }
                >
                  <Text
                    style={
                      createChoreStyles.switchTitle
                    }
                  >
                    Require comment
                  </Text>

                  <Text
                    style={
                      createChoreStyles.switchDescription
                    }
                  >
                    Ask the child to leave
                    a short note.
                  </Text>
                </View>

                <Switch
                  value={
                    commentRequired
                  }
                  onValueChange={
                    setCommentRequired
                  }
                />
              </View>

              {/* ADVANCED */}

              <Pressable
                style={
                  createChoreStyles.advancedButton
                }
                onPress={() =>
                  setShowAdvanced(
                    (current) =>
                      !current
                  )
                }
              >
                <View>
                  <Text
                    style={
                      createChoreStyles.advancedTitle
                    }
                  >
                    Advanced options
                  </Text>

                  <Text
                    style={
                      createChoreStyles.advancedSubtitle
                    }
                  >
                    Optional penalties
                  </Text>
                </View>

                <Text
                  style={
                    createChoreStyles.advancedChevron
                  }
                >
                  {showAdvanced
                    ? '▲'
                    : '▼'}
                </Text>
              </Pressable>

              {showAdvanced && (
                <View
                  style={
                    createChoreStyles.advancedPanel
                  }
                >
                  <View
                    style={
                      createChoreStyles.row
                    }
                  >
                    <View
                      style={
                        createChoreStyles.halfField
                      }
                    >
                      <Text
                        style={
                          commonStyles.fieldLabel
                        }
                      >
                        Late penalty %
                      </Text>

                      <TextInput
                        style={
                          commonStyles.input
                        }
                        value={
                          latePenalty
                        }
                        onChangeText={
                          setLatePenalty
                        }
                        placeholder="0"
                        keyboardType="number-pad"
                      />
                    </View>

                    <View
                      style={
                        createChoreStyles.halfField
                      }
                    >
                      <Text
                        style={
                          commonStyles.fieldLabel
                        }
                      >
                        Retry penalty %
                      </Text>

                      <TextInput
                        style={
                          commonStyles.input
                        }
                        value={
                          resubmissionPenalty
                        }
                        onChangeText={
                          setResubmissionPenalty
                        }
                        placeholder="0"
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {error ? (
              <Text
                style={
                  commonStyles.errorText
                }
              >
                {error}
              </Text>
            ) : null}

            <Pressable
              disabled={loading}
              style={[
                commonStyles.primaryButton,

                createChoreStyles.submitButton,

                loading &&
                  commonStyles.loadingButton,
              ]}
              onPress={
                handleCreateChore
              }
            >
              <Text
                style={
                  commonStyles.primaryButtonText
                }
              >
                {loading
                  ? 'Creating chore...'
                  : 'Create chore'}
              </Text>
            </Pressable>
          </>
        ) : (
          /*
           * STEP 2
           * ASSIGN CHORE
           */

          <View
            style={
              createChoreStyles.successCard
            }
          >
            {!assigned ? (
              <>
                <Text
                  style={
                    createChoreStyles.successIcon
                  }
                >
                  ✓
                </Text>

                <Text
                  style={
                    createChoreStyles.successTitle
                  }
                >
                  Chore created!
                </Text>

                <Text
                  style={
                    createChoreStyles.successText
                  }
                >
                  "{createdChore.title}"
                  is worth{' '}
                  {createdChore.coinReward}{' '}
                  coins and{' '}
                  {createdChore.xpReward}{' '}
                  XP. Now choose who
                  should complete it.
                </Text>

                <View
                  style={
                    createChoreStyles.assignmentSection
                  }
                >
                  <Text
                    style={
                      createChoreStyles.assignmentTitle
                    }
                  >
                    Assign to
                  </Text>

                  <Text
                    style={
                      createChoreStyles.assignmentSubtitle
                    }
                  >
                    Choose one or more
                    children.
                  </Text>

                  {loadingChildren ? (
                    <Text>
                      Loading family
                      members...
                    </Text>
                  ) : familyMembers.length ===
                    0 ? (
                    <Text
                      style={
                        createChoreStyles.assignmentSubtitle
                      }
                    >
                      There are no children
                      in this family yet.
                    </Text>
                  ) : (
                    <View
                      style={
                        createChoreStyles.childrenList
                      }
                    >
                      {familyMembers.map(
                        (child) => {
                          const selected =
                            selectedChildren.includes(
                              child.userId
                            );

                          return (
                            <Pressable
                              key={
                                child.userId
                              }
                              style={[
                                createChoreStyles.childCard,

                                selected &&
                                  createChoreStyles.childCardSelected,
                              ]}
                              onPress={() =>
                                toggleChild(
                                  child.userId
                                )
                              }
                            >
                              <View>
                                <Text
                                  style={
                                    createChoreStyles.childName
                                  }
                                >
                                  {
                                    child.name
                                  }
                                </Text>

                                <Text
                                  style={
                                    createChoreStyles.childRole
                                  }
                                >
                                  Child
                                </Text>
                              </View>

                              <View
                                style={[
                                  createChoreStyles.selectionCircle,

                                  selected &&
                                    createChoreStyles.selectionCircleSelected,
                                ]}
                              >
                                {selected && (
                                  <Text
                                    style={
                                      createChoreStyles.selectionCheck
                                    }
                                  >
                                    ✓
                                  </Text>
                                )}
                              </View>
                            </Pressable>
                          );
                        }
                      )}
                    </View>
                  )}

                <DueDateTimePicker
  dueDate={dueDate}
  dueTime={dueTime}
  onDateChange={setDueDate}
  onTimeChange={setDueTime}
/>

                  {assignmentError ? (
                    <Text
                      style={
                        commonStyles.errorText
                      }
                    >
                      {
                        assignmentError
                      }
                    </Text>
                  ) : null}

                  <Pressable
                    disabled={
                      assigning ||
                      selectedChildren.length ===
                        0
                    }
                    style={[
                      commonStyles.primaryButton,

                      (
                        assigning ||
                        selectedChildren.length ===
                          0
                      ) &&
                        commonStyles.disabledButton,
                    ]}
                    onPress={
                      handleAssignChore
                    }
                  >
                    <Text
                      style={
                        commonStyles.primaryButtonText
                      }
                    >
                      {assigning
                        ? 'Assigning...'
                        : selectedChildren.length >
                            1
                          ? `Assign chore to ${selectedChildren.length} children`
                          : 'Assign chore'}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              /*
               * STEP 3
               */

              <>
                <Text
                  style={
                    createChoreStyles.successIcon
                  }
                >
                  🎉
                </Text>

                <Text
                  style={
                    createChoreStyles.successTitle
                  }
                >
                  Chore assigned!
                </Text>

                <Text
                  style={
                    createChoreStyles.successText
                  }
                >
                  "{createdChore.title}"
                  has been assigned
                  successfully.
                </Text>

                <Pressable
                  style={
                    commonStyles.primaryButton
                  }
                  onPress={() =>
                    router.replace(
                      '/chores'
                    )
                  }
                >
                  <Text
                    style={
                      commonStyles.primaryButtonText
                    }
                  >
                    View chores
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}