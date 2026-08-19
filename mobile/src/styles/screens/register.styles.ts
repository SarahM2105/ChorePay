import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const registerStyles = StyleSheet.create({
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
    lineHeight: 43,
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

  backText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  logo: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 30,
  },

  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 28,
  },

  roles: {
    gap: 14,
    marginBottom: 24,
  },

  roleCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 20,
  },

  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.selectedBackground,
  },

  roleHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },

  roleIcon: {
    fontSize: 22,
  },

  roleTitle: {
    fontSize: 19,
    fontWeight: '800',
  },

  roleDescription: {
    fontSize: 15,
    lineHeight: 22,
  },

  selectedText: {
    marginTop: 12,
    color: colors.primary,
    fontWeight: '800',
  },

  loginPrompt: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 15,
  },
});