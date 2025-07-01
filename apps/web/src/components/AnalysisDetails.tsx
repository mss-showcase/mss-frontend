import React, { useState } from 'react';
import { AnalysisData, Article } from '@mss-frontend/store/analysisSlice';

interface AnalysisDetailsProps {
  analysis: {
    data: AnalysisData | null;
    loading: boolean;
    error: string | null;
  };
  onSuggestionClick: (suggestion: string) => void;
  onExpand?: (expanded: boolean) => void;
}

const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({ analysis, onSuggestionClick, onExpand }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  if (analysis.loading) {
    return <div>Loading analysis...</div>;
  }

  if (analysis.error) {
    return <div style={{ color: 'red' }}>Error loading analysis: {analysis.error}</div>;
  }

  if (!analysis.data) {
    return null;
  }

  const { data } = analysis;
  
  const getSuggestionColor = (suggestion: string) => {
    switch (suggestion.toLowerCase()) {
      case 'buy': return '#28a745';
      case 'sell': return '#dc3545';
      case 'hold': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'positive': return '#28a745';
      case 'negative': return '#dc3545';
      case 'neutral': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatScore = (score: number) => score.toFixed(2);

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Analysis for {data.ticker}</h3>
      
      {/* Final Suggestion */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Final Suggestion</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => onSuggestionClick(data.finalSuggestion)}
            style={{
              backgroundColor: getSuggestionColor(data.finalSuggestion),
              color: 'white',
              padding: '0.5rem 1rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {data.finalSuggestion}
          </button>
          <span
            style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              backgroundColor: showBreakdown ? '#3b82f6' : '#6b7280',
              color: 'white',
              borderRadius: '50%',
              textAlign: 'center',
              fontSize: '0.8rem',
              lineHeight: '20px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onClick={() => {
              const newState = !showBreakdown;
              setShowBreakdown(newState);
              onExpand?.(newState);
            }}
            onMouseEnter={(e) => {
              if (!showBreakdown) {
                e.currentTarget.style.backgroundColor = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (!showBreakdown) {
                e.currentTarget.style.backgroundColor = '#6b7280';
              }
            }}
            title="Click to see detailed analysis breakdown"
          >
            ?
          </span>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          Total Score: {formatScore(data.totalScore)}
        </div>
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4>Analysis Breakdown</h4>
          
          {/* Technical Analysis */}
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>
              Technical Analysis (Weight: {(data.weights.ta * 100).toFixed(0)}%)
            </h5>
            <div><strong>Score:</strong> {data.breakdown.ta.score}</div>
            <div><strong>Marker:</strong> {data.breakdown.ta.marker}</div>
            <div><strong>Value:</strong> {data.breakdown.ta.value}</div>
            <div><strong>Explanation:</strong> {data.breakdown.ta.explanation}</div>
          </div>

          {/* Sentiment Analysis */}
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>
              Sentiment Analysis (Weight: {(data.weights.sentiment * 100).toFixed(0)}%)
            </h5>
            <div><strong>Score:</strong> {data.breakdown.sentiment.score}</div>
            <div><strong>Explanation:</strong> {data.breakdown.sentiment.explanation}</div>
            
            {/* Articles */}
            {data.breakdown.sentiment.articles && data.breakdown.sentiment.articles.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <strong>Related Articles:</strong>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  {data.breakdown.sentiment.articles.map((article: Article, index: number) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'none' }}
                      >
                        {article.title}
                      </a>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>
                        <span 
                          style={{ 
                            color: getSentimentColor(article.sentiment_label),
                            fontWeight: 'bold'
                          }}
                        >
                          {article.sentiment_label}
                        </span>
                        {' '}({article.sentiment_score.toFixed(3)}) - {new Date(article.pubdate).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Fundamentals */}
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>
              Fundamentals (Weight: {(data.weights.fundamentals * 100).toFixed(0)}%)
            </h5>
            <div><strong>Score:</strong> {data.breakdown.fundamentals.score}</div>
            <div><strong>Explanation:</strong> {data.breakdown.fundamentals.explanation}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDetails;
