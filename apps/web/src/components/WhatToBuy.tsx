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
  
  const [analysisData, setAnalysisData] = useState<StockAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'tiles' | 'table'>('tiles');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof StockAnalysis>('totalScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    dispatch(fetchStockNames() as any);
  }, [dispatch]);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!stockNames.length) return;
      
      setLoading(true);
      try {
        await loadConfig(); // Ensure config is loaded
        const gatewayUrl = getGatewayUrl();
        
        const analysisPromises = stockNames.map(async (ticker: string) => {
          const response = await fetch(`${gatewayUrl}/analysis/${ticker}/explanation`);
          if (response.ok) {
            const data: AnalysisData = await response.json();
            // Transform the data to our interface
            return {
              ticker: data.ticker,
              finalSuggestion: data.finalSuggestion,
              totalScore: data.totalScore,
              breakdown: data.breakdown,
              weights: data.weights
            } as StockAnalysis;
          }
          return null;
        });
        
        const results = await Promise.all(analysisPromises);
        const validResults = results.filter((result: any) => result !== null) as StockAnalysis[];
        setAnalysisData(validResults);
      } catch (error) {
        console.error('Error fetching analysis data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [stockNames]);

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

  if (stockLoading || loading) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '2rem',
          color: '#333',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          Loading stock analysis...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#333',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
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
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            What to Buy?
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>View:</span>
            <button
              onClick={() => setViewMode('tiles')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'tiles' ? '#667eea' : '#e0e0e0',
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
                background: viewMode === 'table' ? '#667eea' : '#e0e0e0',
                color: viewMode === 'table' ? 'white' : '#333',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Table
            </button>
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
                            border: '2px solid #667eea',
                            background: expandedRows.has(stock.ticker) ? '#667eea' : 'white',
                            color: expandedRows.has(stock.ticker) ? 'white' : '#667eea',
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
