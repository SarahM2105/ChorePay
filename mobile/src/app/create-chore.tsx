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

import { createChoreStyles } from '../styles/screens/create-chore.styles';

export default function CreateChoreScreen() {
  const { token } = useAuth();

  /*
   * Chore template fields
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

  const [coinReward, setCoinReward] =
    useState('');

  const [moneyReward, setMoneyReward] =
    useState('');

  const [latePenalty, setLatePenalty] =
    useState('');

  const [
    resubmissionPenalty,
    setResubmissionPenalty,
  ] = useState('');

  const [
    photoRequired,
    setPhotoRequired,
  ] = useState(false);

  const [
    commentRequired,
    setCommentRequired,
  ] = useState(false);

  /*
   * Template creation state
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
   * Assignment state
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

  const [assigning, setAssigning] =
    useState(false);

  const [
    assignmentError,
    setAssignmentError,
  ] = useState('');

  const [assigned, setAssigned] =
    useState(false);

  const [dueDate, setDueDate] =
    useState('');

  const [dueTime, setDueTime] =
    useState('');

  /*
   * Create the reusable chore template
   */

  const handleCreateChore = async () => {
    setError('');

    if (!title.trim()) {
      setError(
        'Please enter a chore title.'
      );

      return;
    }

    if (!coinReward.trim()) {
      setError(
        'Please enter a coin reward.'
      );

      return;
    }

    const coins = Number(coinReward);

    if (
      Number.isNaN(coins) ||
      coins < 0
    ) {
      setError(
        'Coin reward must be 0 or more.'
      );

      return;
    }

    if (
      estimatedMinutes &&
      (
        Number.isNaN(
          Number(estimatedMinutes)
        ) ||
        Number(estimatedMinutes) < 1
      )
    ) {
      setError(
        'Estimated minutes must be at least 1.'
      );

      return;
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
        Number(resubmissionPenalty) < 0 ||
        Number(resubmissionPenalty) > 100
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
            title: title.trim(),

            description:
              description.trim() ||
              undefined,

            category:
              category.trim() ||
              undefined,

            difficulty,

            estimatedMinutes:
              estimatedMinutes
                ? Number(
                    estimatedMinutes
                  )
                : undefined,

            coinReward: coins,

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
      if (err instanceof Error) {
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
   * Once the template has been created,
   * load all CHILD members of the family.
   */

  useEffect(() => {
    const loadChildren = async () => {
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
          await getFamilyMembers(token);

        const children =
          members.filter(
            (member) =>
              member.role === 'CHILD'
          );

        setFamilyMembers(children);
      } catch (err) {
        if (err instanceof Error) {
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
   * Select / deselect children.
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
   * Assign the newly created template.
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
        selectedChildren.length === 0
      ) {
        setAssignmentError(
          'Choose at least one child.'
        );

        return;
      }

      let dueAt:
        | string
        | undefined;

      /*
       * Due date is optional.
       *
       * But if the parent enters one
       * part, they must enter both the
       * date and time.
       */

      if (dueDate || dueTime) {
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
          <Text
            style={
              createChoreStyles.logo
            }
          >
            ChorePay
          </Text>

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
          /*
           * STEP 1:
           * CREATE TEMPLATE
           */

          <>
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
              Create a reusable chore
              template. You'll choose who
              to assign it to afterwards.
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
                  Chore title
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
                  Description
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
                  placeholder="Add instructions or details..."
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
                  Difficulty
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
                            {option.charAt(
                              0
                            ) +
                              option
                                .slice(
                                  1
                                )
                                .toLowerCase()}
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </View>

              {/* TIME + COINS */}

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
                    Estimated minutes
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
                    placeholder="30"
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
                    Coin reward
                  </Text>

                  <TextInput
                    style={
                      commonStyles.input
                    }
                    value={
                      coinReward
                    }
                    onChangeText={
                      setCoinReward
                    }
                    placeholder="20"
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              {/* MONEY */}

              <View>
                <Text
                  style={
                    commonStyles.fieldLabel
                  }
                >
                  Money reward (£,
                  optional)
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
              </View>

              {/* PENALTIES */}

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
                    Resubmission
                    penalty %
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

              {/* PHOTO REQUIRED */}

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
                    The child must include
                    a photo when submitting
                    the chore.
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

              {/* COMMENT REQUIRED */}

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
                    The child must add a
                    comment before
                    submitting.
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
           * STEP 2:
           * ASSIGN TEMPLATE
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
                  has been saved as a
                  reusable template. Now
                  choose who should
                  complete it.
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
                    children from your
                    family.
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

                  {/* DUE DATE */}

                  <Text
                    style={
                      commonStyles.fieldLabel
                    }
                  >
                    Due date & time
                    (optional)
                  </Text>

                  <View
                    style={
                      createChoreStyles.dateRow
                    }
                  >
                    <View
                      style={
                        createChoreStyles.dateField
                      }
                    >
                      <TextInput
                        style={
                          commonStyles.input
                        }
                        value={
                          dueDate
                        }
                        onChangeText={
                          setDueDate
                        }
                        placeholder="2026-08-22"
                      />
                    </View>

                    <View
                      style={
                        createChoreStyles.dateField
                      }
                    >
                      <TextInput
                        style={
                          commonStyles.input
                        }
                        value={
                          dueTime
                        }
                        onChangeText={
                          setDueTime
                        }
                        placeholder="18:00"
                      />
                    </View>
                  </View>

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
               * STEP 3:
               * SUCCESS
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
                  successfully. It will now
                  appear on the selected
                  child's dashboard.
                </Text>

                <Pressable
                  style={
                    commonStyles.primaryButton
                  }
                  onPress={() =>
                    router.replace(
                      '/parent-dashboard'
                    )
                  }
                >
                  <Text
                    style={
                      commonStyles.primaryButtonText
                    }
                  >
                    Back to dashboard
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