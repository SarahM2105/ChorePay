import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  bottomNavStyles as styles,
} from '../styles/components/bottom-nav.styles';

type AppBottomNavProps = {
  active:
    | 'home'
    | 'chores'
    | 'shop'
    | 'progress'
    | 'profile'
    | 'family';

  userType: 'PARENT' | 'CHILD';
};

export function AppBottomNav({
  active,
  userType,
}: AppBottomNavProps) {
  const items = [
    {
      key: 'home',
      label: 'Home',
      icon: 'home-outline' as const,
      activeIcon: 'home' as const,

      onPress: () => {
        if (userType === 'PARENT') {
          router.replace(
            '/parent-dashboard'
          );
        } else {
          router.replace(
            '/child-dashboard'
          );
        }
      },
    },

    {
      key: 'chores',
      label: 'Chores',
      icon:
        'clipboard-outline' as const,
      activeIcon:
        'clipboard' as const,

      onPress: () => {
        /*
         * TEMPORARY:
         * Parent still goes directly
         * to Create Chore.
         *
         * Next we'll replace this with
         * /chores, which will show the
         * family's chore list.
         */
        if (userType === 'PARENT') {
          router.push(
            '/chores'
          );
        }
      },
    },

    {
      key: 'shop',
      label: 'Shop',
      icon: 'bag-outline' as const,
      activeIcon: 'bag' as const,

      onPress: () => {
        // Shop screen comes later.
      },
    },

    {
      key: 'progress',
      label: 'Progress',
      icon:
        'bar-chart-outline' as const,
      activeIcon:
        'bar-chart' as const,

      onPress: () => {
        // Progress screen comes later.
      },
    },

    userType === 'PARENT'
      ? {
          key: 'family',
          label: 'Family',
          icon:
            'people-outline' as const,
          activeIcon:
            'people' as const,

          onPress: () => {
            router.push('/family');
          },
        }
      : {
          key: 'profile',
          label: 'Profile',
          icon:
            'person-outline' as const,
          activeIcon:
            'person' as const,

          onPress: () => {
            // Child profile screen
            // comes later.
          },
        },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        {items.map((item) => {
          const selected =
            active === item.key;

          return (
            <Pressable
              key={item.key}
              style={styles.item}
              onPress={item.onPress}
            >
              <View
                style={[
                  styles.iconContainer,

                  selected &&
                    styles.activeIconContainer,
                ]}
              >
                <Ionicons
                  name={
                    selected
                      ? item.activeIcon
                      : item.icon
                  }
                  size={21}
                  color={
                    selected
                      ? '#6C5CE7'
                      : '#5F5A6D'
                  }
                />
              </View>

              <Text
                style={[
                  styles.label,

                  selected &&
                    styles.activeLabel,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}