import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGatewayUrl, loadConfig } from './apiConfig';

export const fetchStockNames = createAsyncThunk(
  'stockNames/fetchStockNames',
  async () => {
    await loadConfig(); // Ensure config is loaded
    const LOCAL_GATEWAY_URL = getGatewayUrl();
    const response = await fetch(LOCAL_GATEWAY_URL + "/stocks");
    if (!response.ok) throw new Error('Failed to fetch stock names');
    const data = await response.json();
    // Extract the stocks array from the response object
    return data.stocks as string[];
  }
);

interface StockNamesState {
  items: string[];
  loading: boolean;
  error: string | null;
}

const initialState: StockNamesState = {
  items: [],
  loading: false,
  error: null,
};

const stockNamesSlice = createSlice({
  name: 'stockNames',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockNames.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStockNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

export default stockNamesSlice.reducer;