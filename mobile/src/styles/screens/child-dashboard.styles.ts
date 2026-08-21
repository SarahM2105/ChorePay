import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const childDashboardStyles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scroll: {
      flex: 1,
    },

    scrollContent: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 22,
      paddingBottom: 40,
    },

    page: {
      width: '100%',
      maxWidth: 1100,
    },

    /* TOP BAR */

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 26,
    },

    iconButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    brand: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    brandChore: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '900',
    },

    brandPay: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: '900',
    },

    topActions: {
      flexDirection: 'row',
      gap: 8,
    },

    /* MAIN PROFILE AREA */

    hero: {
      gap: 14,
      marginBottom: 14,
    },

    heroDesktop: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },

    profileCard: {
      flex: 1.45,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 20,
    },

    profileTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },

    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    profileInfo: {
      flex: 1,
    },

    greeting: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '900',
      marginBottom: 7,
    },

    levelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      marginBottom: 9,
    },

    levelIcon: {
      width: 27,
      height: 27,
      borderRadius: 9,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    levelText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '800',
    },

    xpBarBackground: {
      height: 9,
      backgroundColor: '#EEEAF2',
      borderRadius: 999,
      overflow: 'hidden',
      marginBottom: 5,
    },

    xpBarFill: {
      width: '20%',
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 999,
    },

    xpText: {
      color: colors.textMuted,
      fontSize: 10,
      textAlign: 'right',
    },

    coinsCard: {
      flex: 0.75,
      backgroundColor: colors.cream,
      borderWidth: 1,
      borderColor: '#F2DFC1',
      borderRadius: 22,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
    },

    coinIcon: {
      width: 50,
      height: 50,
      borderRadius: 17,
      backgroundColor: colors.orangeLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    coinNumber: {
      color: colors.text,
      fontSize: 25,
      fontWeight: '900',
    },

    coinLabel: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 1,
    },

    /* STREAK */

    streakCard: {
      backgroundColor: colors.tealLight,
      borderWidth: 1,
      borderColor: '#C7E6DF',
      borderRadius: 18,
      paddingHorizontal: 17,
      paddingVertical: 15,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },

    streakIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    streakInfo: {
      flex: 1,
    },

    streakTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '900',
      marginBottom: 2,
    },

    streakText: {
      color: colors.textMuted,
      fontSize: 11,
    },

    /* CONTENT GRID */

    contentGrid: {
      gap: 16,
    },

    contentGridDesktop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    questsColumn: {
      flex: 1.55,
    },

    sideColumn: {
      flex: 0.85,
      gap: 16,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 13,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 19,
      fontWeight: '900',
    },

    countBadge: {
      minWidth: 28,
      height: 28,
      paddingHorizontal: 8,
      borderRadius: 14,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    countText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '900',
    },

    /* QUESTS */

    questPanel: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 20,
    },

    emptyQuest: {
      backgroundColor: colors.selectedBackground,
      borderRadius: 18,
      minHeight: 190,
      padding: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyQuestIcon: {
      width: 58,
      height: 58,
      borderRadius: 19,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 13,
    },

    emptyQuestTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '900',
      marginBottom: 5,
    },

    emptyQuestText: {
      color: colors.textMuted,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
      maxWidth: 360,
    },

    /* SHOP PREVIEW */

    shopCard: {
      backgroundColor: colors.primaryLight,
      borderRadius: 20,
      padding: 19,
      borderWidth: 1,
      borderColor: '#DDD4FF',
    },

    shopHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    shopIcon: {
      width: 43,
      height: 43,
      borderRadius: 14,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    shopInfo: {
      flex: 1,
    },

    shopTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '900',
    },

    shopText: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 2,
    },

    /* FAMILY MINI CARD */

    familyCard: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      padding: 19,
    },

    familyTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
    },

    familyIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: colors.tealLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    familyInfo: {
      flex: 1,
    },

    familyLabel: {
      color: colors.textMuted,
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 2,
    },

    familyName: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '900',
    },

    /* NO FAMILY / JOIN REQUEST */

    onboardingCard: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 28,
      alignItems: 'center',
      maxWidth: 620,
      width: '100%',
      alignSelf: 'center',
    },

    onboardingIcon: {
      width: 68,
      height: 68,
      borderRadius: 22,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },

    onboardingTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: 7,
    },

    onboardingText: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      maxWidth: 450,
      marginBottom: 18,
    },

    primaryButton: {
      minHeight: 48,
      paddingHorizontal: 22,
      borderRadius: 14,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },

    primaryButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: '900',
    },

    secondaryButton: {
      minHeight: 44,
      paddingHorizontal: 18,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },

    secondaryButtonText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '800',
    },

    statusBadge: {
      backgroundColor: colors.orangeLight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      marginBottom: 12,
    },

    statusBadgeText: {
      color: '#C98200',
      fontSize: 11,
      fontWeight: '900',
    },

    error: {
      color: colors.error,
      fontSize: 13,
      marginBottom: 14,
      textAlign: 'center',
    },


    questList: {
  gap: 10,
},

questCard: {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 17,
  padding: 15,

  flexDirection: 'row',
  alignItems: 'center',
  gap: 13,
},

questIcon: {
  width: 48,
  height: 48,
  borderRadius: 16,
  backgroundColor: colors.tealLight,
  alignItems: 'center',
  justifyContent: 'center',
},

questInfo: {
  flex: 1,
},

questTitle: {
  color: colors.text,
  fontSize: 15,
  fontWeight: '900',
  marginBottom: 7,
},

questMeta: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 10,
},

questMetaItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},

questMetaText: {
  color: colors.textMuted,
  fontSize: 11,
  fontWeight: '600',
},

coinText: {
  color: '#D99419',
  fontSize: 11,
  fontWeight: '800',
},

xpMetaText: {
  color: colors.primary,
  fontSize: 11,
  fontWeight: '800',
},

questStatus: {
  alignSelf: 'flex-start',
  borderRadius: 999,
  paddingHorizontal: 9,
  paddingVertical: 4,
  marginBottom: 6,
},

assignedStatus: {
  backgroundColor: colors.primaryLight,
},

submittedStatus: {
  backgroundColor: colors.orangeLight,
},

rejectedStatus: {
  backgroundColor: colors.redLight,
},

overdueStatus: {
  backgroundColor: colors.redLight,
},

questStatusText: {
  color: colors.primary,
  fontSize: 9,
  fontWeight: '900',
  letterSpacing: 0.4,
},

questStatusDangerText: {
  color: colors.error,
},

questStatusSubmittedText: {
  color: '#C98200',
},

  });

  