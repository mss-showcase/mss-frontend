import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@mss-frontend/store';
import { fetchTicks } from '@mss-frontend/store/tickSlice';
import { TickWindow } from '@mss-frontend/store/tickSlice';
import CandlestickChart from '@mss-frontend/ui/CandlestickChart';
import type { CandlestickData } from 'lightweight-charts';

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

  const handleWindowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWindow(e.target.value as TickWindow);
  };

  return (
    <div className="welcome-container">
      <h2>Stock Details</h2>
      <p>Selected stock: <strong>{stockName}</strong></p>
      <label>
        Select window:&nbsp;
        <select value={window} onChange={handleWindowChange}>
          {Object.values(TickWindow).map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </label>
      {loading && <div>Loading chart data...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && data.ticks && data.ticks.length > 0 && (
        <div>
          {/* Replace this with your chart component */}
          <pre style={{ background: '#f4f4f4', padding: 12, borderRadius: 6, overflowX: 'auto' }}>
          <CandlestickChart
            data={data.ticks.map(tick => ({
              time: Math.floor(new Date(tick.timestamp).getTime() / 1000),
              open: tick.open,
              high: tick.high,
              low: tick.low,
              close: tick.close,
            })) as CandlestickData[]}/>
          </pre>
        </div>
      )}
      {data && data.ticks && data.ticks.length === 0 && (
        <div>No tick data available for this stock and window.</div>
      )}
    </div>
  );
};

export default StockDetails;