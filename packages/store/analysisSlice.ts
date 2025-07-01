import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadConfig, getGatewayUrl } from './apiConfig';

export interface Article {
  title: string;
  url: string;
  pubdate: string;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  sentiment_score: number;
}

export interface TechnicalAnalysis {
  score: number;
  marker: string;
  value: number;
  explanation: string;
}

export interface Sentiment {
  score: number;
  explanation: string;
  articles: Article[];
}

export interface Fundamentals {
  score: number;
  explanation: string;
}

export interface Breakdown {
  ta: TechnicalAnalysis;
  sentiment: Sentiment;
  fundamentals: Fundamentals;
}

export interface Weights {
  ta: number;
  sentiment: number;
  fundamentals: number;
}

export interface AnalysisData {
  ticker: string;
  finalSuggestion: 'buy' | 'sell' | 'hold';
  breakdown: Breakdown;
  weights: Weights;
  totalScore: number;
}

interface AnalysisState {
  data: AnalysisData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAnalysis = createAsyncThunk(
  'analysis/fetchAnalysis',
  async (stockName: string) => {
    await loadConfig();
    const baseUrl = getGatewayUrl();
    const response = await fetch(`${baseUrl}/analysis/${stockName}/explanation`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch analysis: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as AnalysisData;
  }
);

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearAnalysis: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analysis';
      });
  },
});

export const { clearAnalysis } = analysisSlice.actions;
export default analysisSlice.reducer;
