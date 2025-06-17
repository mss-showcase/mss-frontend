import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGatewayUrl, loadConfig } from './apiConfig';

export interface FundamentalsState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: FundamentalsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchFundamentals = createAsyncThunk<any, string>(
  'fundamentals/fetchFundamentals',
  async (ticker: string) => {
    await loadConfig();
    const baseUrl = getGatewayUrl();
    const url = `${baseUrl}/fundamentals/${encodeURIComponent(ticker)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch fundamentals');
    return await response.json();
  }
);

const fundamentalsSlice = createSlice({
  name: 'fundamentals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundamentals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFundamentals.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.fundamentals;
      })
      .addCase(fetchFundamentals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch fundamentals';
      });
  },
});

export default fundamentalsSlice.reducer;