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
  cancelJoinRequest,
  Family,
  getMyFamily,
  getMyLatestJoinRequest,
  JoinRequest,
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

  const [joinRequest, setJoinRequest] =
    useState<JoinRequest | null>(null);

  const [loadingFamily, setLoadingFamily] =
    useState(true);

  const [familyError, setFamilyError] =
    useState('');

    const [cancellingRequest, setCancellingRequest] =
  useState(false);

  const loadFamilyState =
    useCallback(async () => {
      if (!token) {
        return;
      }

      try {
        setLoadingFamily(true);
        setFamilyError('');

        const familyResult =
          await getMyFamily(token);

        setFamily(familyResult);

        /*
         * If they already belong to a family,
         * their previous join request no longer
         * matters to the dashboard.
         */
        if (familyResult) {
          setJoinRequest(null);
          return;
        }

        const requestResult =
          await getMyLatestJoinRequest(token);

        setJoinRequest(requestResult);
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
      loadFamilyState();
    }, [loadFamilyState])
  );

  const handleCancelRequest = async () => {
  if (
    !token ||
    !joinRequest ||
    joinRequest.status !== 'PENDING'
  ) {
    return;
  }

  try {
    setCancellingRequest(true);
    setFamilyError('');

    await cancelJoinRequest(
      joinRequest.requestId,
      token
    );

    await loadFamilyState();
  } catch (err) {
    if (err instanceof Error) {
      setFamilyError(err.message);
    } else {
      setFamilyError(
        'Could not cancel your request.'
      );
    }
  } finally {
    setCancellingRequest(false);
  }
};

  const handleLogout = async () => {
    await signOut();

    router.replace('/login');
  };

  const canJoinFamily =
    !joinRequest ||
    joinRequest.status === 'REJECTED' ||
    joinRequest.status === 'CANCELLED';

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

        {/* Family */}
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
                  You're part of this family and
                  ready to receive chores and earn
                  rewards.
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
          ) : joinRequest?.status ===
            'PENDING' ? (
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
                  Request sent
                </Text>

                <Text
                  style={dashboardStyles.cardText}
                >
                  Your request has been sent.
                  A parent needs to approve it
                  before you can join the family.
                </Text>
              </View>

              <View style={dashboardStyles.statusBox}>
  <Text style={dashboardStyles.statusLabel}>
    STATUS
  </Text>

  <Text style={dashboardStyles.statusTitle}>
    Waiting for approval
  </Text>

  <Text style={dashboardStyles.statusText}>
    A parent needs to approve your request.
  </Text>

  <Pressable
    disabled={cancellingRequest}
    style={[
      commonStyles.secondaryButton,
      dashboardStyles.cancelRequestButton,

      cancellingRequest &&
        commonStyles.loadingButton,
    ]}
    onPress={handleCancelRequest}
  >
    <Text
      style={commonStyles.secondaryButtonText}
    >
      {cancellingRequest
        ? 'Cancelling...'
        : 'Cancel request'}
    </Text>
  </Pressable>
</View>
            </>
          ) : joinRequest?.status ===
            'REJECTED' ? (
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
                  Request declined
                </Text>

                <Text
                  style={dashboardStyles.cardText}
                >
                  Your previous request wasn't
                  approved. You can enter another
                  family code and try again.
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
                  Try another code
                </Text>
              </Pressable>
            </>
          ) : canJoinFamily ? (
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
                  Join your family
                </Text>

                <Text
                  style={dashboardStyles.cardText}
                >
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
          ) : null}
        </View>

        {/* Chores only show after joining */}
        {family && (
          <View
            style={dashboardStyles.requestsSection}
          >
            <Text
              style={dashboardStyles.sectionTitle}
            >
              Your chores
            </Text>

            <View
              style={dashboardStyles.requestCard}
            >
              <Text
                style={dashboardStyles.cardText}
              >
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