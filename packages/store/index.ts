import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import stockNamesReducer from './stockNamesSlice';
import TickReducer from './tickSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    stockNames: stockNamesReducer,
    ticks: TickReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
