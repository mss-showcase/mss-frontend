import { Button } from '@mss-frontend/ui';
import { Provider } from 'react-redux';
import { store } from '@mss-frontend/store';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello from Expo App</Text>
        <Button title="Click me" onPress={() => alert('Pressed!')} />
      </View>
    </Provider>
  );
}
