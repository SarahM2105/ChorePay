import {
  StyleSheet,
} from 'react-native';

import {
  colors,
} from '../colors';

export const choresStyles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    scrollContent: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 120,
    },

    page: {
      width: '100%',
      maxWidth: 1180,
    },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 30,
    },

    brand: {
      flexDirection: 'row',
    },

    brandChore: {
      color: colors.text,
      fontSize: 23,
      fontWeight: '900',
    },

    brandPay: {
      color: colors.primary,
      fontSize: 23,
      fontWeight: '900',
    },

    createButtonTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      backgroundColor:
        colors.primary,
      borderRadius: 13,
      paddingHorizontal: 16,
      paddingVertical: 11,
    },

    createButtonText: {
      color: colors.white,
      fontWeight: '900',
      fontSize: 13,
    },

    header: {
      marginBottom: 22,
    },

    title: {
      color: colors.text,
      fontSize: 30,
      fontWeight: '900',
      marginBottom: 6,
    },

    subtitle: {
      color: colors.textMuted,
      fontSize: 15,
    },

    summaryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20,
    },

    summaryCard: {
      flex: 1,
      minWidth: 180,
      backgroundColor:
        colors.white,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 17,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    summaryIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },

    purpleIcon: {
      backgroundColor:
        colors.primaryLight,
    },

    orangeIcon: {
      backgroundColor:
        colors.orangeLight,
    },

    tealIcon: {
      backgroundColor:
        colors.tealLight,
    },

    summaryNumber: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '900',
    },

    summaryLabel: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 2,
      fontWeight: '700',
    },

    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },

    filterButton: {
      paddingHorizontal: 15,
      paddingVertical: 9,
      borderRadius: 999,
      borderWidth: 1,
      borderColor:
        colors.border,
      backgroundColor:
        colors.white,
    },

    filterButtonSelected: {
      borderColor:
        colors.primary,
      backgroundColor:
        colors.primaryLight,
    },

    filterText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '800',
    },

    filterTextSelected: {
      color: colors.primary,
    },

    card: {
      backgroundColor:
        colors.white,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 22,
      padding: 20,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 18,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '900',
    },

    countBadge: {
      minWidth: 30,
      height: 30,
      paddingHorizontal: 8,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        colors.primaryLight,
    },

    countText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: '900',
    },

    choreList: {
      gap: 10,
    },

    choreCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 17,
      padding: 15,
      backgroundColor:
        colors.white,
    },

    choreIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      backgroundColor:
        colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    choreContent: {
      flex: 1,
    },

    choreTop: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
      gap: 10,
    },

    choreTitleArea: {
      flex: 1,
    },

    choreTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '900',
    },

    choreDescription: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 3,
    },

    statusBadge: {
      borderRadius: 999,
      paddingHorizontal: 9,
      paddingVertical: 5,
      backgroundColor:
        colors.primaryLight,
    },

    statusText: {
      color: colors.primary,
      fontSize: 9,
      fontWeight: '900',
    },

    waitingBadge: {
      backgroundColor:
        colors.orangeLight,
    },

    waitingText: {
      color: '#C98200',
    },

    completedBadge: {
      backgroundColor:
        colors.tealLight,
    },

    completedText: {
      color: '#4B988E',
    },

    dangerBadge: {
      backgroundColor:
        colors.redLight,
    },

    dangerText: {
      color: colors.error,
    },

    createdByRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 8,
    },

    createdByText: {
      color: colors.textMuted,
      fontSize: 10,
      fontWeight: '600',
    },

    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 8,
    },

    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    metaText: {
      color: colors.textMuted,
      fontSize: 10,
      fontWeight: '600',
    },

    rewardText: {
      color: '#D99419',
      fontSize: 10,
      fontWeight: '800',
    },

    createButton: {
      marginTop: 18,
      backgroundColor:
        colors.primary,
      minHeight: 52,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
    },

    errorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor:
        colors.redLight,
    },

    errorText: {
      flex: 1,
      color: colors.error,
      fontSize: 12,
    },

    emptyState: {
      alignItems: 'center',
      paddingVertical: 42,
    },

    emptyIcon: {
      width: 58,
      height: 58,
      borderRadius: 18,
      backgroundColor:
        colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },

    emptyTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '900',
    },

    emptyText: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 5,
      textAlign: 'center',
    },
  });