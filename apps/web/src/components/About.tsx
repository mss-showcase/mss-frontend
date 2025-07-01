
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
  
  descriptionText: {
    lineHeight: '1.6',
    color: '#555',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,
  
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  } as React.CSSProperties,
  
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
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
  
  techStack: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  } as React.CSSProperties,
  
  techCategory: {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  } as React.CSSProperties,
  
  techTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#3b82f6',
    margin: '0 0 0.75rem 0',
    borderBottom: '2px solid #e0e7ff',
    paddingBottom: '0.5rem',
  } as React.CSSProperties,
  
  techList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  } as React.CSSProperties,
  
  techListItem: {
    padding: '0.25rem 0 0.25rem 0.75rem',
    color: '#555',
    fontSize: '0.9rem',
    borderLeft: '3px solid #e0e7ff',
    marginBottom: '0.25rem',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
};

const About = () => (
  <div style={styles.container}>
    {/* Header */}
    <div style={styles.header}>
      <h1 style={styles.title}>About MSS Showcase</h1>
      <p style={styles.subtitle}>
        Exploring the power of AWS cloud services and data-driven financial analytics
      </p>
    </div>

    {/* Platform Overview */}
    <div style={styles.contentSection}>
      <h2 style={styles.sectionTitle}>🚀 Platform Overview</h2>
      <p style={styles.descriptionText}>
        This application demonstrates the capabilities of the AWS platform and modern data analysis techniques.
        Built using modern React, TypeScript, and various AWS services to deliver a comprehensive financial analysis experience.
      </p>
    </div>

    {/* Key Features */}
    <div style={styles.contentSection}>
      <h2 style={styles.sectionTitle}>💡 Key Features</h2>
      <div style={styles.featuresGrid}>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}>📈</div>
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Stock Analysis</h3>
            <p style={styles.featureDescription}>
              Real-time stock data from Alpha Vantage with interactive charts and technical indicators
            </p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}>📊</div>
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Sentiment Analysis</h3>
            <p style={styles.featureDescription}>
              News sentiment analysis using Python-based processing of financial articles
            </p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}>📊</div>
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Fundamentals Data</h3>
            <p style={styles.featureDescription}>
              Comprehensive financial metrics and company fundamentals
            </p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}>📰</div>
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>News Integration</h3>
            <p style={styles.featureDescription}>
              Live financial news feeds from multiple trusted sources
            </p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}>🌤️</div>
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Weather Data</h3>
            <p style={styles.featureDescription}>
              Local weather information for context-aware analysis
            </p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}>⚡</div>
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Real-time Updates</h3>
            <p style={styles.featureDescription}>
              Live data streaming and responsive user interface
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Technology Stack */}
    <div style={styles.contentSection}>
      <h2 style={styles.sectionTitle}>🛠️ Technology Stack</h2>
      <div style={styles.techStack}>
        <div style={styles.techCategory}>
          <h4 style={styles.techTitle}>Frontend</h4>
          <ul style={styles.techList}>
            <li style={styles.techListItem}>React 18 with TypeScript</li>
            <li style={styles.techListItem}>Redux Toolkit for state management</li>
            <li style={styles.techListItem}>Vite for fast development</li>
            <li style={styles.techListItem}>Modern CSS with responsive design</li>
          </ul>
        </div>
        <div style={styles.techCategory}>
          <h4 style={styles.techTitle}>AWS Services</h4>
          <ul style={styles.techList}>
            <li style={styles.techListItem}>API Gateway for backend routing</li>
            <li style={styles.techListItem}>Lambda functions for serverless compute</li>
            <li style={styles.techListItem}>Data processing and analytics</li>
            <li style={styles.techListItem}>S3 buckets for build data and business data and webhosting</li>
            <li style={styles.techListItem}>SQS queue for rss feed processing and sentiment analysis</li>
            <li style={styles.techListItem}>Github Actions + Terraform deploy</li>
          </ul>
        </div>
        <div style={styles.techCategory}>
          <h4 style={styles.techTitle}>Data Sources</h4>
          <ul style={styles.techList}>
            <li style={styles.techListItem}>Alpha Vantage for stock data</li>
            <li style={styles.techListItem}>Financial news RSS feeds</li>
            <li style={styles.techListItem}>Weather API integration</li>
            <li style={styles.techListItem}>Real-time market data</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default About;