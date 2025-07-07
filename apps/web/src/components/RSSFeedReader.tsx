import React, { useEffect, useState } from 'react';

const FEEDS = [
  { label: 'Seeking Alpha', url: 'https://seekingalpha.com/market_currents.xml' },
  { label: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
  { label: 'BBC', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
  { label: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/' }
];

type FeedItem = {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
};

function parseRSS(xml: string): FeedItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const items = Array.from(doc.querySelectorAll('item'));
  return items.map(item => ({
    title: item.querySelector('title')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
    pubDate: item.querySelector('pubDate')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
  }));
}

const styles = {
  container: {
    maxWidth: '66vw',
    minWidth: 320,
    margin: '0 auto',
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
    margin: '0 0 1.5rem 0',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    margin: 0,
  } as React.CSSProperties,
  
  controlsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e1e8ed',
  } as React.CSSProperties,
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    margin: '1.5rem',
  } as React.CSSProperties,
  
  label: {
    margin: '1.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
  } as React.CSSProperties,
  
  select: {
    margin: '1.5rem',
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
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e1e8ed',
  } as React.CSSProperties,
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '1.5rem',
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
  
  feedInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '1.5rem',
    margin: '1.5rem',
    border: '1px solid #e2e8f0',
  } as React.CSSProperties,
  
  feedStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  
  feedIndicator: {
    fontSize: '1.2rem',
  } as React.CSSProperties,
  
  feedText: {
    fontWeight: '500',
    color: '#374151',
  } as React.CSSProperties,
  
  articlesCount: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontStyle: 'italic',
  } as React.CSSProperties,
  
  newsArticle: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  
  articleTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    lineHeight: '1.4',
  } as React.CSSProperties,
  
  articleLink: {
    color: '#3b82f6',
    textDecoration: 'none',
  } as React.CSSProperties,
  
  articleDate: {
    fontSize: '0.8rem',
    color: '#6b7280',
    marginBottom: '1rem',
  } as React.CSSProperties,
  
  articleDescription: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: '#4b5563',
    marginBottom: '1rem',
  } as React.CSSProperties,
  
  readMoreBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background-color 0.2s ease',
  } as React.CSSProperties,
};

export const RSSFeedReader: React.FC = () => {
  const [selectedFeed, setSelectedFeed] = useState(FEEDS[0].url);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(selectedFeed)}`)
      .then(res => res.json())
      .then(data => {
        setItems(parseRSS(data.contents));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load feed.');
        setLoading(false);
      });
  }, [selectedFeed]);

  const selectedFeedLabel = FEEDS.find(feed => feed.url === selectedFeed)?.label || 'Unknown';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📰 Financial News</h1>
        <p style={styles.subtitle}>
          Stay updated with the latest market news and analysis from trusted sources
        </p>
      </div>

      {/* News Source Selection */}
      <div style={styles.controlsCard}>
        <h2 style={styles.sectionTitle}>News Source</h2>
        <div style={styles.inputGroup}>
          <select
            value={selectedFeed}
            onChange={e => setSelectedFeed(e.target.value)}
            style={{
              ...styles.select,
              borderColor: selectedFeed ? '#3b82f6' : '#e5e7eb',
              maxWidth: 320,
            }}
            disabled={loading}
          >
            {FEEDS.map(feed => (
              <option key={feed.url} value={feed.url}>
                {feed.label}
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.feedInfo}>
          <div style={styles.feedStatus}>
            <span style={styles.feedIndicator}>
              {loading ? '🔄' : error ? '❌' : '✅'}
            </span>
            <span style={styles.feedText}>
              {loading ? 'Loading...' : error ? 'Connection Error' : `Connected to ${selectedFeedLabel}`}
            </span>
          </div>
          {!loading && !error && (
            <div style={styles.articlesCount}>
              {items.length} articles available
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.contentSection}>
          <div style={styles.errorState}>
            <strong>⚠️ Failed to Load News Feed</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>{error}</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
              This might be due to CORS restrictions or network issues. Please try a different news source.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={styles.contentSection}>
          <div style={styles.loadingState}>
            <div>Loading news articles from {selectedFeedLabel}...</div>
          </div>
        </div>
      )}

      {/* Articles */}
      {!loading && !error && items.length > 0 && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Latest Articles</h2>
          <div style={{ fontSize: '0.9rem', color: '#6b7280', margin: '1.5rem' }}>
            From {selectedFeedLabel}
          </div>
          
          {items.map((item, idx) => (
            <article 
              key={idx} 
              style={{
                ...styles.newsArticle,
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h3 style={styles.articleTitle}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.articleLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {item.title}
                </a>
              </h3>
              
              {item.pubDate && (
                <div style={styles.articleDate}>
                  {new Date(item.pubDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
              
              {item.description && (
                <div 
                  style={styles.articleDescription}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}
              
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.readMoreBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
              >
                Read Full Article →
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};