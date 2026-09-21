import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const childChoreStyles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: 110,
    },

    page: {
      width: '100%',
      maxWidth: 900,
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
    },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },

    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    backText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '800',
    },

    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '900',
      marginBottom: 8,
    },

    description: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 20,
    },

    card: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      padding: 18,
      marginBottom: 16,
    },

    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.primaryLight,
      marginBottom: 14,
    },

    statusText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: '900',
    },

    rewardRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 10,
    },

    rewardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },

    rewardText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '900',
      marginBottom: 12,
    },

    checklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
    },

    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    checkboxSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    checklistText: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
    },

    requiredText: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '700',
    },

    commentInput: {
      minHeight: 110,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: 12,
      color: colors.text,
      backgroundColor: colors.background,
      textAlignVertical: 'top',
    },

    feedbackCard: {
      backgroundColor: colors.orangeLight,
      borderRadius: 14,
      padding: 14,
      marginBottom: 16,
    },

    feedbackTitle: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '900',
      marginBottom: 5,
    },

    feedbackText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },

    photoButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderWidth: 1,
  borderColor: colors.primary,
  borderRadius: 14,
  paddingVertical: 12,
},

photoButtonText: {
  color: colors.primary,
  fontSize: 13,
  fontWeight: '800',
},

photoPreview: {
  width: '100%',
  height: 220,
  borderRadius: 14,
  marginTop: 12,
},

photoRequiredText: {
  color: colors.textMuted,
  fontSize: 12,
  marginBottom: 12,
},

    errorText: {
      color: colors.error,
      fontSize: 13,
      marginBottom: 12,
    },

    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },

    submitButtonDisabled: {
      opacity: 0.55,
    },

    submitButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: '900',
    },

    loadingText: {
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 50,
    },
  });