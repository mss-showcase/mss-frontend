import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@mss-frontend/store';
import { fetchTicks, TickWindow } from '@mss-frontend/store/tickSlice';
import { WindowSelector, ChartSection } from '@mss-frontend/ui';

const StockDetails = () => {
  const { stockName } = useParams<{ stockName: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [window, setWindow] = useState<TickWindow>(TickWindow.Month);
  const { data, loading, error } = useSelector((state: RootState) => state.ticks);

  useEffect(() => {
    if (stockName) {
      dispatch(fetchTicks({ stockName, window }));
    }
  }, [dispatch, stockName, window]);

  if (loading) return <div>Loading chart data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!data || !data.ticks || data.ticks.length === 0)
    return (
      <div className="welcome-container">
        <h2>Stock Details</h2>
        <p>Selected stock: <strong>{stockName}</strong></p>
        <WindowSelector value={window} onChange={setWindow} />
        <div>No tick data available for this stock and window.</div>
      </div>
    );

  return (
    <div className="welcome-container">
      <h2>Stock Details</h2>
      <p>Selected stock: <strong>{stockName}</strong></p>
      <WindowSelector value={window} onChange={setWindow} />
      <ChartSection ticks={data.ticks} />
    </div>
  );
};

export default StockDetails;