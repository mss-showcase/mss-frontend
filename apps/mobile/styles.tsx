import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const sharedStyles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.padding,
  },
  header: {
    fontSize: theme.font.headerSize,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: theme.font.family,
  },
  text: {
    fontSize: theme.font.size,
    color: theme.colors.text,
    fontFamily: theme.font.family,
  },
});