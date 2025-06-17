import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@mss-frontend/store';
import { fetchTicks, TickWindow } from '@mss-frontend/store/tickSlice';
import { fetchStockNames } from '@mss-frontend/store/stockNamesSlice';
import { fetchFundamentals } from '@mss-frontend/store/fundamentalsSlice';
import { WindowSelector, ChartSection } from '@mss-frontend/ui';
import FundamentalsDetails from './FundamentalsDetails';

// Helper to get today's date in YYYY-MM-DD format
const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '100%',
  maxWidth: '300px',
  boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  width: '100%',
  maxWidth: '150px',
};

const StockDetails = () => {
  const { stockName: paramStockName, date } = useParams<{ stockName: string, date?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: stockNames, loading: stocksLoading, error: stocksError } = useSelector((state: RootState) => state.stockNames);
  const [window, setWindow] = useState<TickWindow>(TickWindow.Month);

  // Form state
  const [selectedStock, setSelectedStock] = useState(paramStockName || '');
  const [inputDate, setInputDate] = useState(date || getToday());

  // Fetch state
  const { data, loading, error } = useSelector((state: RootState) => state.ticks);
  const fundamentals = useSelector((state: RootState) => state.fundamentals);

  // Fetch stock names on mount
  useEffect(() => {
    dispatch(fetchStockNames());
  }, [dispatch]);

  // Keep form state in sync with URL params (when navigating)
  useEffect(() => {
    setSelectedStock(paramStockName || '');
    setInputDate(date || getToday());
  }, [paramStockName, date]);

  // Only fetch when the URL params change (i.e., after navigation)
  useEffect(() => {
    if (paramStockName && date) {
      dispatch(fetchTicks({ stockName: paramStockName, window, date }));
      dispatch(fetchFundamentals(paramStockName));
    } else if (paramStockName && !date) {
      dispatch(fetchTicks({ stockName: paramStockName, window }));
      dispatch(fetchFundamentals(paramStockName));
    }
  }, [dispatch, paramStockName, window, date]);

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
    if (selectedStock) {
      if (inputDate) {
        navigate(`/stock/${selectedStock}/date/${inputDate}`);
      } else {
        navigate(`/stock/${selectedStock}`);
      }
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
            <td rowSpan={4} style={{ verticalAlign: 'top', paddingLeft: '2rem', fontSize: '0.95rem', color: '#444', minWidth: 320 }}>
              <strong>Date &amp; Time Window Rules:</strong>
              <ul style={{ margin: '0.5em 0 0 1.2em', padding: 0 }}>
                <li><u>If you do not select a date:</u>
                  <ul>
                    <li><b>Day:</b> Shows data from today.</li>
                    <li><b>Week:</b> Shows data from the last 7 days (including today).</li>
                    <li><b>Month:</b> Shows data from the last 30 days (including today).</li>
                  </ul>
                </li>
                <li style={{ marginTop: '0.5em' }}><u>If you select a date:</u>
                  <ul>
                    <li><b>Day:</b> Shows data only for the selected day.</li>
                    <li><b>Week:</b> Shows data for the selected day and the next 6 days.</li>
                    <li><b>Month:</b> Shows data for the selected day and the next 29 days.</li>
                  </ul>
                </li>
              </ul>
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
                style={inputStyle}
                title={`Date & Time Window Rules:\n\nIf you do not select a date:\n• Day: Shows data from today.\n• Week: Shows data from the last 7 days (including today).\n• Month: Shows data from the last 30 days (including today).\n\nIf you select a date:\n• Day: Shows data only for the selected day.\n• Week: Shows data for the selected day and the next 6 days.\n• Month: Shows data for the selected day and the next 29 days.`}
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
                style={buttonStyle}
                onClick={handleGo}
                disabled={!selectedStock || !inputDate}
              >
                Go
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Chart */}
      {loading && <div>Loading chart data...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && data.ticks && data.ticks.length > 0 ? (
        <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>
            {selectedStock} Candlestick Chart
          </h3>
          <ChartSection ticks={data.ticks} />
        </div>
      ) : (
        !loading && <div>No tick data available for this stock and window.</div>
      )}

      {/* Fundamentals details */}
      <FundamentalsDetails fundamentals={fundamentals} />

      {/* Data source attribution */}
      <div style={{ margin: '2rem', textAlign: 'center', color: '#666', fontSize: '0.95rem' }}>
        Data provided by <a href="https://www.alphavantage.co/" target="_blank" rel="noopener noreferrer">Alpha Vantage</a>.
      </div>
    </div>
  );
};

export default StockDetails;