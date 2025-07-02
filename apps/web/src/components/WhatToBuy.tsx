import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../packages/store';
import { fetchStockNames } from '../../../../packages/store/stockNamesSlice';
import { getGatewayUrl, loadConfig } from '../../../../packages/store/apiConfig';
import { AnalysisData } from '../../../../packages/store/analysisSlice';

interface StockAnalysis {
  ticker: string;
  finalSuggestion: 'buy' | 'sell' | 'hold';
  totalScore: number;
  breakdown: {
    ta: {
      score: number;
      marker: string;
      value: number;
      explanation: string;
    };
    sentiment: {
      score: number;
      explanation: string;
    };
    fundamentals: {
      score: number;
      explanation: string;
    };
  };
  weights: {
    ta: number;
    sentiment: number;
    fundamentals: number;
  };
}

const WhatToBuy = () => {
  const dispatch = useDispatch();
  const { items: stockNames, loading: stockLoading } = useSelector((state: RootState) => state.stockNames);
  
  const [analysisData, setAnalysisData] = useState<StockAnalysis[]>(() => {
    // Try to restore cached data on component mount
    try {
      const cached = localStorage.getItem('whatToBuy_analysisData');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'tiles' | 'table'>('tiles');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof StockAnalysis>('totalScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [fetchProgress, setFetchProgress] = useState({ completed: 0, total: 0 });
  const [cacheMinutes, setCacheMinutes] = useState(3); // Default 3 minutes
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(() => {
    // Persist cache time across navigation
    const saved = localStorage.getItem('whatToBuy_lastFetchTime');
    return saved ? parseInt(saved) : null;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Persist cache time to localStorage
  useEffect(() => {
    if (lastFetchTime) {
      localStorage.setItem('whatToBuy_lastFetchTime', lastFetchTime.toString());
    }
  }, [lastFetchTime]);

  // Persist analysis data to localStorage
  useEffect(() => {
    if (analysisData.length > 0) {
      localStorage.setItem('whatToBuy_analysisData', JSON.stringify(analysisData));
    }
  }, [analysisData]);

  useEffect(() => {
    dispatch(fetchStockNames() as any);
  }, [dispatch]);

  // Check if data is cached and still valid
  const isCacheValid = () => {
    if (!lastFetchTime || analysisData.length === 0) return false;
    const cacheExpiryTime = lastFetchTime + (cacheMinutes * 60 * 1000);
    return Date.now() < cacheExpiryTime;
  };

  const fetchAnalysisData = async (forceRefresh = false) => {
    if (!stockNames.length) return;
    
    // Don't fetch if cache is valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      return;
    }
    
    setLoading(true);
    setIsRefreshing(forceRefresh);
    
    // Only clear data if we don't have any or if forcing refresh
    if (analysisData.length === 0 || forceRefresh) {
      setAnalysisData([]);
    }
    
    setFetchProgress({ completed: 0, total: stockNames.length });
    
    try {
      await loadConfig(); // Ensure config is loaded
      const gatewayUrl = getGatewayUrl();
      
      let completedCount = 0;
      const successfulResults: StockAnalysis[] = [];
      
      // Process stocks sequentially to update progress
      for (const ticker of stockNames) {
        try {
          const response = await fetch(`${gatewayUrl}/analysis/${ticker}/explanation`);
          if (response.ok) {
            const data: AnalysisData = await response.json();
            // Transform the data to our interface
            const transformedData: StockAnalysis = {
              ticker: data.ticker,
              finalSuggestion: data.finalSuggestion,
              totalScore: data.totalScore,
              breakdown: data.breakdown,
              weights: data.weights
            };
            successfulResults.push(transformedData);
            
            // Update results immediately for progressive display
            setAnalysisData([...successfulResults]);
          }
        } catch (error) {
          console.error(`Error fetching analysis for ${ticker}:`, error);
        }
        
        completedCount++;
        setFetchProgress({ completed: completedCount, total: stockNames.length });
      }
      
      // Update last fetch time on successful completion
      setLastFetchTime(Date.now());
      
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, [stockNames]);

  const handleManualRefresh = () => {
    fetchAnalysisData(true);
  };

  const getTimeUntilRefresh = () => {
    if (!lastFetchTime) return 0;
    const cacheExpiryTime = lastFetchTime + (cacheMinutes * 60 * 1000);
    const remainingTime = Math.max(0, cacheExpiryTime - Date.now());
    return Math.ceil(remainingTime / 1000); // Return seconds
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Ready to refresh';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s until auto-refresh`;
    }
    return `${remainingSeconds}s until auto-refresh`;
  };

  const getSuggestionColor = (suggestion: string) => {
    switch (suggestion.toLowerCase()) {
      case 'buy': return '#4CAF50';
      case 'sell': return '#f44336';
      case 'hold': return '#ff9800';
      default: return '#757575';
    }
  };

  const toggleRowExpansion = (ticker: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(ticker)) {
      newExpanded.delete(ticker);
    } else {
      newExpanded.add(ticker);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field: keyof StockAnalysis) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...analysisData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return sortDirection === 'asc' 
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  // Auto-refresh timer and countdown update
  useEffect(() => {
    const interval = setInterval(() => {
      // Force a re-render to update the countdown display
      if (lastFetchTime && analysisData.length > 0) {
        const timeLeft = getTimeUntilRefresh();
        if (timeLeft <= 0) {
          // Auto-refresh when cache expires
          fetchAnalysisData();
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [lastFetchTime, cacheMinutes, analysisData.length]);

  if (stockLoading || loading) {
    const progressPercentage = fetchProgress.total > 0 
      ? Math.round((fetchProgress.completed / fetchProgress.total) * 100) 
      : 0;

    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
        minHeight: '100vh',
        color: '#333'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '2rem',
          color: '#333',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          margin: '0 auto',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            margin: '0 0 1.5rem 0',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {stockLoading ? 'Loading stock list...' : isRefreshing ? 'Refreshing analysis...' : 'Analyzing stocks...'}
          </h2>
          
          {fetchProgress.total > 0 && (
            <>
              <div style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#e0e0e0',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #2196f3, #1976d2)',
                  borderRadius: '6px',
                  transition: 'width 0.3s ease-in-out'
                }} />
              </div>
              
              <div style={{
                fontSize: '1rem',
                color: '#666',
                marginBottom: '1rem'
              }}>
                Analyzing {fetchProgress.completed} of {fetchProgress.total} stocks ({progressPercentage}%)
              </div>
            </>
          )}
          
          {analysisData.length > 0 && (
            <div style={{
              fontSize: '0.9rem',
              color: '#888',
              fontStyle: 'italic'
            }}>
              {analysisData.length} results loaded so far...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
      minHeight: '100vh',
      color: '#333'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#333',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: 0,
            background: 'linear-gradient(135deg, #2196f3, #1976d2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            What to Buy?
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Cache Duration Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              <span>Cache:</span>
              <select
                value={cacheMinutes}
                onChange={(e) => setCacheMinutes(parseInt(e.target.value))}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '0.85rem',
                  background: 'white'
                }}
              >
                <option value={1}>1 min</option>
                <option value={2}>2 min</option>
                <option value={3}>3 min</option>
                <option value={4}>4 min</option>
                <option value={5}>5 min</option>
              </select>
            </div>

            {/* Cache Status and Refresh Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {lastFetchTime && (
                <div style={{
                  fontSize: '0.8rem',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  {formatTimeRemaining(getTimeUntilRefresh())}
                </div>
              )}
              
              <button
                onClick={handleManualRefresh}
                disabled={loading}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: loading ? '#ccc' : '#28a745',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#218838';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#28a745';
                  }
                }}
              >
                {loading ? '⟳ Refreshing...' : '↻ Refresh'}
              </button>
            </div>

            {/* View Mode Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>View:</span>
              <button
                onClick={() => setViewMode('tiles')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: viewMode === 'tiles' ? '#2196f3' : '#e0e0e0',
                  color: viewMode === 'tiles' ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Tiles
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: viewMode === 'table' ? '#2196f3' : '#e0e0e0',
                  color: viewMode === 'table' ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'tiles' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {sortedData.map((stock) => (
              <div
                key={stock.ticker}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: `3px solid ${getSuggestionColor(stock.finalSuggestion)}`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#333'
                  }}>
                    {stock.ticker}
                  </h3>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: 'white',
                    background: getSuggestionColor(stock.finalSuggestion),
                    textTransform: 'uppercase'
                  }}>
                    {stock.finalSuggestion}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Total Score:</span>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: getSuggestionColor(stock.finalSuggestion)
                  }}>
                    {stock.totalScore.toFixed(1)}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Technical Analysis:</span>
                    <span>{stock.breakdown.ta.score.toFixed(1)} ({stock.breakdown.ta.marker})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Fundamentals:</span>
                    <span>{stock.breakdown.fundamentals.score.toFixed(1)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Sentiment:</span>
                    <span>{stock.breakdown.sentiment.score.toFixed(1)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
                    <span>Weights:</span>
                    <span>TA: {stock.weights.ta}, Fund: {stock.weights.fundamentals}, Sent: {stock.weights.sentiment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer' }}
                      onClick={() => handleSort('ticker')}>
                    Ticker {sortField === 'ticker' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer' }}
                      onClick={() => handleSort('totalScore')}>
                    Score {sortField === 'totalScore' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((stock) => (
                  <>
                    <tr key={stock.ticker} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {stock.ticker}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: getSuggestionColor(stock.finalSuggestion)
                          }}>
                            {stock.totalScore.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          color: 'white',
                          background: getSuggestionColor(stock.finalSuggestion),
                          textTransform: 'uppercase'
                        }}>
                          {stock.finalSuggestion}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => toggleRowExpansion(stock.ticker)}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: '2px solid #2196f3',
                            background: expandedRows.has(stock.ticker) ? '#2196f3' : 'white',
                            color: expandedRows.has(stock.ticker) ? 'white' : '#2196f3',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          ?
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(stock.ticker) && (
                      <tr>
                        <td colSpan={4} style={{
                          padding: '1.5rem',
                          background: '#f9f9f9',
                          borderBottom: '1px solid #e0e0e0'
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '1rem'
                          }}>
                            <div>
                              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Technical Analysis</h4>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                                <strong>Score:</strong> {stock.breakdown.ta.score.toFixed(2)}
                              </p>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                                <strong>Signal:</strong> {stock.breakdown.ta.marker}
                              </p>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                                <strong>Value:</strong> {stock.breakdown.ta.value.toFixed(2)}
                              </p>
                              <p style={{ margin: '0', fontSize: '0.85rem' }}>
                                <strong>Explanation:</strong> {stock.breakdown.ta.explanation}
                              </p>
                            </div>
                            
                            <div>
                              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Fundamentals</h4>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                                <strong>Score:</strong> {stock.breakdown.fundamentals.score.toFixed(2)}
                              </p>
                              <p style={{ margin: '0', fontSize: '0.85rem' }}>
                                <strong>Explanation:</strong> {stock.breakdown.fundamentals.explanation}
                              </p>
                            </div>
                            
                            <div>
                              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Sentiment Analysis</h4>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                                <strong>Score:</strong> {stock.breakdown.sentiment.score.toFixed(2)}
                              </p>
                              <p style={{ margin: '0', fontSize: '0.85rem' }}>
                                <strong>Explanation:</strong> {stock.breakdown.sentiment.explanation}
                              </p>
                            </div>
                            
                            <div>
                              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Weighting</h4>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                                <strong>Technical Analysis:</strong> {stock.weights.ta}
                              </p>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
                                <strong>Fundamentals:</strong> {stock.weights.fundamentals}
                              </p>
                              <p style={{ margin: '0', fontSize: '0.85rem' }}>
                                <strong>Sentiment:</strong> {stock.weights.sentiment}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {analysisData.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#666'
          }}>
            <h3>No analysis data available</h3>
            <p>Please check that the analysis endpoints are working correctly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatToBuy;
