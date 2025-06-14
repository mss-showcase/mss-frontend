import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@mss-frontend/store';
import { fetchTicks, TickWindow } from '@mss-frontend/store/tickSlice';
import { fetchStockNames } from '@mss-frontend/store/stockNamesSlice';
import { WindowSelector, ChartSection } from '@mss-frontend/ui';

// Helper to get today's date in YYYY-MM-DD format
const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};


const StockDetails = () => {
  const { stockName: paramStockName, date } = useParams<{ stockName: string, date?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: stockNames, loading: stocksLoading, error: stocksError } = useSelector((state: RootState) => state.stockNames);
  const [window, setWindow] = useState<TickWindow>(TickWindow.Month);
  const [selectedStock, setSelectedStock] = useState(paramStockName || '');
  const [inputDate, setInputDate] = useState(date || getToday());
  const [appliedDate, setAppliedDate] = useState(date || getToday());

  useEffect(() => {
    setAppliedDate(date || getToday());
  }, [date]);

  const { data, loading, error } = useSelector((state: RootState) => state.ticks);

  // Fetch stock names on mount
  useEffect(() => {
    dispatch(fetchStockNames());
  }, [dispatch]);

  // Keep selectedStock in sync with URL param
  useEffect(() => {
    if (paramStockName) setSelectedStock(paramStockName);
  }, [paramStockName]);

  // Only fetch when appliedDate or selectedStock changes
  useEffect(() => {
    if (selectedStock && appliedDate) {
      dispatch(fetchTicks({ stockName: selectedStock, window, date: appliedDate }));
    }
  }, [dispatch, selectedStock, window, appliedDate]);

  // Handle stock dropdown change
  const handleStockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStock(e.target.value);
  };

  // Handle date input change (does not trigger fetch)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(e.target.value);
  };

  // Go button: update URL and trigger chart update
  const handleGo = () => {
    if (selectedStock && inputDate) {
      navigate(`/stock/${selectedStock}/date/${inputDate}`);
    }
  };

  return (
    <div className="welcome-container">
      <h2>Stock Details</h2>
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="stock-select">Select stock:</label>
            </td>
            <td>
              {stocksLoading && <div>Loading stocks...</div>}
              {stocksError && <div style={{ color: 'red' }}>{stocksError}</div>}
              {!stocksLoading && !stocksError && (
                <select
                  id="stock-select"
                  onChange={handleStockChange}
                  value={selectedStock}
                >
                  <option value="" disabled>Select a stock</option>
                  {stockNames.map((item: string) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="date-input">Select date:</label>
            </td>
            <td>
              <input
                id="date-input"
                type="date"
                value={inputDate}
                onChange={handleDateChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="window-select">Select window:</label>
            </td>
            <td>
              <WindowSelector value={window} onChange={setWindow} />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button
                className="button"
                onClick={handleGo}
                disabled={!selectedStock || !inputDate}
              >
                Go
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {loading && <div>Loading chart data...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && data.ticks && data.ticks.length > 0 ? (
        <ChartSection ticks={data.ticks} />
      ) : (
        !loading && <div>No tick data available for this stock and window.</div>
      )}
    </div>
  );
};

export default StockDetails;