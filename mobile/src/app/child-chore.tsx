import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppBottomNav } from '../components/AppBottomNav';

import { useAuth } from '../context/AuthContext';

import {
  ChildChoreAssignment,
  getMyAssignments,
  submitChore,
  uploadChoreProof,
} from '../services/chore.service';

import {
  childChoreStyles as styles,
} from '../styles/screens/child-chore.styles';

export default function ChildChoreScreen() {
  const { token } = useAuth();

  const { assignmentId } =
    useLocalSearchParams<{
      assignmentId: string;
    }>();

  const [
    assignment,
    setAssignment,
  ] =
    useState<ChildChoreAssignment | null>(
      null
    );

  const [
    completedChecklistItemIds,
    setCompletedChecklistItemIds,
  ] = useState<string[]>([]);

  const [
    comment,
    setComment,
  ] = useState('');

  const [
  selectedPhotoUri,
  setSelectedPhotoUri,
] = useState<string | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const loadAssignment = async () => {
    if (!token || !assignmentId) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const assignments =
        await getMyAssignments(token);

      const foundAssignment =
        assignments.find(
          (item) =>
            item.assignmentId ===
            assignmentId
        );

      if (!foundAssignment) {
        setAssignment(null);

        setError(
          'This chore could not be found.'
        );

        return;
      }

      setAssignment(foundAssignment);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Could not load this chore.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignment();
  }, [token, assignmentId]);

  const toggleChecklistItem = (
    itemId: string
  ) => {
    setCompletedChecklistItemIds(
      (current) =>
        current.includes(itemId)
          ? current.filter(
              (id) => id !== itemId
            )
          : [...current, itemId]
    );
  };


