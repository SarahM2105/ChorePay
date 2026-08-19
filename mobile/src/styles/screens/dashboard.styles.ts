import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const dashboardStyles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: 1100,
  },

  header: {
    marginBottom: 36,
  },

  logo: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 28,
  },

  welcome: {
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 26,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 18,
  },

  roleBadgeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 23,
  },

  logoutButton: {
    maxWidth: 200,
  },
});