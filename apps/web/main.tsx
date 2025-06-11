import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@mss-frontend/store';
import { Button } from '@mss-frontend/ui';

const App = () => (
  <Provider store={store}>
    <div style={{ padding: 20 }}>
      <h1>Web App</h1>
      <Button label="Click me" onPress={() => alert('Clicked!')} />
    </div>
  </Provider>
);
