import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from './theme';
import { styles } from './menuStyles';

const MENU_ITEMS = [
  { label: 'Home', route: 'Home' },
  { label: 'News', route: 'News' },
  { label: 'About', route: 'About' },
];

function MenuList({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <View style={styles.menuList}>
      {MENU_ITEMS.map(item => (
        <TouchableOpacity key={item.route} onPress={() => onNavigate(item.route)}>
          <Text style={styles.menuItem}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function AppMenu() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  const handleNavigate = useCallback((route: string) => {
    setOpen(false);
    // @ts-ignore
    navigation.navigate(route);
  }, [navigation]);

  const toggleMenu = useCallback(() => setOpen(v => !v), []);

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        style={styles.hamburger}
        onPress={toggleMenu}
        accessibilityLabel="Toggle menu"
        accessibilityRole="button"
      >
        <View style={[styles.bar, open && styles.barOpen1]} />
        <View style={[styles.bar, open && styles.barOpen2]} />
        <View style={[styles.bar, open && styles.barOpen3]} />
      </TouchableOpacity>
      {open && <MenuList onNavigate={handleNavigate} />}
    </View>
  );
}