const handlePickPhoto = async () => {
  try {
    setError('');

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setError(
        'Photo access is required to choose a photo.'
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

    if (result.canceled) {
      return;
    }

    setSelectedPhotoUri(
      result.assets[0].uri
    );
  } catch {
    setError(
      'Could not choose a photo.'
    );
  }
};

  const handleSubmit = async () => {
    if (
      !token ||
      !assignment
    ) {
      return;
    }

    if (
  assignment.commentRequired &&
  !comment.trim()
) {
  setError(
    'A comment is required for this chore.'
  );

  return;
}

if (
  assignment.photoRequired &&
  !selectedPhotoUri
) {
  setError(
    'A photo is required for this chore.'
  );

  return;
}

    try {
      setSubmitting(true);
      setError('');

      let photoUrl: string | undefined;

if (selectedPhotoUri) {
  photoUrl =
    await uploadChoreProof(
      selectedPhotoUri,
      token
    );
}

await submitChore(
  assignment.assignmentId,
  {
    comment:
      comment.trim() ||
      undefined,

    photoUrl,

    completedChecklistItemIds,
  },
  token
);

      router.replace(
        '/child-dashboard'
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Could not submit chore.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text
          style={styles.loadingText}
        >
          Loading chore...
        </Text>
      </View>
    );
  }

  if (!assignment) {
    return (
      <View style={styles.screen}>
        <View style={styles.page}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.back()
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
              Back
            </Text>
          </Pressable>

          <Text
            style={styles.errorText}
          >
            {error ||
              'Chore not found.'}
          </Text>
        </View>
      </View>
    );
  }

  const dueDate = assignment.dueAt
    ? new Date(assignment.dueAt)
    : null;

  const canSubmit =
    assignment.status === 'ASSIGNED' ||
    assignment.status === 'REJECTED' ||
    assignment.status === 'OVERDUE';

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.page}>
          <View style={styles.topBar}>
            <Pressable
              style={styles.backButton}
              onPress={() =>
                router.back()
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
                My chores
              </Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <View
              style={styles.statusBadge}
            >
              <Text
                style={styles.statusText}
              >
                {assignment.status}
              </Text>
            </View>

            <Text style={styles.title}>
              {assignment.title}
            </Text>

            {assignment.description ? (
              <Text
                style={
                  styles.description
                }
              >
                {assignment.description}
              </Text>
            ) : null}

            <View
              style={styles.rewardRow}
            >
              <View
                style={styles.rewardItem}
              >
                <Ionicons
                  name="ellipse"
                  size={11}
                  color="#F4B84A"
                />

                <Text
                  style={
                    styles.rewardText
                  }
                >
                  {assignment.coinReward}{' '}
                  coins
                </Text>
              </View>

              <View
                style={styles.rewardItem}
              >
                <Ionicons
                  name="star"
                  size={13}
                  color="#6C5CE7"
                />

                <Text
                  style={
                    styles.rewardText
                  }
                >
                  {assignment.xpReward} XP
                </Text>
              </View>

              {dueDate && (
                <View
                  style={
                    styles.rewardItem
                  }
                >
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color="#6F6B7D"
                  />

                  <Text
                    style={
                      styles.rewardText
                    }
                  >
                    {dueDate.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {assignment.parentFeedback && (
            <View
              style={
                styles.feedbackCard
              }
            >
              <Text
                style={
                  styles.feedbackTitle
                }
              >
                Parent feedback
              </Text>

              <Text
                style={
                  styles.feedbackText
                }
              >
                {
                  assignment.parentFeedback
                }
              </Text>
            </View>
          )}

          {assignment.checklist.length >
            0 && (
            <View style={styles.card}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Checklist
              </Text>

              {[...assignment.checklist]
                .sort(
                  (a, b) =>
                    a.displayOrder -
                    b.displayOrder
                )
                .map((item) => {
                  const selected =
                    completedChecklistItemIds.includes(
                      item.id
                    );

                  return (
                    <Pressable
                      key={item.id}
                      disabled={!canSubmit}
                      style={
                        styles.checklistItem
                      }
                      onPress={() =>
                        toggleChecklistItem(
                          item.id
                        )
                      }
                    >
                      <View
                        style={[
                          styles.checkbox,

                          selected &&
                            styles.checkboxSelected,
                        ]}
                      >
                        {selected && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FFFFFF"
                          />
                        )}
                      </View>

                      <Text
                        style={
                          styles.checklistText
                        }
                      >
                        {item.text}
                      </Text>

                      {item.required && (
                        <Text
                          style={
                            styles.requiredText
                          }
                        >
                          Required
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
            </View>
          )}

          {assignment.photoRequired && canSubmit && (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>
      Photo proof
    </Text>

    <Text style={styles.photoRequiredText}>
      A photo is required before you can submit this chore.
    </Text>

    <Pressable
      disabled={submitting}
      style={styles.photoButton}
      onPress={handlePickPhoto}
    >
      <Ionicons
        name="camera-outline"
        size={18}
        color="#6C5CE7"
      />

      <Text style={styles.photoButtonText}>
        {selectedPhotoUri
          ? 'Choose another photo'
          : 'Choose photo'}
      </Text>
    </Pressable>

    {selectedPhotoUri && (
      <Image
        source={{
          uri: selectedPhotoUri,
        }}
        style={styles.photoPreview}
        resizeMode="cover"
      />
    )}
  </View>
)}

          {canSubmit && (
            <View style={styles.card}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Add a comment
              </Text>

              <TextInput
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={1000}
                editable={!submitting}
                placeholder="Tell your parent how it went..."
                style={
                  styles.commentInput
                }
              />
            </View>
          )}

          {error ? (
            <Text
              style={styles.errorText}
            >
              {error}
            </Text>
          ) : null}

          {canSubmit && (
            <Pressable
              disabled={submitting}
              style={[
                styles.submitButton,

                submitting &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
            >
              <Text
                style={
                  styles.submitButtonText
                }
              >
                {submitting
                  ? 'Submitting...'
                  : assignment.status ===
                      'REJECTED'
                    ? 'Resubmit chore'
                    : 'Submit for approval'}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <AppBottomNav
        active="chores"
        userType="CHILD"
      />
    </View>
  );
}