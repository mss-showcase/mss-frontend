import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@mss-frontend/store';
import { fetchTicks, TickWindow } from '@mss-frontend/store/tickSlice';
import { fetchStockNames } from '@mss-frontend/store/stockNamesSlice';
import { fetchFundamentals } from '@mss-frontend/store/fundamentalsSlice';
import { fetchAnalysis } from '@mss-frontend/store/analysisSlice';
import { getGatewayUrl, loadConfig } from '@mss-frontend/store/apiConfig';
import { WindowSelector, ChartSection } from '@mss-frontend/ui';
import FundamentalsDetails from './FundamentalsDetails';
import AnalysisDetails from './AnalysisDetails';

// Marker interfaces
interface TechnicalMarker {
  id: string;
  name: string;
}

interface MarkerDataPoint {
  time: string;
  value: number;
}

interface MarkerData {
  symbol: string;
  marker: string;
  series: MarkerDataPoint[];
}

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

  markersSection: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  } as React.CSSProperties,

  markersTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,

  markersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.5rem',
  } as React.CSSProperties,

  markerButton: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left' as const,
    position: 'relative' as const,
  } as React.CSSProperties,

  markerButtonActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6',
  } as React.CSSProperties,

  markerButtonLoading: {
    opacity: 0.6,
    cursor: 'not-allowed',
  } as React.CSSProperties,

  markerButtonError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    color: '#dc2626',
  } as React.CSSProperties,

  markersInfo: {
    fontSize: '0.8rem',
    color: '#6b7280',
    marginTop: '0.5rem',
    fontStyle: 'italic',
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

  // Marker state
  const [availableMarkers, setAvailableMarkers] = useState<TechnicalMarker[]>([]);
  const [activeMarkers, setActiveMarkers] = useState<Set<string>>(new Set());
  const [markerData, setMarkerData] = useState<Map<string, MarkerData>>(new Map());
  const [markersLoading, setMarkersLoading] = useState(false);
  const [failedMarkers, setFailedMarkers] = useState<Set<string>>(new Set());

  // Fetch state
  const { data, loading, error } = useSelector((state: RootState) => state.ticks);
  const fundamentals = useSelector((state: RootState) => state.fundamentals);
  const analysis = useSelector((state: RootState) => state.analysis);

  // Fetch stock names on mount
  useEffect(() => {
    dispatch(fetchStockNames());
    fetchAvailableMarkers();
  }, [dispatch]);

  // Fetch available markers
  const fetchAvailableMarkers = async () => {
    try {
      await loadConfig();
      const gatewayUrl = getGatewayUrl();
      const response = await fetch(`${gatewayUrl}/analysis/ta/stockmarkers`);
      if (response.ok) {
        const data = await response.json();
        setAvailableMarkers(data.markers || []);
      }
    } catch (error) {
      console.error('Error fetching available markers:', error);
    }
  };

  // Fetch marker data for a specific marker
  const fetchMarkerData = async (ticker: string, markerId: string) => {
    try {
      setMarkersLoading(true);
      await loadConfig();
      const gatewayUrl = getGatewayUrl();
      const response = await fetch(`${gatewayUrl}/analysis/ta/stockmarker/${ticker}/${markerId}`);
      if (response.ok) {
        const data: MarkerData = await response.json();
        
        // Validate marker data before storing
        if (isValidMarkerData(data)) {
          setMarkerData(prev => new Map(prev).set(markerId, data));
          // Remove from failed markers if it was previously failed
          setFailedMarkers(prev => {
            const newSet = new Set(prev);
            newSet.delete(markerId);
            return newSet;
          });
        } else {
          console.warn(`Invalid marker data for ${markerId}:`, data);
          // Remove the marker from active set if data is invalid
          setActiveMarkers(prev => {
            const newSet = new Set(prev);
            newSet.delete(markerId);
            return newSet;
          });
          // Add to failed markers
          setFailedMarkers(prev => new Set(prev).add(markerId));
        }
      } else {
        console.error(`Failed to fetch marker data for ${markerId}: ${response.statusText}`);
        // Remove the marker from active set if fetch failed
        setActiveMarkers(prev => {
          const newSet = new Set(prev);
          newSet.delete(markerId);
          return newSet;
        });
        // Add to failed markers
        setFailedMarkers(prev => new Set(prev).add(markerId));
      }
    } catch (error) {
      console.error(`Error fetching marker data for ${markerId}:`, error);
      // Remove the marker from active set if there was an error
      setActiveMarkers(prev => {
        const newSet = new Set(prev);
        newSet.delete(markerId);
        return newSet;
      });
      // Add to failed markers
      setFailedMarkers(prev => new Set(prev).add(markerId));
    } finally {
      setMarkersLoading(false);
    }
  };

  // Validate marker data structure and content
  const isValidMarkerData = (data: any): data is MarkerData => {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check required fields exist
    if (!data.symbol || !data.marker || !Array.isArray(data.series)) {
      return false;
    }

    // Check if series has meaningful data
    if (data.series.length === 0) {
      return false;
    }

    // Validate each data point in the series
    const validPoints = data.series.filter((point: any) => {
      // Check if point has required fields
      if (!point || typeof point !== 'object') {
        return false;
      }

      // Check if time is valid
      if (!point.time || typeof point.time !== 'string') {
        return false;
      }

      // Check if value is a valid number
      if (typeof point.value !== 'number' || !isFinite(point.value)) {
        return false;
      }

      // Check if time can be parsed as a valid date
      const timestamp = new Date(point.time);
      if (isNaN(timestamp.getTime())) {
        return false;
      }

      return true;
    });

    // Require at least some valid data points (minimum 5 for meaningful chart)
    return validPoints.length >= 5;
  };

  // Get validated marker data for chart
  const getValidatedMarkerData = (): MarkerData[] => {
    const validMarkers: MarkerData[] = [];
    
    markerData.forEach((data, markerId) => {
      if (isValidMarkerData(data)) {
        // Additional filtering for chart-compatible data
        const filteredSeries = data.series
          .filter(point => {
            const timestamp = new Date(point.time);
            return !isNaN(timestamp.getTime()) && 
                   isFinite(point.value) && 
                   point.value > 0; // Ensure positive values for stock indicators
          })
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()); // Sort by time

        if (filteredSeries.length >= 5) {
          validMarkers.push({
            ...data,
            series: filteredSeries
          });
        } else {
          console.warn(`Marker ${markerId} has insufficient valid data points: ${filteredSeries.length}`);
        }
      }
    });

    return validMarkers;
  };

  // Toggle marker on/off
  const toggleMarker = async (markerId: string) => {
    const newActiveMarkers = new Set(activeMarkers);
    
    if (newActiveMarkers.has(markerId)) {
      // Remove marker
      newActiveMarkers.delete(markerId);
      setMarkerData(prev => {
        const newMap = new Map(prev);
        newMap.delete(markerId);
        return newMap;
      });
    } else {
      // Add marker
      newActiveMarkers.add(markerId);
      if (paramStockName) {
        await fetchMarkerData(paramStockName, markerId);
      }
    }
    
    setActiveMarkers(newActiveMarkers);
  };

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
    
    // Clear active markers when stock changes
    setActiveMarkers(new Set());
    setMarkerData(new Map());
    setFailedMarkers(new Set());
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
              <ChartSection 
                ticks={data.ticks} 
                markerData={getValidatedMarkerData()}
              />
              
              {/* Technical Analysis Markers */}
              <div style={styles.markersSection}>
                <div style={styles.markersTitle}>
                  📊 Technical Analysis Markers
                  {markersLoading && <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Loading...</span>}
                  {activeMarkers.size > 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#059669' }}>
                      ({activeMarkers.size} active)
                    </span>
                  )}
                </div>
                <div style={styles.markersGrid}>
                  {availableMarkers.map((marker) => {
                    const isActive = activeMarkers.has(marker.id);
                    const isFailed = failedMarkers.has(marker.id);
                    const hasValidData = markerData.has(marker.id);
                    
                    return (
                      <button
                        key={marker.id}
                        onClick={() => toggleMarker(marker.id)}
                        disabled={markersLoading}
                        title={isFailed ? `${marker.name} (Failed to load)` : marker.name}
                        style={{
                          ...styles.markerButton,
                          ...(isActive && hasValidData ? styles.markerButtonActive : {}),
                          ...(isFailed ? styles.markerButtonError : {}),
                          ...(markersLoading ? styles.markerButtonLoading : {}),
                        }}
                        onMouseEnter={(e) => {
                          if (!markersLoading && !isActive && !isFailed) {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#9ca3af';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!markersLoading && !isActive && !isFailed) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                      >
                        {marker.id}
                        {isFailed && <span style={{ marginLeft: '0.25rem' }}>⚠️</span>}
                        {isActive && hasValidData && <span style={{ marginLeft: '0.25rem' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
                {availableMarkers.length === 0 && (
                  <div style={{ fontSize: '0.9rem', color: '#6b7280', textAlign: 'center', padding: '1rem' }}>
                    No technical analysis markers available
                  </div>
                )}
                {failedMarkers.size > 0 && (
                  <div style={styles.markersInfo}>
                    ⚠️ Some markers failed to load or contain invalid data. Try again or check console for details.
                  </div>
                )}
                {activeMarkers.size > 0 && (
                  <div style={styles.markersInfo}>
                    💡 Tip: Click active markers again to remove them from the chart.
                  </div>
                )}
              </div>
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