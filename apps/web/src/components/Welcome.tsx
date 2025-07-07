import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@mss-frontend/store';
import { fetchStockNames } from '@mss-frontend/store/stockNamesSlice';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: '66vw',
    minWidth: 320,
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,
  
  header: {
    marginBottom: '3rem',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  
  title: {
    fontSize: '3rem',
    fontWeight: '300',
    color: '#2c3e50',
    margin: '0 0 1rem 0',
    lineHeight: '1.2',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '1.3rem',
    color: '#7f8c8d',
    margin: '0 0 2rem 0',
    lineHeight: '1.5',
  } as React.CSSProperties,

  quickStartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e1e8ed',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  quickStartTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.5rem',
  } as React.CSSProperties,

  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    maxWidth: '400px',
    margin: '0 auto',
  } as React.CSSProperties,

  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
    textAlign: 'left' as const,
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

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  } as React.CSSProperties,

  featureCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  featureIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  } as React.CSSProperties,

  featureContent: {
    flex: 1,
  } as React.CSSProperties,

  featureTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,

  featureDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.5',
    margin: 0,
  } as React.CSSProperties,

  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#6b7280',
  } as React.CSSProperties,

  errorState: {
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center' as const,
  } as React.CSSProperties,
};

const Welcome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state: RootState) => state.stockNames);
  const [selectedStock, setSelectedStock] = useState('');

  useEffect(() => {
    dispatch(fetchStockNames());
  }, [dispatch]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedStock(selected);
    if (selected) {
      navigate(`/stock/${selected}`);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome to MSS Showcase</h1>
        <p style={styles.subtitle}>
          Explore comprehensive stock analysis with sentiment analysis and real-time data
        </p>
      </div>

      {/* Quick Start */}
      <div style={styles.quickStartCard}>
        <h2 style={styles.quickStartTitle}>🚀 Quick Start</h2>
        <div style={styles.inputGroup}>
          <label className="quickstart-label">Choose a Stock to Analyze</label>
          {loading && <div style={styles.loadingState}>Loading stocks...</div>}
          {error && <div className="quickstart-error">{error}</div>}
          {!loading && !error && (
            <select
              onChange={handleSelect}
              value={selectedStock}
              style={{
                ...styles.select,
                borderColor: selectedStock ? '#3b82f6' : '#e5e7eb',
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              <option value="" disabled>Select a stock symbol</option>
              {items.map((item: string) => (
                <option
                  key={item}
                  value={item}
                  style={{
                    fontWeight: item === selectedStock ? 600 : 400,
                    color: item === selectedStock ? '#2563eb' : '#374151',
                    backgroundColor: item === selectedStock ? '#f0f9ff' : '#fff',
                  }}
                >
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Features Overview */}
      <div style={styles.contentSection}>
        <h2 style={styles.sectionTitle}>✨ Platform Features</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📈</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Interactive Charts</h3>
              <p style={styles.featureDescription}>
                Real-time candlestick charts with multiple time windows and technical analysis
              </p>
            </div>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Fundamentals Analysis</h3>
              <p style={styles.featureDescription}>
                Key financial metrics including P/E ratios, market cap, and performance indicators
              </p>
            </div>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📈</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Sentiment Analysis</h3>
              <p style={styles.featureDescription}>
                Python-based sentiment analysis of financial news with detailed breakdown
              </p>
            </div>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📰</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Live News Feed</h3>
              <p style={styles.featureDescription}>
                Curated financial news from trusted sources like CNBC, MarketWatch, and more
              </p>
            </div>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🌤️</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Market Context</h3>
              <p style={styles.featureDescription}>
                Weather and environmental factors that may influence market sentiment
              </p>
            </div>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚡</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Real-time Data</h3>
              <p style={styles.featureDescription}>
                Live market data powered by Alpha Vantage with automatic updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;