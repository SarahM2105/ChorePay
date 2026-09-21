import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const progressStyles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 110,
    },

    page: {
      width: '100%',
      maxWidth: 1000,
    },

    header: {
      marginBottom: 22,
    },

    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '900',
    },

    subtitle: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 5,
    },

    heroCard: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 22,
      marginBottom: 16,
    },

    levelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14,
    },

    levelIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    levelTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '900',
    },

    xpText: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 2,
    },

    xpBarBackground: {
      height: 10,
      backgroundColor: '#EEEAF2',
      borderRadius: 999,
      overflow: 'hidden',
    },

    xpBarFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 999,
    },

    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 14,
    },

    statCard: {
      flexGrow: 1,
      flexBasis: 200,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 18,
    },

    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },

    purpleIcon: {
      backgroundColor: colors.primaryLight,
    },

    orangeIcon: {
      backgroundColor: colors.orangeLight,
    },

    tealIcon: {
      backgroundColor: colors.tealLight,
    },

    redIcon: {
      backgroundColor: colors.redLight,
    },

    statNumber: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '900',
    },

    statLabel: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 3,
    },

    detailCard: {
      marginTop: 16,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 18,
    },

    detailTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '900',
      marginBottom: 6,
    },

    detailText: {
      color: colors.textMuted,
      fontSize: 13,
    },

    loadingText: {
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 60,
    },

    errorText: {
      color: colors.error,
      textAlign: 'center',
      marginTop: 60,
    },
  });