import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import { saveToken } from '../storage/session.storage';

import { useState } from 'react';

import {
  Modal,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { loginUser } from '../services/auth.service';

import { commonStyles } from '../styles/common.styles';

import { loginStyles } from '../styles/screens/login.styles';

export default function LoginScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  const params = useLocalSearchParams<{
    registered?: string;
  }>();

  const [showRegistrationSuccess, setShowRegistrationSuccess] =
    useState(params.registered === 'true');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError(
        'Please enter your email and password.'
      );

      return;
    }

    try {
      setLoading(true);

      const user = await loginUser({
        email: email.trim(),
        password,
        });

    await saveToken(user.token);

    router.replace('/dashboard');

      console.log(
        'Logged in successfully:',
        user
      );

      /*
       * Next we will securely store the JWT
       * and decide where to send the user
       * based on their account/family state.
       */
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
    <>
      <View style={commonStyles.centeredScreen}>
        <View
          style={[
            loginStyles.page,
            isDesktop &&
              loginStyles.pageDesktop,
          ]}
        >
          {isDesktop && (
            <View style={loginStyles.infoPanel}>
              <Text style={loginStyles.logoDesktop}>
                ChorePay
              </Text>

              <Text style={loginStyles.infoTitle}>
                Welcome back.
              </Text>

              <Text style={loginStyles.infoText}>
                Pick up where you left off,
                manage chores and keep making
                progress.
              </Text>
            </View>
          )}

          <View
            style={[
              loginStyles.content,
              isDesktop &&
                loginStyles.contentDesktop,
            ]}
          >
            <Pressable
              style={loginStyles.backButton}
              onPress={() =>
                router.replace('/')
              }
            >
              <Text style={commonStyles.linkText}>
                ← Back to home
              </Text>
            </Pressable>

            {!isDesktop && (
              <Text style={loginStyles.logo}>
                ChorePay
              </Text>
            )}

            <Text style={loginStyles.title}>
              Log in
            </Text>

            <Text style={loginStyles.subtitle}>
              Enter your details to continue to
              ChorePay.
            </Text>

            <View style={loginStyles.form}>
              <View>
                <Text
                  style={commonStyles.fieldLabel}
                >
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
                <Text
                  style={commonStyles.fieldLabel}
                >
                  Password
                </Text>

                <TextInput
                  style={commonStyles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
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
              disabled={loading}
              onPress={handleLogin}
              style={[
                commonStyles.primaryButton,
                loginStyles.loginButton,
                loading &&
                  commonStyles.loadingButton,
              ]}
            >
              <Text
                style={
                  commonStyles.primaryButtonText
                }
              >
                {loading
                  ? 'Logging in...'
                  : 'Log in'}
              </Text>
            </Pressable>

            <Text
              style={loginStyles.registerPrompt}
            >
              Don't have an account?{' '}

              <Text
                style={commonStyles.linkText}
                onPress={() =>
                  router.push('/register')
                }
              >
                Create account
              </Text>
            </Text>
          </View>
        </View>
      </View>

      <Modal
        visible={showRegistrationSuccess}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowRegistrationSuccess(false)
        }
      >
        <View style={loginStyles.modalOverlay}>
          <View style={loginStyles.successModal}>
            <Text style={loginStyles.successIcon}>
              ✓
            </Text>

            <Text style={loginStyles.successTitle}>
              Account created!
            </Text>

            <Text
              style={loginStyles.successMessage}
            >
              Your ChorePay account has been
              registered successfully. You can now
              log in.
            </Text>

            <Pressable
              style={commonStyles.primaryButton}
              onPress={() =>
                setShowRegistrationSuccess(false)
              }
            >
              <Text
                style={
                  commonStyles.primaryButtonText
                }
              >
                Continue to login
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}