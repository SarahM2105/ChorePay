import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  registerUser,
  UserRole,
} from '../services/auth.service';

import { commonStyles } from '../styles/common.styles';
import { registerDetailsStyles } from '../styles/screens/register-details.styles';


export default function RegisterDetailsScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  const params = useLocalSearchParams<{
    role?: string;
  }>();

  const role: UserRole =
    params.role === 'CHILD'
      ? 'CHILD'
      : 'PARENT';

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError('Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError(
        'Password must be at least 8 characters.'
      );

      return;
    }

    try {
      setLoading(true);

      await registerUser({
  name: name.trim(),
  email: email.trim(),
  password,
  userType: role,
});


      router.replace({
  pathname: '/login',
  params: {
    registered: 'true',
  },
});
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
        style={[
          registerDetailsStyles.page,
          isDesktop &&
            registerDetailsStyles.pageDesktop,
        ]}
      >
        {isDesktop && (
          <View
            style={registerDetailsStyles.infoPanel}
          >
            <Text
              style={
                registerDetailsStyles.logoDesktop
              }
            >
              ChorePay
            </Text>

            <Text
              style={
                registerDetailsStyles.infoTitle
              }
            >
              {role === 'PARENT'
                ? 'Create your family space.'
                : 'Start earning rewards.'}
            </Text>

            <Text
              style={
                registerDetailsStyles.infoText
              }
            >
              {role === 'PARENT'
                ? 'Create chores, track progress and reward the family for getting things done.'
                : 'Complete your chores, build XP and spend your coins on rewards.'}
            </Text>
          </View>
        )}

        <View
          style={[
            registerDetailsStyles.content,
            isDesktop &&
              registerDetailsStyles.contentDesktop,
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            style={
              registerDetailsStyles.backButton
            }
          >
            <Text
              style={
                registerDetailsStyles.backText
              }
            >
              ← Back
            </Text>
          </Pressable>

          {!isDesktop && (
            <Text
              style={registerDetailsStyles.logo}
            >
              ChorePay
            </Text>
          )}

          <Text
            style={registerDetailsStyles.roleLabel}
          >
            {role === 'PARENT'
              ? 'Parent account'
              : 'Child account'}
          </Text>

          <Text
            style={registerDetailsStyles.title}
          >
            Create your account
          </Text>

          <Text
            style={registerDetailsStyles.subtitle}
          >
            Enter your details to get started.
          </Text>

          <View
            style={registerDetailsStyles.form}
          >
            <View>
              <Text style={commonStyles.fieldLabel}>
                Name
              </Text>

              <TextInput
                style={commonStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                autoCapitalize="words"
              />
            </View>

            <View>
              <Text style={commonStyles.fieldLabel}>
                Email
              </Text>

              <TextInput
                style={commonStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text style={commonStyles.fieldLabel}>
                Password
              </Text>

              <TextInput
                style={commonStyles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text style={commonStyles.fieldLabel}>
                Confirm password
              </Text>

              <TextInput
                style={commonStyles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Enter it again"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {error ? (
            <Text style={commonStyles.errorText}>
              {error}
            </Text>
          ) : null}

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={[
              commonStyles.primaryButton,
              registerDetailsStyles.submitButton,
              loading &&
                commonStyles.loadingButton,
            ]}
          >
            <Text style={commonStyles.primaryButtonText}>
              {loading
                ? 'Creating account...'
                : 'Create account'}
            </Text>
          </Pressable>

          <Text
            style={
              registerDetailsStyles.loginPrompt
            }
          >
            Already have an account?{' '}

            <Text
              style={commonStyles.linkText}
              onPress={() =>
                router.push('/login')
              }
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}