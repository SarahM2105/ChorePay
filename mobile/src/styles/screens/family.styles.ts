import {
  StyleSheet,
} from 'react-native';

import {
  colors,
} from '../colors';

export const familyStyles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    loadingScreen: {
      flex: 1,
      backgroundColor:
        colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      color: colors.textMuted,
      fontSize: 15,
    },

    scrollContent: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 120,
    },

    page: {
      width: '100%',
      maxWidth: 1100,
    },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 32,
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

    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor:
        colors.white,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },

    backText: {
      color: colors.primary,
      fontWeight: '800',
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

    errorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor:
        colors.redLight,
      marginBottom: 18,
    },

    errorText: {
      flex: 1,
      color: colors.error,
      fontSize: 13,
      fontWeight: '600',
    },

    familyHero: {
      backgroundColor:
        colors.white,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 22,
      padding: 22,
      marginBottom: 18,
    },

    familyHeroTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      gap: 14,
    },

    familyIcon: {
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor:
        colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    familyHeroInfo: {
      flex: 1,
    },

    familyName: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '900',
    },

    familyMeta: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 3,
    },

    ownerBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor:
        colors.primaryLight,
    },

    ownerBadgeText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: '800',
    },

    codeCard: {
      backgroundColor:
        colors.tealLight,
      borderRadius: 17,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      gap: 14,
    },

    codeLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '900',
    },

    codeHint: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 3,
    },

    codeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      backgroundColor:
        colors.white,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 11,
    },

    codeText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '900',
      letterSpacing: 1,
    },

    card: {
      backgroundColor:
        colors.white,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 22,
      padding: 22,
      marginBottom: 18,
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

    sectionSubtitle: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 3,
    },

    countBadge: {
      minWidth: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor:
        colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },

    countText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '900',
    },

    membersList: {
      gap: 10,
    },

    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 13,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 15,
    },

    avatar: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor:
        colors.tealLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    ownerAvatar: {
      backgroundColor:
        colors.primaryLight,
    },

    memberInfo: {
      flex: 1,
    },

    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },

    memberName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '900',
    },

    youText: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: '800',
    },

    joinedText: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 3,
    },

    roleBadge: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor:
        colors.tealLight,
    },

    roleText: {
      color: '#4B988E',
      fontSize: 10,
      fontWeight: '900',
    },

    ownerRoleBadge: {
      backgroundColor:
        colors.primaryLight,
    },

    ownerRoleText: {
      color: colors.primary,
    },

    requestList: {
      gap: 12,
    },

    requestCard: {
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 16,
      padding: 15,
    },

    requestTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    requestAvatar: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor:
        colors.orangeLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    requestInfo: {
      flex: 1,
    },

    requestName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '900',
    },

    requestMeta: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 3,
    },

    requestRoleBadge: {
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor:
        colors.tealLight,
    },

    parentRequestBadge: {
      backgroundColor:
        colors.primaryLight,
    },

    requestRoleText: {
      color: colors.textMuted,
      fontSize: 9,
      fontWeight: '900',
    },

    ownerOnlyNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      backgroundColor:
        colors.background,
      borderRadius: 10,
      padding: 9,
    },

    ownerOnlyText: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '700',
    },

    requestActions: {
      flexDirection: 'row',
      justifyContent:
        'flex-end',
      gap: 8,
      marginTop: 13,
    },

    rejectButton: {
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 9,
    },

    rejectText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '800',
    },

    approveButton: {
      backgroundColor:
        colors.primary,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 9,
    },

    approveText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '800',
    },

    noRequests: {
      alignItems: 'center',
      paddingVertical: 24,
    },

    noRequestsTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '900',
      marginTop: 8,
    },

    noRequestsText: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 3,
    },

    ownerSettings: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor:
        colors.primaryLight,
      borderRadius: 18,
      padding: 18,
    },

    ownerSettingsIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor:
        colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },

    ownerSettingsInfo: {
      flex: 1,
    },

    ownerSettingsTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '900',
    },

    ownerSettingsText: {
      color: colors.textMuted,
      fontSize: 11,
      lineHeight: 17,
      marginTop: 3,
    },

    comingSoonBadge: {
      backgroundColor:
        colors.white,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },

    comingSoonText: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: '900',
    },

    emptyCard: {
      backgroundColor:
        colors.white,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 22,
      padding: 30,
      alignItems: 'center',
    },

    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '900',
      marginTop: 12,
    },

    emptyText: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 5,
      marginBottom: 18,
      textAlign: 'center',
    },

    primaryButton: {
      backgroundColor:
        colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
    },

    primaryButtonText: {
      color: colors.white,
      fontWeight: '900',
    },
  });