import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const parentDashboardStyles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      alignItems: 'center',
      paddingHorizontal: 22,
      paddingTop: 24,
      paddingBottom: 120,
    },

    page: {
      width: '100%',
      maxWidth: 1180,
    },

    /* TOP BAR */

    topBar: {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
},

    brand: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    brandChore: {
      fontSize: 25,
      fontWeight: '900',
      color: colors.text,
      letterSpacing: 0.5,
    },

    brandPay: {
      fontSize: 25,
      fontWeight: '900',
      color: colors.primary,
      letterSpacing: 0.5,
    },

    topActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    notificationButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },

    notificationBadge: {
      position: 'absolute',
      right: -3,
      top: -4,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 5,
      borderRadius: 9,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    notificationBadgeText: {
      color: colors.white,
      fontSize: 10,
      fontWeight: '800',
    },

    logoutButton: {
      height: 42,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },

    logoutText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
    },

    /* GREETING */

    header: {
  marginBottom: 24,
},

    welcome: {
  color: colors.text,
  fontSize: 30,
  lineHeight: 38,
  fontWeight: '900',
  marginBottom: 6,
},

    subtitle: {
      color: colors.textMuted,
      fontSize: 16,
      lineHeight: 24,
    },

    /* STATS */

    statsGrid: {
      gap: 12,
      marginBottom: 22,
    },

    statsGridDesktop: {
      flexDirection: 'row',
    },

    statCard: {
      flex: 1,
      minHeight: 112,
      backgroundColor: colors.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },

    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },

    purpleIcon: {
      backgroundColor: colors.primaryLight,
    },

    tealIcon: {
      backgroundColor: colors.tealLight,
    },

    orangeIcon: {
      backgroundColor: colors.orangeLight,
    },

    statNumber: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '900',
      marginBottom: 2,
    },

    statLabel: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },

    /* MAIN GRID */

    mainGrid: {
      gap: 16,
      marginBottom: 16,
    },

    mainGridDesktop: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },

    choresCard: {
      flex: 1.65,
      backgroundColor: colors.white,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 22,
    },

    quickActionsCard: {
      flex: 0.85,
      backgroundColor: colors.white,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 22,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 19,
      fontWeight: '900',
    },

    sectionCount: {
      minWidth: 28,
      height: 28,
      borderRadius: 14,
      paddingHorizontal: 8,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    sectionCountText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '800',
    },

    emptyChores: {
      minHeight: 175,
      backgroundColor: colors.selectedBackground,
      borderRadius: 18,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyIcon: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 13,
    },

    emptyTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '800',
      marginBottom: 5,
      textAlign: 'center',
    },

    emptyText: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },

    createChoreButton: {
      marginTop: 16,
      backgroundColor: colors.primary,
      borderRadius: 14,
      minHeight: 48,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },

    createChoreButtonText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: '800',
    },

    quickAction: {
      minHeight: 58,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      marginBottom: 10,
      gap: 12,
    },

    quickActionPrimary: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
    },

    quickActionIcon: {
      width: 36,
      height: 36,
      borderRadius: 11,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },

    quickActionTextContainer: {
      flex: 1,
    },

    quickActionTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '800',
    },

    quickActionSubtitle: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 2,
    },

    /* LOWER GRID */

    lowerGrid: {
      gap: 16,
    },

    lowerGridDesktop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    familyPanel: {
      flex: 1.35,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 22,
    },

    requestsPanel: {
      flex: 0.85,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 22,
    },

    familyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      marginBottom: 18,
    },

    familyName: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '900',
      marginBottom: 4,
    },

    familyHint: {
      color: colors.textMuted,
      fontSize: 12,
    },

    joinCodeBox: {
      backgroundColor: colors.primaryLight,
      borderRadius: 13,
      paddingHorizontal: 14,
      paddingVertical: 10,
      alignItems: 'center',
    },

    joinCodeLabel: {
      color: colors.textMuted,
      fontSize: 9,
      fontWeight: '700',
      marginBottom: 3,
      textTransform: 'uppercase',
    },

    joinCode: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: '900',
      letterSpacing: 2,
    },

    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 58,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingVertical: 10,
    },

    memberAvatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.tealLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 11,
    },

    memberInfo: {
      flex: 1,
    },

    memberName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '800',
      marginBottom: 2,
    },

    memberJoined: {
      color: colors.textMuted,
      fontSize: 11,
    },

    memberRoleBadge: {
  backgroundColor: colors.primaryLight,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 12,
},

memberRoleText: {
  color: colors.primary,
  fontSize: 10,
  fontWeight: '800',
},

    requestCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
    },

    requestTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },

    requestAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.orangeLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },

    requestNameContainer: {
      flex: 1,
    },

    requestName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '800',
    },

    requestMeta: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 2,
    },

    requestActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 11,
    },

    approveButton: {
      flex: 1,
      minHeight: 38,
      borderRadius: 11,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    approveText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '800',
    },

    rejectButton: {
      flex: 1,
      minHeight: 38,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },

    rejectText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '800',
    },

    noRequests: {
      minHeight: 140,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 18,
    },

    noRequestsText: {
      color: colors.textMuted,
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 19,
      marginTop: 8,
    },

    errorText: {
      color: colors.error,
      fontSize: 13,
      marginBottom: 10,
    },

    /* NO FAMILY */

    onboardingCard: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      padding: 30,
      alignItems: 'center',
    },

    onboardingIcon: {
      width: 70,
      height: 70,
      borderRadius: 22,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18,
    },

    onboardingTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '900',
      marginBottom: 8,
      textAlign: 'center',
    },

    onboardingText: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
      maxWidth: 460,
      marginBottom: 20,
    },

    choreList: {
  gap: 10,
},

choreRow: {
  backgroundColor: colors.background,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 16,
  padding: 14,

  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},

choreIcon: {
  width: 46,
  height: 46,
  borderRadius: 15,

  backgroundColor:
    colors.primaryLight,

  alignItems: 'center',
  justifyContent: 'center',
},

choreInfo: {
  flex: 1,
},

choreTopRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  marginBottom: 8,
},

choreTitle: {
  flex: 1,
  color: colors.text,
  fontSize: 15,
  fontWeight: '900',
},

choreStatus: {
  borderRadius: 999,
  paddingHorizontal: 9,
  paddingVertical: 4,
},

choreStatusAssigned: {
  backgroundColor:
    colors.primaryLight,
},

choreStatusSubmitted: {
  backgroundColor:
    colors.orangeLight,
},

choreStatusDanger: {
  backgroundColor:
    colors.redLight,
},

choreStatusText: {
  color: colors.primary,
  fontSize: 9,
  fontWeight: '900',
},

choreStatusSubmittedText: {
  color: '#C98200',
},

choreStatusDangerText: {
  color: colors.error,
},

choreMeta: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 12,
},

choreMetaItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},

choreMetaText: {
  color: colors.textMuted,
  fontSize: 11,
  fontWeight: '600',
},

choreRewardText: {
  color: '#D99419',
  fontSize: 11,
  fontWeight: '800',
},
  });