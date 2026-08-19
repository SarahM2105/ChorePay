import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const registerDetailsStyles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: 500,
  },

  pageDesktop: {
    maxWidth: 1100,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 70,
  },

  infoPanel: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 32,
    padding: 48,
    justifyContent: 'center',
  },

  logoDesktop: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 40,
  },

  infoTitle: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800',
    marginBottom: 18,
  },

  infoText: {
    fontSize: 18,
    lineHeight: 28,
  },

  content: {
    width: '100%',
  },

  contentDesktop: {
    flex: 1,
    maxWidth: 500,
    justifyContent: 'center',
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },

  backText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  logo: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 26,
  },

  roleLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },

  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 26,
  },

  form: {
    gap: 16,
  },

  submitButton: {
    marginTop: 24,
  },

  loginPrompt: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 15,
  },
});