import { router } from 'expo-router';
import { useState } from 'react';

import {
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';

import {
  requestToJoinFamily,
} from '../services/family.service';

import {
  commonStyles,
} from '../styles/common.styles';

import {
  familyOnboardingStyles,
} from '../styles/screens/family-onboarding.styles';

export default function JoinFamilyScreen() {
  const {
    token,
    user,
  } = useAuth();

  const isParent =
    user?.userType === 'PARENT';

  const [
    joinCode,
    setJoinCode,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    requestSent,
    setRequestSent,
  ] = useState(false);

  const handleJoinFamily =
    async () => {
      setError('');

      const normalizedCode =
        joinCode
          .trim()
          .toUpperCase();

      if (!normalizedCode) {
        setError(
          'Please enter a family join code.'
        );

        return;
      }

      if (
        normalizedCode.length !== 8
      ) {
        setError(
          'Join code must be 8 characters.'
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

        await requestToJoinFamily(
          normalizedCode,
          token
        );

        setRequestSent(true);
      } catch (err) {
        if (
          err instanceof Error
        ) {
          setError(
            err.message
          );
        } else {
          setError(
            'Something went wrong.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

  const handleBackToDashboard =
    () => {
      if (isParent) {
        router.replace(
          '/parent-dashboard'
        );
      } else {
        router.replace(
          '/child-dashboard'
        );
      }
    };

  return (
    <View
      style={
        commonStyles.centeredScreen
      }
    >
      <View
        style={
          familyOnboardingStyles.content
        }
      >
        {/* BACK */}

        <Pressable
          style={
            familyOnboardingStyles.backButton
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

        {/* LOGO */}

        <Text
          style={
            familyOnboardingStyles.logo
          }
        >
          ChorePay
        </Text>

        {!requestSent ? (
          <>
            {/* TITLE */}

            <Text
              style={
                familyOnboardingStyles.title
              }
            >
              {isParent
                ? 'Join an existing family'
                : 'Join your family'}
            </Text>

            {/* SUBTITLE */}

            <Text
              style={
                familyOnboardingStyles.subtitle
              }
            >
              {isParent
                ? 'Enter the family join code shared by the family owner.'
                : 'Ask a parent for your family join code and enter it below.'}
            </Text>

            {/* FORM */}

            <View
              style={
                familyOnboardingStyles.form
              }
            >
              <View>
                <Text
                  style={
                    commonStyles.fieldLabel
                  }
                >
                  Join code
                </Text>

                <TextInput
                  style={
                    commonStyles.input
                  }
                  value={
                    joinCode
                  }
                  onChangeText={(
                    value
                  ) =>
                    setJoinCode(
                      value.toUpperCase()
                    )
                  }
                  placeholder="ABCD1234"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={8}
                />

                <Text
                  style={
                    familyOnboardingStyles.helperText
                  }
                >
                  {isParent
                    ? 'The family owner needs to approve your request before you can join as a parent.'
                    : 'A parent needs to approve your request before you become part of the family.'}
                </Text>
              </View>
            </View>

            {/* ERROR */}

            {error ? (
              <Text
                style={
                  commonStyles.errorText
                }
              >
                {error}
              </Text>
            ) : null}

            {/* SUBMIT */}

            <Pressable
              disabled={
                loading
              }
              style={[
                commonStyles.primaryButton,

                familyOnboardingStyles.submitButton,

                loading &&
                  commonStyles.loadingButton,
              ]}
              onPress={
                handleJoinFamily
              }
            >
              <Text
                style={
                  commonStyles.primaryButtonText
                }
              >
                {loading
                  ? 'Sending request...'
                  : 'Request to join'}
              </Text>
            </Pressable>
          </>
        ) : (
          /* SUCCESS */

          <View
            style={
              familyOnboardingStyles.successCard
            }
          >
            <Text
              style={
                familyOnboardingStyles.successIcon
              }
            >
              ✓
            </Text>

            <Text
              style={
                familyOnboardingStyles.successTitle
              }
            >
              Request sent!
            </Text>

            <Text
              style={
                familyOnboardingStyles.successText
              }
            >
              {isParent
                ? 'Your request has been sent to the family owner. Once they approve it, you will join the family as a parent.'
                : 'Your request has been sent to the family. A parent needs to approve it before you can join.'}
            </Text>

            <Pressable
              style={
                commonStyles.primaryButton
              }
              onPress={
                handleBackToDashboard
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
    </View>
  );
}   