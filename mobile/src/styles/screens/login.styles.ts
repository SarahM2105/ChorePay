import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const loginStyles = StyleSheet.create({
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
    marginBottom: 28,
  },

  logo: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 30,
  },

  title: {
    fontSize: 38,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 28,
  },

  form: {
    gap: 16,
  },

  loginButton: {
    marginTop: 24,
  },

  registerPrompt: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  successModal: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 28,
  },

  successIcon: {
    fontSize: 36,
    marginBottom: 14,
  },

  successTitle: {
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 8,
  },

  successMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
});