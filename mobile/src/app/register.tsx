import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { commonStyles } from '../styles/common.styles';
import { registerStyles } from '../styles/screens/register.styles';

type UserRole = 'PARENT' | 'CHILD';

export default function RegisterScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  const [selectedRole, setSelectedRole] =
    useState<UserRole | null>(null);

  const continueRegistration = () => {
    if (!selectedRole) {
      return;
    }

    router.push({
      pathname: '/register-details',
      params: {
        role: selectedRole,
      },
    });
  };

  return (
    <View style={commonStyles.centeredScreen}>
      <View
        style={[
          registerStyles.page,
          isDesktop && registerStyles.pageDesktop,
        ]}
      >
        {isDesktop && (
          <View style={registerStyles.infoPanel}>
            <Text style={registerStyles.logoDesktop}>
              ChorePay
            </Text>

            <Text style={registerStyles.infoTitle}>
              Built for the whole family.
            </Text>

            <Text style={registerStyles.infoText}>
              Parents organise chores and rewards.
              Children complete tasks, earn coins
              and build progress.
            </Text>
          </View>
        )}

        <View
          style={[
            registerStyles.content,
            isDesktop &&
              registerStyles.contentDesktop,
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            style={registerStyles.backButton}
          >
            <Text style={registerStyles.backText}>
              ← Back
            </Text>
          </Pressable>

          {!isDesktop && (
            <Text style={registerStyles.logo}>
              ChorePay
            </Text>
          )}

          <Text style={registerStyles.title}>
            Create your account
          </Text>

          <Text style={registerStyles.subtitle}>
            Who will be using this account?
          </Text>

          <View style={registerStyles.roles}>
            <Pressable
              style={[
                registerStyles.roleCard,
                selectedRole === 'PARENT' &&
                  registerStyles.roleCardSelected,
              ]}
              onPress={() =>
                setSelectedRole('PARENT')
              }
            >
              <View style={registerStyles.roleHeading}>
                <Text style={registerStyles.roleIcon}>
                  👤
                </Text>

                <Text style={registerStyles.roleTitle}>
                  Parent
                </Text>
              </View>

              <Text
                style={registerStyles.roleDescription}
              >
                Create a family, assign chores,
                approve completions and manage
                rewards.
              </Text>

              {selectedRole === 'PARENT' && (
                <Text
                  style={registerStyles.selectedText}
                >
                  ✓ Selected
                </Text>
              )}
            </Pressable>

            <Pressable
              style={[
                registerStyles.roleCard,
                selectedRole === 'CHILD' &&
                  registerStyles.roleCardSelected,
              ]}
              onPress={() =>
                setSelectedRole('CHILD')
              }
            >
              <View style={registerStyles.roleHeading}>
                <Text style={registerStyles.roleIcon}>
                  ⭐
                </Text>

                <Text style={registerStyles.roleTitle}>
                  Child
                </Text>
              </View>

              <Text
                style={registerStyles.roleDescription}
              >
                Join your family, complete chores,
                earn coins and unlock rewards.
              </Text>

              {selectedRole === 'CHILD' && (
                <Text
                  style={registerStyles.selectedText}
                >
                  ✓ Selected
                </Text>
              )}
            </Pressable>
          </View>

          <Pressable
            disabled={!selectedRole}
            onPress={continueRegistration}
            style={[
              commonStyles.primaryButton,
              !selectedRole &&
                commonStyles.disabledButton,
            ]}
          >
            <Text style={commonStyles.primaryButtonText}>
              Continue
            </Text>
          </Pressable>

          <Text style={registerStyles.loginPrompt}>
            Already have an account?{' '}

            <Text
              style={commonStyles.linkText}
              onPress={() => router.push('/login')}
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}