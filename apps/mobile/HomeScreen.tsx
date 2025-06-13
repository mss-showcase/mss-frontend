import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@mss-frontend/store'; // <-- import your AppDispatch type
import { fetchStockNames } from '@mss-frontend/store/stockNamesSlice';
import { fetchTicks, TickWindow } from '@mss-frontend/store/tickSlice';
import { WindowSelector, ChartSection } from '@mss-frontend/ui';
import { Picker } from '@react-native-picker/picker';
import { theme } from './theme';
const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: any) => state.stockNames);
  const { data, loading: chartLoading, error: chartError } = useSelector((state: any) => state.ticks);
  const [selectedStock, setSelectedStock] = useState<string | undefined>();
  const [window, setWindow] = useState<TickWindow>(TickWindow.Month);

  useEffect(() => {
    dispatch(fetchStockNames());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStock) {
      dispatch(fetchTicks({ stockName: selectedStock, window }));
    }
  }, [dispatch, selectedStock, window]);

  return (
    <View style={styles.content}>
      <Text style={styles.header}>MSS Showcase App</Text>
      <Text style={styles.text}>Welcome to the mobile app!</Text>
      <StockPicker
        items={items}
        loading={loading}
        error={error}
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
      />
      {selectedStock && (
        <StockChartSection
          window={window}
          setWindow={setWindow}
          chartLoading={chartLoading}
          chartError={chartError}
          data={data}
        />
      )}
    </View>
  );
};

const StockPicker = ({
  items,
  loading,
  error,
  selectedStock,
  setSelectedStock,
}: {
  items: string[];
  loading: boolean;
  error: string | null;
  selectedStock: string | undefined;
  setSelectedStock: (v: string | undefined) => void;
}) => (
  <>
    <Text style={[styles.text, { marginTop: 16 }]}>Please select a stock:</Text>
    {loading && <ActivityIndicator color={theme.colors.primary} />}
    {error && <Text style={{ color: 'red' }}>{error}</Text>}
    {!loading && !error && (
      <Picker
        selectedValue={selectedStock}
        onValueChange={value => setSelectedStock(value)}
        style={{ width: 220, marginVertical: 12, backgroundColor: '#fff', borderRadius: 8 }}
      >
        <Picker.Item label="Select a stock" value={undefined} />
        {items.map((item: string) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
    )}
  </>
);

const StockChartSection = ({
  window,
  setWindow,
  chartLoading,
  chartError,
  data,
}: {
  window: TickWindow;
  setWindow: (w: TickWindow) => void;
  chartLoading: boolean;
  chartError: string | null;
  data: any;
}) => (
  <>
    <WindowSelector value={window} onChange={setWindow} />
    {chartLoading && <ActivityIndicator color={theme.colors.primary} />}
    {chartError && <Text style={{ color: 'red' }}>{chartError}</Text>}
    {data && data.ticks && data.ticks.length > 0 ? (
      <ChartSection ticks={data.ticks} />
    ) : (
      !chartLoading && <Text style={styles.text}>No tick data available for this stock and window.</Text>
    )}
  </>
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.padding,
  },
  header: {
    fontSize: theme.font.headerSize,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: theme.font.family,
  },
  text: {
    fontSize: theme.font.size,
    color: theme.colors.text,
    fontFamily: theme.font.family,
  },
});

export default HomeScreen;