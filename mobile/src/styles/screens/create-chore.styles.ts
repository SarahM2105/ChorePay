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

    logo: {
      fontSize: 24,
      fontWeight: '900',
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
  });