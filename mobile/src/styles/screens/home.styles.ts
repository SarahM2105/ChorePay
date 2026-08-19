import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const homeStyles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: 480,
  },

  pageDesktop: {
    maxWidth: 1100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 80,
  },

  content: {
    width: '100%',
  },

  contentDesktop: {
    flex: 1,
    maxWidth: 480,
  },

  logo: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 32,
  },

  bigLogo: {
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 20,
  },

  title: {
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 16,
  },

  titleDesktop: {
    fontSize: 52,
    lineHeight: 58,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 40,
  },

  buttons: {
    gap: 12,
  },

  desktopBrandPanel: {
    flex: 1,
    minHeight: 430,
    backgroundColor: colors.primaryLight,
    borderRadius: 32,
    padding: 48,
    justifyContent: 'center',
  },

  desktopMessage: {
    fontSize: 20,
    lineHeight: 30,
    maxWidth: 430,
    marginBottom: 38,
  },

  featureCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 26,
    gap: 24,
    maxWidth: 390,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  featureIcon: {
    fontSize: 24,
    width: 36,
    textAlign: 'center',
    color: colors.primary,
  },

  featureTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 3,
  },

  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});