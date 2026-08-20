import { StyleSheet } from 'react-native';

import { colors } from '../colors';

export const dashboardStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  page: {
    width: '100%',
    maxWidth: 1100,
  },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 52,
  },

  logo: {
    fontSize: 26,
    fontWeight: '900',
  },

  logoutButton: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },

  logoutText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  header: {
    marginBottom: 36,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 18,
  },

  roleBadgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  welcome: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 26,
  },

  familyCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 28,
    gap: 28,
  },

  familyCardDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 34,
  },

  familyInfo: {
    flex: 1,
    maxWidth: 560,
  },

  sectionLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  familyName: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 23,
  },

  joinCodeSection: {
    minWidth: 230,
  },

  joinCodeLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 9,
  },

  joinCodeBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 16,
    alignItems: 'center',
  },

  joinCode: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
  },

  createFamilyButton: {
    minWidth: 190,
  },

  loadingText: {
    fontSize: 15,
    lineHeight: 23,
  },

  requestsSection: {
  marginTop: 28,
},

sectionTitle: {
  fontSize: 22,
  fontWeight: '800',
  marginBottom: 14,
},

emptyText: {
  fontSize: 15,
  lineHeight: 22,
},

requestCard: {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 18,
  padding: 20,
  marginBottom: 12,
},

requestTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  marginBottom: 8,
},

requestName: {
  fontSize: 18,
  fontWeight: '800',
},

requestRole: {
  color: colors.primary,
  fontSize: 13,
  fontWeight: '800',
},

requestDate: {
  fontSize: 13,
  marginBottom: 16,
},

requestActions: {
  flexDirection: 'row',
  gap: 10,
},

requestButton: {
  flex: 1,
},

rejectButton: {
  flex: 1,
  borderWidth: 2,
  borderColor: colors.border,
  borderRadius: 14,
  paddingVertical: 14,
  alignItems: 'center',
},

rejectButtonText: {
  fontSize: 15,
  fontWeight: '700',
},

requestError: {
  marginBottom: 12,
},


membersSection: {
  marginTop: 28,
},

membersGrid: {
  gap: 12,
},

memberCard: {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 16,
  padding: 18,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
},

memberInfo: {
  flex: 1,
},

memberName: {
  fontSize: 17,
  fontWeight: '800',
  marginBottom: 4,
},

memberJoined: {
  fontSize: 13,
},

memberRoleBadge: {
  backgroundColor: colors.primaryLight,
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 7,
},

memberRoleText: {
  color: colors.primary,
  fontSize: 12,
  fontWeight: '800',
},

statusBox: {
  backgroundColor: colors.primaryLight,
  borderRadius: 16,
  padding: 18,
  minWidth: 220,
},

statusLabel: {
  color: colors.primary,
  fontSize: 12,
  fontWeight: '800',
  letterSpacing: 1,
  marginBottom: 6,
},

statusTitle: {
  fontSize: 17,
  fontWeight: '800',
  marginBottom: 5,
},

statusText: {
  fontSize: 14,
  lineHeight: 21,
},

declinedBox: {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 16,
  padding: 18,
  minWidth: 220,
},

declinedTitle: {
  fontSize: 17,
  fontWeight: '800',
  marginBottom: 5,
},

cancelRequestButton: {
  marginTop: 16,
},

});