import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGatewayUrl, loadConfig } from './apiConfig';

export enum TickWindow {
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export interface Tick {
  low: number;
  interval: number;
  symbol: string;
  timestamp: string;
  ttl: number;
  open: number;
  volume: number;
  file_name: string;
  high: number;
  close: number;
}

export interface TickResponse {
  symbol: string;
  ticks: Tick[];
}

export interface TickState {
  data: TickResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: TickState = {
  data: null,
  loading: false,
  error: null,
};

interface FetchTicksParams {
  stockName: string;
  window?: TickWindow;
}

export const fetchTicks = createAsyncThunk<TickResponse, FetchTicksParams>(
  'ticks/fetchTicks',
  async ({ stockName, window }) => {
    await loadConfig();
    const baseUrl = getGatewayUrl();
    let url = `${baseUrl}/ticks/${encodeURIComponent(stockName)}`;
    if (window) {
      url += `?window=${window}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch ticks');
    return await response.json();
  }
);

const tickSlice = createSlice({
  name: 'ticks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTicks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

export default tickSlice.reducer;