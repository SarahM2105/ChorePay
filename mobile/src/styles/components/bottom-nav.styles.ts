import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const bottomNavStyles =
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: 10,
    },

    nav: {
      width: '100%',
      maxWidth: 620,
      alignSelf: 'center',

      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },

    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },

    iconContainer: {
      minWidth: 38,
      height: 32,
      borderRadius: 11,

      alignItems: 'center',
      justifyContent: 'center',
    },

    activeIconContainer: {
      backgroundColor:
        colors.primaryLight,
    },

    label: {
      color: colors.textMuted,
      fontSize: 10,
      fontWeight: '600',
    },

    activeLabel: {
      color: colors.primary,
      fontWeight: '800',
    },
  });