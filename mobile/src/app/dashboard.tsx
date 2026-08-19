import { router } from 'expo-router';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { commonStyles } from '../styles/common.styles';
import { dashboardStyles } from '../styles/screens/dashboard.styles';

export default function DashboardScreen() {
  return (
    <View style={commonStyles.centeredScreen}>
      <View style={dashboardStyles.content}>
        <Text style={dashboardStyles.logo}>
          ChorePay
        </Text>

        <Text style={dashboardStyles.title}>
          You're logged in 🎉
        </Text>

        <Text style={dashboardStyles.subtitle}>
          Your ChorePay dashboard will go here.
        </Text>

        <Pressable
          style={commonStyles.secondaryButton}
          onPress={() => router.replace('/')}
        >
          <Text style={commonStyles.secondaryButtonText}>
            Back to home
          </Text>
        </Pressable>
      </View>
    </View>
  );
}