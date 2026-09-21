import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';

import {
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppBottomNav } from '../components/AppBottomNav';

import { useAuth } from '../context/AuthContext';

import {
  getMyProgress,
  UserProgress,
} from '../services/progress.service';

import {
  progressStyles as styles,
} from '../styles/screens/progress.styles';

export default function ProgressScreen() {
  const { token } = useAuth();

  const [
    progress,
    setProgress,
  ] = useState<UserProgress | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const loadProgress =
    useCallback(async () => {
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        setError('');

        const result =
          await getMyProgress(token);

        setProgress(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            'Could not load your progress.'
          );
        }
      } finally {
        setLoading(false);
      }
    }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text style={styles.loadingText}>
          Loading your progress...
        </Text>
      </View>
    );
  }

  if (error || !progress) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>
          {error ||
            'Could not load your progress.'}
        </Text>
      </View>
    );
  }

  const xpInCurrentLevel =
    progress.totalXp % 100;

  const xpPercentage = Math.min(
    Math.max(xpInCurrentLevel, 0),
    100
  );

  const lastCompleted =
    progress.lastCompletedChoreDate
      ? new Date(
          `${progress.lastCompletedChoreDate}T00:00:00`
        ).toLocaleDateString([], {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'No completed chores yet';

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
          <View style={styles.header}>
            <Text style={styles.title}>
              Your progress
            </Text>

            <Text style={styles.subtitle}>
              Keep completing chores to earn
              coins, XP and build your streak.
            </Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.levelRow}>
              <View style={styles.levelIcon}>
                <Ionicons
                  name="star"
                  size={23}
                  color="#6C5CE7"
                />
              </View>

              <View>
                <Text style={styles.levelTitle}>
                  Level{' '}
                  {progress.currentLevel}
                </Text>

                <Text style={styles.xpText}>
                  {xpInCurrentLevel} / 100 XP
                  towards the next level
                </Text>
              </View>
            </View>

            <View
              style={styles.xpBarBackground}
            >
              <View
                style={[
                  styles.xpBarFill,
                  {
                    width:
                      `${xpPercentage}%` as `${number}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  styles.orangeIcon,
                ]}
              >
                <Ionicons
                  name="flash"
                  size={21}
                  color="#D99419"
                />
              </View>

              <Text style={styles.statNumber}>
                {progress.coinBalance}
              </Text>

              <Text style={styles.statLabel}>
                Coins
              </Text>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  styles.purpleIcon,
                ]}
              >
                <Ionicons
                  name="star"
                  size={21}
                  color="#6C5CE7"
                />
              </View>

              <Text style={styles.statNumber}>
                {progress.totalXp}
              </Text>

              <Text style={styles.statLabel}>
                Total XP
              </Text>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  styles.redIcon,
                ]}
              >
                <Ionicons
                  name="flame"
                  size={21}
                  color="#E87575"
                />
              </View>

              <Text style={styles.statNumber}>
                {progress.currentStreak}
              </Text>

              <Text style={styles.statLabel}>
                Current streak
              </Text>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  styles.tealIcon,
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={21}
                  color="#4B988E"
                />
              </View>

              <Text style={styles.statNumber}>
                {progress.completedChoreCount}
              </Text>

              <Text style={styles.statLabel}>
                Chores completed
              </Text>
            </View>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>
              Best streak
            </Text>

            <Text style={styles.detailText}>
              {progress.longestStreak}{' '}
              {progress.longestStreak === 1
                ? 'day'
                : 'days'}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>
              Last completed chore
            </Text>

            <Text style={styles.detailText}>
              {lastCompleted}
            </Text>
          </View>
        </View>
      </ScrollView>

      <AppBottomNav
        active="progress"
        userType="CHILD"
      />
    </View>
  );
}