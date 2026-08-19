import { router } from 'expo-router';
import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { commonStyles } from '../styles/common.styles';
import { homeStyles } from '../styles/screens/home.styles';

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  return (
    <View style={commonStyles.centeredScreen}>
      <View
        style={[
          homeStyles.page,
          isDesktop && homeStyles.pageDesktop,
        ]}
      >
        {isDesktop && (
          <View style={homeStyles.desktopBrandPanel}>
            <Text style={homeStyles.bigLogo}>
              ChorePay
            </Text>

            <Text style={homeStyles.desktopMessage}>
              Turn everyday chores into progress,
              rewards and something worth completing.
            </Text>

            <View style={homeStyles.featureCard}>
              <View style={homeStyles.featureRow}>
                <Text style={homeStyles.featureIcon}>
                  ✓
                </Text>

                <View>
                  <Text style={homeStyles.featureTitle}>
                    Assign chores
                  </Text>

                  <Text style={homeStyles.featureDescription}>
                    Keep everyday tasks organised.
                  </Text>
                </View>
              </View>

              <View style={homeStyles.featureRow}>
                <Text style={homeStyles.featureIcon}>
                  ★
                </Text>

                <View>
                  <Text style={homeStyles.featureTitle}>
                    Earn coins & XP
                  </Text>

                  <Text style={homeStyles.featureDescription}>
                    Turn completed chores into progress.
                  </Text>
                </View>
              </View>

              <View style={homeStyles.featureRow}>
                <Text style={homeStyles.featureIcon}>
                  🎁
                </Text>

                <View>
                  <Text style={homeStyles.featureTitle}>
                    Unlock rewards
                  </Text>

                  <Text style={homeStyles.featureDescription}>
                    Spend earned coins on family rewards.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View
          style={[
            homeStyles.content,
            isDesktop && homeStyles.contentDesktop,
          ]}
        >
          {!isDesktop && (
            <Text style={homeStyles.logo}>
              ChorePay
            </Text>
          )}

          <Text
            style={[
              homeStyles.title,
              isDesktop && homeStyles.titleDesktop,
            ]}
          >
            Chores made rewarding.
          </Text>

          <Text style={homeStyles.subtitle}>
            Complete chores, earn rewards and keep
            the whole family organised.
          </Text>

          <View style={homeStyles.buttons}>
            <Pressable
              style={commonStyles.primaryButton}
              onPress={() => router.push('/register')}
            >
              <Text style={commonStyles.primaryButtonText}>
                Create account
              </Text>
            </Pressable>

            <Pressable
              style={commonStyles.secondaryButton}
              onPress={() => router.push('/login')}
            >
              <Text style={commonStyles.secondaryButtonText}>
                Log in
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}