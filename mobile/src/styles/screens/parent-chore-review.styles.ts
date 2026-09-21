import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const parentChoreReviewStyles =
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
      marginBottom: 24,
    },

    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
    },

    backText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '800',
    },

    card: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      padding: 18,
      marginBottom: 16,
    },

    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '900',
      marginBottom: 6,
    },

    submittedBy: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: 14,
    },

    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.orangeLight,
      marginBottom: 14,
    },

    statusText: {
      color: '#D99419',
      fontSize: 11,
      fontWeight: '900',
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '900',
      marginBottom: 12,
    },

    bodyText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 21,
    },

    image: {
      width: '100%',
      height: 320,
      borderRadius: 16,
    },

    checklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 9,
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

    feedbackInput: {
      minHeight: 110,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: 12,
      color: colors.text,
      backgroundColor: colors.background,
      textAlignVertical: 'top',
    },

    actionRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },

    rejectButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.red,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
    },

    rejectText: {
      color: colors.red,
      fontSize: 14,
      fontWeight: '900',
    },

    approveButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
    },

    approveText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: '900',
    },

    disabledButton: {
      opacity: 0.55,
    },

    errorText: {
      color: colors.error,
      fontSize: 13,
      marginBottom: 12,
    },

    loadingText: {
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 50,
    },
  });