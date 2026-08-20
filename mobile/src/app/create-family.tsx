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
  createFamily,
  Family,
} from '../services/family.service';

import { commonStyles } from '../styles/common.styles';

import { familyOnboardingStyles } from '../styles/screens/family-onboarding.styles';

export default function CreateFamilyScreen() {
  const { token } = useAuth();

  const [familyName, setFamilyName] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [createdFamily, setCreatedFamily] =
    useState<Family | null>(null);

  const handleCreateFamily = async () => {
    setError('');

    if (!familyName.trim()) {
      setError(
        'Please enter a family name.'
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

      const family = await createFamily(
        familyName.trim(),
        token
      );

      setCreatedFamily(family);
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

        {!createdFamily ? (
          <>
            <Text
              style={
                familyOnboardingStyles.title
              }
            >
              Create your family
            </Text>

            <Text
              style={
                familyOnboardingStyles.subtitle
              }
            >
              Give your family space a name.
              ChorePay will then give you a join
              code for other family members.
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
                  Family name
                </Text>

                <TextInput
                  style={commonStyles.input}
                  value={familyName}
                  onChangeText={setFamilyName}
                  placeholder="e.g. Our Family"
                  autoCapitalize="words"
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
                familyOnboardingStyles.submitButton,
                loading &&
                  commonStyles.loadingButton,
              ]}
              onPress={handleCreateFamily}
            >
              <Text
                style={
                  commonStyles.primaryButtonText
                }
              >
                {loading
                  ? 'Creating family...'
                  : 'Create family'}
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
                familyOnboardingStyles.successTitle
              }
            >
              Family created! 🎉
            </Text>

            <Text
              style={
                familyOnboardingStyles.successText
              }
            >
              {createdFamily.name} is ready.
              Share this code with family members
              who want to join:
            </Text>

            <Text
              style={
                familyOnboardingStyles.joinCode
              }
            >
              {createdFamily.joinCode}
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
                Continue
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}