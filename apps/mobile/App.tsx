import { Provider } from 'react-redux';
import { store } from '@mss-frontend/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, SafeAreaView } from 'react-native';
import AppMenu from './AppMenu';
import { theme } from './theme';
import HomeScreen from './HomeScreen';
import NewsScreen from './NewsScreen';
import AboutScreen from './AboutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <AppMenu />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.colors.background },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="News" component={NewsScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}