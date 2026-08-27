import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const createChoreStyles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
    },

    page: {
      width: '100%',
      maxWidth: 720,
    },

    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 34,
    },

    backButton: {
      alignSelf: 'flex-start',
    },

    title: {
      fontSize: 38,
      fontWeight: '800',
      marginBottom: 10,
    },

    subtitle: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 30,
    },

    formCard: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 24,
      gap: 20,
    },

    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },

    difficultyRow: {
      flexDirection: 'row',
      gap: 10,
    },

    difficultyButton: {
      flex: 1,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 13,
      alignItems: 'center',
    },

    difficultySelected: {
      borderColor: colors.primary,
      backgroundColor:
        colors.selectedBackground,
    },

    difficultyText: {
      fontSize: 14,
      fontWeight: '700',
    },

    difficultySelectedText: {
      color: colors.primary,
    },

    row: {
      flexDirection: 'row',
      gap: 14,
    },

    halfField: {
      flex: 1,
    },

    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
      paddingVertical: 4,
    },

    switchInfo: {
      flex: 1,
    },

    switchTitle: {
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 3,
    },

    switchDescription: {
      fontSize: 13,
      lineHeight: 19,
    },

    submitButton: {
      marginTop: 24,
    },

    successCard: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 28,
    },

    successIcon: {
      fontSize: 34,
      marginBottom: 12,
    },

    successTitle: {
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 8,
    },

    successText: {
      fontSize: 15,
      lineHeight: 23,
      marginBottom: 24,
    },

    assignmentSection: {
  marginTop: 20,
},

assignmentTitle: {
  fontSize: 20,
  fontWeight: '900',
  marginBottom: 6,
},

assignmentSubtitle: {
  fontSize: 14,
  lineHeight: 21,
  marginBottom: 18,
},

childrenList: {
  gap: 10,
  marginBottom: 20,
},

childCard: {
  minHeight: 58,
  borderWidth: 1.5,
  borderColor: colors.border,
  borderRadius: 15,
  paddingHorizontal: 16,
  paddingVertical: 12,

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

childCardSelected: {
  borderColor: colors.primary,
  backgroundColor: colors.primaryLight,
},

childName: {
  fontSize: 15,
  fontWeight: '800',
},

childRole: {
  fontSize: 11,
  marginTop: 3,
},

selectionCircle: {
  width: 24,
  height: 24,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: colors.border,

  alignItems: 'center',
  justifyContent: 'center',
},

selectionCircleSelected: {
  borderColor: colors.primary,
  backgroundColor: colors.primary,
},

selectionCheck: {
  color: colors.white,
  fontSize: 13,
  fontWeight: '900',
},

dateRow: {
  flexDirection: 'row',
  gap: 12,
  marginBottom: 20,
},

dateField: {
  flex: 1,
},

assignedCard: {
  backgroundColor: colors.primaryLight,
  borderRadius: 18,
  padding: 20,
  marginTop: 18,
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

durationRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},

durationButton: {
  borderWidth: 1.5,
  borderColor: colors.border,
  backgroundColor: colors.white,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 10,
},

durationButtonSelected: {
  borderColor: colors.primary,
  backgroundColor: colors.primaryLight,
},

durationText: {
  color: colors.textMuted,
  fontSize: 12,
  fontWeight: '800',
},

durationTextSelected: {
  color: colors.primary,
},

customTimeLabel: {
  color: colors.textMuted,
  fontSize: 11,
  fontWeight: '600',
  marginTop: 12,
  marginBottom: 7,
},

rewardCard: {
  backgroundColor: colors.primaryLight,
  borderRadius: 18,
  padding: 18,
},

rewardHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 15,
},

rewardTitle: {
  color: colors.text,
  fontSize: 15,
  fontWeight: '900',
},

autoBadge: {
  backgroundColor: colors.white,
  borderRadius: 999,
  paddingHorizontal: 9,
  paddingVertical: 5,
},

autoBadgeText: {
  color: colors.primary,
  fontSize: 9,
  fontWeight: '900',
  letterSpacing: 0.5,
},

rewardValues: {
  flexDirection: 'row',
  alignItems: 'center',
},

rewardValue: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 9,
},

rewardEmoji: {
  fontSize: 25,
},

rewardNumber: {
  color: colors.text,
  fontSize: 21,
  fontWeight: '900',
},

rewardLabel: {
  color: colors.textMuted,
  fontSize: 10,
  fontWeight: '700',
},

rewardDivider: {
  width: 1,
  height: 38,
  backgroundColor: colors.border,
},

rewardHint: {
  color: colors.textMuted,
  fontSize: 11,
  textAlign: 'center',
  marginTop: 13,
},

helperText: {
  color: colors.textMuted,
  fontSize: 10,
  marginTop: 7,
  lineHeight: 15,
},

advancedButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 14,
  padding: 14,
  backgroundColor: colors.background,
},

advancedTitle: {
  color: colors.text,
  fontSize: 13,
  fontWeight: '900',
},

advancedSubtitle: {
  color: colors.textMuted,
  fontSize: 10,
  marginTop: 2,
},

advancedChevron: {
  color: colors.primary,
  fontSize: 11,
  fontWeight: '900',
},

advancedPanel: {
  marginTop: -4,
},

dateInputLabel: {
  color: colors.textMuted,
  fontSize: 10,
  fontWeight: '700',
  marginBottom: 6,
},

pickerButton: {
  justifyContent: 'center',
},

pickerButtonText: {
  color: colors.text,
  fontSize: 14,
  fontWeight: '600',
},

pickerPlaceholder: {
  color: colors.textMuted,
  fontSize: 14,
},

  });