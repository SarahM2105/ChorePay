import { StyleSheet } from 'react-native';

import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  centeredScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 17,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.4,
  },

  loadingButton: {
    opacity: 0.6,
  },

  linkText: {
    color: colors.primary,
    fontWeight: '800',
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7,
  },

  input: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
  },

  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 16,
  },
});