import { router } from 'expo-router';
import { useState } from 'react';

import {
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';

import { requestToJoinFamily } from '../services/family.service';

import { commonStyles } from '../styles/common.styles';

import { familyOnboardingStyles } from '../styles/screens/family-onboarding.styles';

export default function JoinFamilyScreen() {
  const { token } = useAuth();

  const [joinCode, setJoinCode] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [requestSent, setRequestSent] =
    useState(false);

  const handleJoinFamily = async () => {
    setError('');

    const normalizedCode =
      joinCode.trim().toUpperCase();

    if (!normalizedCode) {
      setError(
        'Please enter a family join code.'
      );

      return;
    }

    if (normalizedCode.length !== 8) {
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
    <View style={commonStyles.centeredScreen}>
      <View
        style={
          familyOnboardingStyles.content
        }
      >
        <Pressable
          style={
            familyOnboardingStyles.backButton
          }
          onPress={() => router.back()}
        >
          <Text style={commonStyles.linkText}>
            ← Back
          </Text>
        </Pressable>

        <Text
          style={familyOnboardingStyles.logo}
        >
          ChorePay
        </Text>

        {!requestSent ? (
          <>
            <Text
              style={
                familyOnboardingStyles.title
              }
            >
              Join your family
            </Text>

            <Text
              style={
                familyOnboardingStyles.subtitle
              }
            >
              Ask your parent for the family
              join code and enter it below.
            </Text>

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
                  style={commonStyles.input}
                  value={joinCode}
                  onChangeText={(value) =>
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
                  A parent needs to approve your
                  request before you become part
                  of the family.
                </Text>
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
                familyOnboardingStyles.submitButton,
                loading &&
                  commonStyles.loadingButton,
              ]}
              onPress={handleJoinFamily}
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
              Your request has been sent to the
              family. A parent needs to approve
              it before you can join.
            </Text>

            <Pressable
              style={commonStyles.primaryButton}
              onPress={() =>
                router.replace(
                  '/child-dashboard'
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
    </View>
  );
}