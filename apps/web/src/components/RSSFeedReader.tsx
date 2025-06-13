import React, { useEffect, useState } from 'react';

const FEEDS = [
  { label: 'Seeking Alpha', url: 'https://seekingalpha.com/market_currents.xml' },
  { label: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
  { label: 'Investing.com', url: 'https://www.investing.com/rss/news_25.rss' },
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

  return (
    <div className="welcome" style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#007bff', marginBottom: 16 }}>News Feed</h2>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="feed-select" style={{ fontWeight: 'bold', marginRight: 8 }}>Select Feed:</label>
        <select
          id="feed-select"
          value={selectedFeed}
          onChange={e => setSelectedFeed(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 5,
            border: '1px solid #e0e7ff',
            fontSize: 16,
            background: '#f4f4f4',
            color: '#333',
            outline: 'none'
          }}
        >
          {FEEDS.map(feed => (
            <option key={feed.url} value={feed.url}>{feed.label}</option>
          ))}
        </select>
      </div>
      {loading && <p style={{ color: '#007bff' }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, idx) => (
          <li
            key={idx}
            style={{
              marginBottom: 24,
              borderBottom: '1px solid #e0e7ff',
              paddingBottom: 12,
              background: '#fff',
              borderRadius: 5,
              boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
              padding: '16px 16px 12px 16px'
            }}
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 'bold',
                color: '#007bff',
                fontSize: 18,
                textDecoration: 'none'
              }}
            >
              {item.title}
            </a>
            <div style={{ fontSize: 12, color: '#888', margin: '4px 0 8px 0' }}>{item.pubDate}</div>
            <div
              dangerouslySetInnerHTML={{ __html: item.description || '' }}
              style={{ fontSize: 15, color: '#333' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};