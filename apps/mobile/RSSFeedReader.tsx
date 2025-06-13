import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Linking, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { sharedStyles } from './styles';

const FEEDS = [
  { label: 'Seeking Alpha', url: 'https://seekingalpha.com/market_currents.xml' },
  { label: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
  { label: 'Investing.com', url: 'https://www.investing.com/rss/news_25.rss' },
  { label: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/' },
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

export function RSSFeedReader() {
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
    <View style={{ width: '100%', flex: 1 }}>
      <Text style={sharedStyles.text}>Select a feed:</Text>
      <Picker
        selectedValue={selectedFeed}
        onValueChange={setSelectedFeed}
        style={{ width: 260, backgroundColor: '#fff', marginBottom: 12 }}
      >
        {FEEDS.map(feed => (
          <Picker.Item key={feed.url} label={feed.label} value={feed.url} />
        ))}
      </Picker>
      {loading && <ActivityIndicator color="#007bff" />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <ScrollView style={styles.feedList}>
        {items.map((item, idx) => (
          <View key={idx} style={styles.feedItem}>
            <Text
              style={styles.feedTitle}
              onPress={() => Linking.openURL(item.link)}
            >
              {item.title}
            </Text>
            <Text style={styles.feedDate}>{item.pubDate}</Text>
            {item.description ? (
              <Text style={styles.feedDesc} numberOfLines={4}>
                {item.description.replace(/<[^>]+>/g, '')}
              </Text>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  feedList: {
    width: '100%',
    marginTop: 8,
  },
  feedItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feedTitle: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  feedDate: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  feedDesc: {
    color: '#333',
    fontSize: 14,
  },
});