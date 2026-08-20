import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
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
  Family,
  getMyFamily,
} from '../services/family.service';

import { commonStyles } from '../styles/common.styles';
import { dashboardStyles } from '../styles/screens/dashboard.styles';

export default function ChildDashboardScreen() {
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

 const loadFamily = useCallback(async () => {
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
}, [token]);

useFocusEffect(
  useCallback(() => {
    loadFamily();
  }, [loadFamily])
);


  const handleLogout = async () => {
    await signOut();

    router.replace('/login');
  };

  return (
    <View style={dashboardStyles.screen}>
      <View style={dashboardStyles.page}>
        {/* Top bar */}
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

        {/* Welcome section */}
        <View style={dashboardStyles.header}>
          <View style={dashboardStyles.roleBadge}>
            <Text
              style={dashboardStyles.roleBadgeText}
            >
              Child
            </Text>
          </View>

          <Text style={dashboardStyles.welcome}>
            Hi, {user?.name} 👋
          </Text>

          <Text style={dashboardStyles.subtitle}>
            Complete chores, earn coins and work
            towards your next reward.
          </Text>
        </View>

        {/* Family section */}
        <View
          style={[
            dashboardStyles.familyCard,
            isDesktop &&
              dashboardStyles.familyCardDesktop,
          ]}
        >
          {loadingFamily ? (
            <Text style={dashboardStyles.loadingText}>
              Loading your family...
            </Text>
          ) : familyError ? (
            <Text style={commonStyles.errorText}>
              {familyError}
            </Text>
          ) : family ? (
            <>
              <View style={dashboardStyles.familyInfo}>
                <Text style={dashboardStyles.sectionLabel}>
                  YOUR FAMILY
                </Text>

                <Text style={dashboardStyles.familyName}>
                  {family.name}
                </Text>

                <Text style={dashboardStyles.cardText}>
                  You're part of this family and
                  ready to receive chores and earn
                  rewards.
                </Text>
              </View>

              <View style={dashboardStyles.joinCodeSection}>
                <Text
                  style={dashboardStyles.joinCodeLabel}
                >
                  Family join code
                </Text>

                <View style={dashboardStyles.joinCodeBox}>
                  <Text style={dashboardStyles.joinCode}>
                    {family.joinCode}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={dashboardStyles.familyInfo}>
                <Text style={dashboardStyles.sectionLabel}>
                  YOUR FAMILY
                </Text>

                <Text style={dashboardStyles.familyName}>
                  Join your family
                </Text>

                <Text style={dashboardStyles.cardText}>
                  Enter the join code given to you
                  by your parent to request access
                  to your family.
                </Text>
              </View>

              <Pressable
                style={[
                  commonStyles.primaryButton,
                  dashboardStyles.createFamilyButton,
                ]}
                onPress={() =>
                  router.push('/join-family')
                }
              >
                <Text
                  style={
                    commonStyles.primaryButtonText
                  }
                >
                  Join a family
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Chores section */}
        {family && (
          <View style={dashboardStyles.requestsSection}>
            <Text style={dashboardStyles.sectionTitle}>
              Your chores
            </Text>

            <View style={dashboardStyles.requestCard}>
              <Text style={dashboardStyles.cardText}>
                You don't have any chores to show
                yet.
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}