import { router } from 'expo-router';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';

import { commonStyles } from '../styles/common.styles';
import { dashboardStyles } from '../styles/screens/dashboard.styles';

export default function ChildDashboardScreen() {
  const {
    user,
    signOut,
  } = useAuth();

  const handleLogout = async () => {
    await signOut();

    router.replace('/login');
  };

  return (
    <View style={commonStyles.centeredScreen}>
      <View style={dashboardStyles.page}>
        <Text style={dashboardStyles.logo}>
          ChorePay
        </Text>

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

        <View style={dashboardStyles.card}>
          <Text style={dashboardStyles.cardTitle}>
            Your chores
          </Text>

          <Text style={dashboardStyles.cardText}>
            Your assigned chores will appear here.
          </Text>
        </View>

        <Pressable
          style={[
            commonStyles.secondaryButton,
            dashboardStyles.logoutButton,
          ]}
          onPress={handleLogout}
        >
          <Text
            style={
              commonStyles.secondaryButtonText
            }
          >
            Log out
          </Text>
        </Pressable>
      </View>
    </View>
  );
}