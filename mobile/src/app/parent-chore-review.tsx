import { Ionicons } from '@expo/vector-icons';

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
  approveSubmission,
  getPendingSubmissions,
  ParentChoreSubmission,
  rejectSubmission,
} from '../services/chore.service';

import {
  parentChoreReviewStyles as styles,
} from '../styles/screens/parent-chore-review.styles';

export default function ParentChoreReviewScreen() {
  const { token } = useAuth();

  const { assignmentId } =
    useLocalSearchParams<{
      assignmentId: string;
    }>();

  const [
    submission,
    setSubmission,
  ] =
    useState<ParentChoreSubmission | null>(
      null
    );

  const [
    feedback,
    setFeedback,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const loadSubmission = async () => {
    if (!token || !assignmentId) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const submissions =
        await getPendingSubmissions(token);

      const foundSubmission =
        submissions.find(
          (item) =>
            item.assignmentId ===
            assignmentId
        );

      if (!foundSubmission) {
        setSubmission(null);

        setError(
          'Pending submission could not be found.'
        );

        return;
      }

      setSubmission(foundSubmission);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Could not load submission.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmission();
  }, [token, assignmentId]);

  const handleApprove = async () => {
    if (!token || !submission) {
      return;
    }

    try {
      setProcessing(true);
      setError('');

      await approveSubmission(
        submission.submissionId,
        token
      );

      router.replace('/chores');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Could not approve submission.'
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!token || !submission) {
      return;
    }

    if (!feedback.trim()) {
      setError(
        'Please add feedback before rejecting.'
      );

      return;
    }

    try {
      setProcessing(true);
      setError('');

      await rejectSubmission(
        submission.submissionId,
        feedback.trim(),
        token
      );

      router.replace('/chores');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Could not reject submission.'
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text style={styles.loadingText}>
          Loading submission...
        </Text>
      </View>
    );
  }

  if (!submission) {
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

            <Text style={styles.backText}>
              Back
            </Text>
          </Pressable>

          <Text style={styles.errorText}>
            {error ||
              'Submission not found.'}
          </Text>
        </View>
      </View>
    );
  }

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

              <Text style={styles.backText}>
                Chores
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
                WAITING FOR APPROVAL
              </Text>
            </View>

            <Text style={styles.title}>
              {submission.choreTitle}
            </Text>

            <Text
              style={styles.submittedBy}
            >
              Submitted by{' '}
              {submission.submittedByName}
            </Text>

            <Text style={styles.bodyText}>
              Submitted{' '}
              {new Date(
                submission.submittedAt
              ).toLocaleString()}
            </Text>
          </View>

          {submission.comment && (
            <View style={styles.card}>
              <Text
                style={styles.sectionTitle}
              >
                Child comment
              </Text>

              <Text
                style={styles.bodyText}
              >
                {submission.comment}
              </Text>
            </View>
          )}

          {submission.photoUrl && (
            <View style={styles.card}>
              <Text
                style={styles.sectionTitle}
              >
                Photo proof
              </Text>

              <Image
                source={{
                  uri: submission.photoUrl,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}

          {submission.checklist.length >
            0 && (
            <View style={styles.card}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Checklist
              </Text>

              {submission.checklist.map(
                (item) => (
                  <View
                    key={
                      item.checklistItemId
                    }
                    style={
                      styles.checklistItem
                    }
                  >
                    <Ionicons
                      name={
                        item.completed
                          ? 'checkmark-circle'
                          : 'ellipse-outline'
                      }
                      size={20}
                      color={
                        item.completed
                          ? '#4B988E'
                          : '#A7A1B0'
                      }
                    />

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
                  </View>
                )
              )}
            </View>
          )}

          <View style={styles.card}>
            <Text
              style={styles.sectionTitle}
            >
              Feedback
            </Text>

            <TextInput
              value={feedback}
              onChangeText={setFeedback}
              multiline
              maxLength={1000}
              editable={!processing}
              placeholder="Add feedback if the chore needs another try..."
              style={
                styles.feedbackInput
              }
            />
          </View>

          {error ? (
            <Text
              style={styles.errorText}
            >
              {error}
            </Text>
          ) : null}

          <View style={styles.actionRow}>
            <Pressable
              disabled={processing}
              style={[
                styles.rejectButton,

                processing &&
                  styles.disabledButton,
              ]}
              onPress={handleReject}
            >
              <Text
                style={styles.rejectText}
              >
                {processing
                  ? 'Working...'
                  : 'Reject'}
              </Text>
            </Pressable>

            <Pressable
              disabled={processing}
              style={[
                styles.approveButton,

                processing &&
                  styles.disabledButton,
              ]}
              onPress={handleApprove}
            >
              <Text
                style={styles.approveText}
              >
                {processing
                  ? 'Working...'
                  : 'Approve'}
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