import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@mss-frontend/store';
import { fetchTicks, TickWindow } from '@mss-frontend/store/tickSlice';
import { fetchStockNames } from '@mss-frontend/store/stockNamesSlice';
import { fetchFundamentals } from '@mss-frontend/store/fundamentalsSlice';
import { fetchAnalysis } from '@mss-frontend/store/analysisSlice';
import { WindowSelector, ChartSection } from '@mss-frontend/ui';
import FundamentalsDetails from './FundamentalsDetails';
import AnalysisDetails from './AnalysisDetails';

// Helper to get today's date in YYYY-MM-DD format
const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,
  
  header: {
    marginBottom: '2rem',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '300',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    margin: 0,
  } as React.CSSProperties,
  
  controlsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e1e8ed',
  } as React.CSSProperties,
  
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    alignItems: 'end',
  } as React.CSSProperties,
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  } as React.CSSProperties,
  
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
  } as React.CSSProperties,
  
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    outline: 'none',
  } as React.CSSProperties,
  
  select: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    outline: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
  } as React.CSSProperties,
  
  infoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '1px solid #e2e8f0',
  } as React.CSSProperties,
  
  infoTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem',
  } as React.CSSProperties,
  
  infoList: {
    fontSize: '0.9rem',
    color: '#475569',
    lineHeight: '1.6',
    margin: 0,
    paddingLeft: '1.2rem',
  } as React.CSSProperties,
  
  contentSection: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e1e8ed',
  } as React.CSSProperties,
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.5rem',
  } as React.CSSProperties,
  
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#6b7280',
  } as React.CSSProperties,
  
  errorState: {
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
  
  attribution: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#6b7280',
    fontSize: '0.9rem',
    borderTop: '1px solid #e5e7eb',
    marginTop: '3rem',
  } as React.CSSProperties,

  helpIcon: {
    display: 'inline-block',
    marginLeft: '0.5rem',
    width: '20px',
    height: '20px',
    backgroundColor: '#6b7280',
    color: 'white',
    borderRadius: '50%',
    textAlign: 'center' as const,
    fontSize: '0.8rem',
    lineHeight: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  } as React.CSSProperties,

  helpSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '1rem',
    marginTop: '1rem',
    border: '1px solid #e2e8f0',
    fontSize: '0.85rem',
  } as React.CSSProperties,

  helpTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.75rem',
  } as React.CSSProperties,

  helpList: {
    fontSize: '0.8rem',
    color: '#475569',
    lineHeight: '1.5',
    margin: 0,
    paddingLeft: '1rem',
  } as React.CSSProperties,

  analysisContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  analysisContainerExpanded: {
    display: 'block',
    marginBottom: '2rem',
  } as React.CSSProperties,
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
  const [showTimeWindowHelp, setShowTimeWindowHelp] = useState(false);
  const [showAnalysisBreakdown, setShowAnalysisBreakdown] = useState(false);
  const [fundamentalsExpanded, setFundamentalsExpanded] = useState(false);

  // Fetch state
  const { data, loading, error } = useSelector((state: RootState) => state.ticks);
  const fundamentals = useSelector((state: RootState) => state.fundamentals);
  const analysis = useSelector((state: RootState) => state.analysis);

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
      dispatch(fetchAnalysis(paramStockName));
    } else if (paramStockName && !date) {
      dispatch(fetchTicks({ stockName: paramStockName, window }));
      dispatch(fetchFundamentals(paramStockName));
      dispatch(fetchAnalysis(paramStockName));
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

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    alert(`Analysis suggests: ${suggestion.toUpperCase()} for ${paramStockName}`);
    // You can implement more sophisticated logic here, such as:
    // - Opening a modal with more details
    // - Navigating to a trading page
    // - Showing additional analysis
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Stock Analysis Dashboard</h1>
        <p style={styles.subtitle}>Comprehensive stock data, charts, and sentiment analysis</p>
      </div>

      {/* Stock Selection Controls */}
      <div style={styles.controlsCard}>
        <div style={styles.controlsGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Stock Symbol</label>
            {stocksLoading && <div style={styles.loadingState}>Loading stocks...</div>}
            {stocksError && <div style={styles.errorState}>{stocksError}</div>}
            {!stocksLoading && !stocksError && (
              <select
                value={selectedStock}
                onChange={handleStockChange}
                style={{
                  ...styles.select,
                  borderColor: selectedStock ? '#3b82f6' : '#e5e7eb',
                }}
              >
                <option value="" disabled>Choose a stock symbol</option>
                {stockNames.map((item: string) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              value={inputDate}
              onChange={handleDateChange}
              style={{
                ...styles.input,
                borderColor: inputDate ? '#3b82f6' : '#e5e7eb',
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Time Window
              <span
                style={{
                  ...styles.helpIcon,
                  backgroundColor: showTimeWindowHelp ? '#3b82f6' : '#6b7280',
                }}
                onClick={() => setShowTimeWindowHelp(!showTimeWindowHelp)}
                onMouseEnter={(e) => {
                  if (!showTimeWindowHelp) {
                    e.currentTarget.style.backgroundColor = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showTimeWindowHelp) {
                    e.currentTarget.style.backgroundColor = '#6b7280';
                  }
                }}
              >
                ?
              </span>
            </label>
            <select
              value={window}
              onChange={(e) => setWindow(e.target.value as TickWindow)}
              style={styles.select}
            >
              <option value={TickWindow.Day}>Day</option>
              <option value={TickWindow.Week}>Week</option>
              <option value={TickWindow.Month}>Month</option>
            </select>
            {showTimeWindowHelp && (
              <div style={styles.helpSection}>
                <div style={styles.helpTitle}>📅 Time Window Rules</div>
                <ul style={styles.helpList}>
                  <li><strong>Without date selection:</strong>
                    <ul>
                      <li><strong>Day:</strong> Today's data</li>
                      <li><strong>Week:</strong> Last 7 days (including today)</li>
                      <li><strong>Month:</strong> Last 30 days (including today)</li>
                    </ul>
                  </li>
                  <li><strong>With date selection:</strong>
                    <ul>
                      <li><strong>Day:</strong> Selected day only</li>
                      <li><strong>Week:</strong> Selected day + next 6 days</li>
                      <li><strong>Month:</strong> Selected day + next 29 days</li>
                    </ul>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <button
              onClick={handleGo}
              disabled={!selectedStock || !inputDate}
              style={{
                ...styles.button,
                backgroundColor: (!selectedStock || !inputDate) ? '#9ca3af' : '#3b82f6',
                cursor: (!selectedStock || !inputDate) ? 'not-allowed' : 'pointer',
                transform: (!selectedStock || !inputDate) ? 'none' : 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                if (selectedStock && inputDate) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedStock && inputDate) {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              Analyze Stock
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {paramStockName && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>📈 {paramStockName} Price Chart</h2>
          {loading && (
            <div style={styles.loadingState}>
              <div>Loading chart data...</div>
            </div>
          )}
          {error && <div style={styles.errorState}>{error}</div>}
          {data && data.ticks && data.ticks.length > 0 ? (
            <div>
              <ChartSection ticks={data.ticks} />
            </div>
          ) : (
            !loading && paramStockName && (
              <div style={styles.loadingState}>
                No tick data available for this stock and time window.
              </div>
            )
          )}
        </div>
      )}

      {/* Fundamentals and Sentiment Analysis Sections */}
      {paramStockName && (
        <div style={fundamentalsExpanded || showAnalysisBreakdown ? styles.analysisContainerExpanded : styles.analysisContainer}>
          <div style={styles.contentSection}>
            <h2 style={styles.sectionTitle}>📊 Fundamentals Analysis</h2>
            <FundamentalsDetails 
              fundamentals={fundamentals} 
              onExpand={setFundamentalsExpanded}
            />
          </div>

          <div style={styles.contentSection}>
            <h2 style={styles.sectionTitle}>📈 Sentiment Analysis</h2>
            <AnalysisDetails 
              analysis={analysis} 
              onSuggestionClick={handleSuggestionClick}
              onExpand={(expanded) => setShowAnalysisBreakdown(expanded)}
            />
          </div>
        </div>
      )}

      {/* Attribution */}
      <div style={styles.attribution}>
        Data provided by{' '}
        <a 
          href="https://www.alphavantage.co/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#3b82f6', textDecoration: 'none' }}
        >
          Alpha Vantage
        </a>
      </div>
    </div>
  );
};

export default StockDetails;