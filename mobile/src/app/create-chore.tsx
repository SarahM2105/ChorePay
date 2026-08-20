import { router } from 'expo-router';
import { useState } from 'react';

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
  ChoreDifficulty,
  ChoreTemplate,
  createChoreTemplate,
} from '../services/chore.service';

import { commonStyles } from '../styles/common.styles';

import { createChoreStyles } from '../styles/screens/create-chore.styles';

export default function CreateChoreScreen() {
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');
  const [category, setCategory] =
    useState('');

  const [difficulty, setDifficulty] =
    useState<ChoreDifficulty>('EASY');

  const [estimatedMinutes, setEstimatedMinutes] =
    useState('');

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

  const [photoRequired, setPhotoRequired] =
    useState(false);

  const [commentRequired, setCommentRequired] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [createdChore, setCreatedChore] =
    useState<ChoreTemplate | null>(null);

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
                ? Number(estimatedMinutes)
                : undefined,

            coinReward: coins,

            moneyRewardPence:
              moneyReward
                ? Math.round(
                    Number(moneyReward) * 100
                  )
                : undefined,

            latePenaltyPercent:
              latePenalty
                ? Number(latePenalty)
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

  return (
    <ScrollView
      style={createChoreStyles.screen}
      contentContainerStyle={
        createChoreStyles.scrollContent
      }
      keyboardShouldPersistTaps="handled"
    >
      <View style={createChoreStyles.page}>
        <View style={createChoreStyles.topBar}>
          <Text style={createChoreStyles.logo}>
            ChorePay
          </Text>

          <Pressable
            style={createChoreStyles.backButton}
            onPress={() => router.back()}
          >
            <Text style={commonStyles.linkText}>
              ← Back
            </Text>
          </Pressable>
        </View>

        {!createdChore ? (
          <>
            <Text style={createChoreStyles.title}>
              Create a chore
            </Text>

            <Text
              style={createChoreStyles.subtitle}
            >
              Create a reusable chore template.
              You'll choose who to assign it to
              afterwards.
            </Text>

            <View
              style={createChoreStyles.formCard}
            >
              <View>
                <Text
                  style={commonStyles.fieldLabel}
                >
                  Chore title
                </Text>

                <TextInput
                  style={commonStyles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Clean your bedroom"
                  maxLength={120}
                />
              </View>

              <View>
                <Text
                  style={commonStyles.fieldLabel}
                >
                  Description
                </Text>

                <TextInput
                  style={[
                    commonStyles.input,
                    createChoreStyles.textArea,
                  ]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add instructions or details..."
                  multiline
                />
              </View>

              <View>
                <Text
                  style={commonStyles.fieldLabel}
                >
                  Category
                </Text>

                <TextInput
                  style={commonStyles.input}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="e.g. Bedroom"
                />
              </View>

              <View>
                <Text
                  style={commonStyles.fieldLabel}
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
                  ).map((option) => {
                    const selected =
                      difficulty === option;

                    return (
                      <Pressable
                        key={option}
                        style={[
                          createChoreStyles.difficultyButton,

                          selected &&
                            createChoreStyles.difficultySelected,
                        ]}
                        onPress={() =>
                          setDifficulty(option)
                        }
                      >
                        <Text
                          style={[
                            createChoreStyles.difficultyText,

                            selected &&
                              createChoreStyles.difficultySelectedText,
                          ]}
                        >
                          {option.charAt(0) +
                            option
                              .slice(1)
                              .toLowerCase()}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={createChoreStyles.row}>
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
                    style={commonStyles.input}
                    value={estimatedMinutes}
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
                    style={commonStyles.input}
                    value={coinReward}
                    onChangeText={setCoinReward}
                    placeholder="20"
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View>
                <Text
                  style={commonStyles.fieldLabel}
                >
                  Money reward (£, optional)
                </Text>

                <TextInput
                  style={commonStyles.input}
                  value={moneyReward}
                  onChangeText={setMoneyReward}
                  placeholder="e.g. 2.50"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={createChoreStyles.row}>
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
                    style={commonStyles.input}
                    value={latePenalty}
                    onChangeText={setLatePenalty}
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
                    Resubmission penalty %
                  </Text>

                  <TextInput
                    style={commonStyles.input}
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
                    The child must include a photo
                    when submitting the chore.
                  </Text>
                </View>

                <Switch
                  value={photoRequired}
                  onValueChange={setPhotoRequired}
                />
              </View>

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
                    The child must add a comment
                    before submitting.
                  </Text>
                </View>

                <Switch
                  value={commentRequired}
                  onValueChange={
                    setCommentRequired
                  }
                />
              </View>
            </View>

            {error ? (
              <Text
                style={commonStyles.errorText}
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
              onPress={handleCreateChore}
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
          <View
            style={
              createChoreStyles.successCard
            }
          >
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
              "{createdChore.title}" has been
              saved as a reusable chore template.
              It is worth {createdChore.coinReward}{' '}
              coins and {createdChore.xpReward} XP.
            </Text>

            <Pressable
              style={commonStyles.primaryButton}
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
          </View>
        )}
      </View>
    </ScrollView>
  );
}