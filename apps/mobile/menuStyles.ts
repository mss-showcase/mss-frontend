import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
    zIndex: 10,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.padding / 2,
  },
  hamburger: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    width: 28,
    height: 4,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 2,
  },
  barOpen1: {
    transform: [{ translateY: 8 }, { rotate: '45deg' }],
  },
  barOpen2: {
    opacity: 0,
  },
  barOpen3: {
    transform: [{ translateY: -8 }, { rotate: '-45deg' }],
  },
  menuList: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: theme.spacing.borderRadius,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: theme.spacing.padding / 2,
    minWidth: 140,
  },
  menuItem: {
    padding: theme.spacing.padding / 2,
    color: theme.colors.primary,
    fontSize: theme.font.size,
    borderRadius: 6,
  },
});