import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

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
    backgroundColor: '#E9E4FF',
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
    color: '#6C5CE7',
    fontSize: 16,
    fontWeight: '700',
  },

  logo: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 26,
  },

  roleLabel: {
    color: '#6C5CE7',
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

  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7,
  },

  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1DDF2',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
  },

  error: {
    color: '#C0392B',
    fontSize: 14,
    marginTop: 16,
  },

  registerButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 24,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  loginPrompt: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 15,
  },

  loginLink: {
    color: '#6C5CE7',
    fontWeight: '800',
  },
});