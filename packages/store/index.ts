import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import stockNamesReducer from './stockNamesSlice';
import TickReducer from './tickSlice';
import FundamentalsReducer from './fundamentalsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    stockNames: stockNamesReducer,
    ticks: TickReducer,
    fundamentals: FundamentalsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

