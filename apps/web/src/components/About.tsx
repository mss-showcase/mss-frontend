import React from "react";

const About = () => (
  <div className="about-container">
    {/* Header */}
    <div className="about-header">
      <h1 className="about-title">About MSS Showcase</h1>
      <p className="about-subtitle">
        Exploring the power of AWS cloud services and data-driven financial analytics
      </p>
    </div>

    {/* Platform Overview */}
    <div className="about-section">
      <h2 className="about-section-title">🚀 Platform Overview</h2>
      <p className="about-description">
        This application demonstrates the capabilities of the AWS platform and modern data analysis techniques.
        Built using modern React, TypeScript, and various AWS services to deliver a comprehensive financial analysis experience.
      </p>
    </div>

    {/* Key Features */}
    <div className="about-section">
      <h2 className="about-section-title">💡 Key Features</h2>
      <div className="about-features-grid">
        <div className="about-feature-item">
          <div className="about-feature-icon">📈</div>
          <div className="about-feature-content">
            <h3 className="about-feature-title">Stock Analysis</h3>
            <p className="about-feature-description">
              Real-time stock data from Alpha Vantage with interactive charts and technical indicators
            </p>
          </div>
        </div>
        <div className="about-feature-item">
          <div className="about-feature-icon">📊</div>
          <div className="about-feature-content">
            <h3 className="about-feature-title">Sentiment Analysis</h3>
            <p className="about-feature-description">
              News sentiment analysis using Python-based processing of financial articles
            </p>
          </div>
        </div>
        <div className="about-feature-item">
          <div className="about-feature-icon">📊</div>
          <div className="about-feature-content">
            <h3 className="about-feature-title">Fundamentals Data</h3>
            <p className="about-feature-description">
              Comprehensive financial metrics and company fundamentals
            </p>
          </div>
        </div>
        <div className="about-feature-item">
          <div className="about-feature-icon">📰</div>
          <div className="about-feature-content">
            <h3 className="about-feature-title">News Integration</h3>
            <p className="about-feature-description">
              Live financial news feeds from multiple trusted sources
            </p>
          </div>
        </div>
        <div className="about-feature-item">
          <div className="about-feature-icon">🌤️</div>
          <div className="about-feature-content">
            <h3 className="about-feature-title">Weather Data</h3>
            <p className="about-feature-description">
              Local weather information for context-aware analysis
            </p>
          </div>
        </div>
        <div className="about-feature-item">
          <div className="about-feature-icon">⚡</div>
          <div className="about-feature-content">
            <h3 className="about-feature-title">Real-time Updates</h3>
            <p className="about-feature-description">
              Live data streaming and responsive user interface
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Technology Stack */}
    <div className="about-section">
      <h2 className="about-section-title">🛠️ Technology Stack</h2>
      <div className="about-tech-stack">
        <div className="about-tech-category">
          <h4 className="about-tech-title">Frontend</h4>
          <ul className="about-tech-list">
            <li className="about-tech-list-item">React 18 with TypeScript</li>
            <li className="about-tech-list-item">Redux Toolkit for state management</li>
            <li className="about-tech-list-item">Vite for fast development</li>
            <li className="about-tech-list-item">Modern CSS with responsive design</li>
          </ul>
        </div>
        <div className="about-tech-category">
          <h4 className="about-tech-title">AWS Services</h4>
          <ul className="about-tech-list">
            <li className="about-tech-list-item">API Gateway for backend routing</li>
            <li className="about-tech-list-item">Lambda functions for serverless compute</li>
            <li className="about-tech-list-item">AWS Cognito user management and Google OAuth</li>
            <li className="about-tech-list-item">Data processing and analytics</li>
            <li className="about-tech-list-item">S3 buckets for build data and business data and webhosting</li>
            <li className="about-tech-list-item">SQS queue for rss feed processing and sentiment analysis</li>
            <li className="about-tech-list-item">Github Actions + Terraform deploy</li>
          </ul>
        </div>
        <div className="about-tech-category">
          <h4 className="about-tech-title">Data Sources</h4>
          <ul className="about-tech-list">
            <li className="about-tech-list-item">Alpha Vantage for stock data</li>
            <li className="about-tech-list-item">Financial news RSS feeds</li>
            <li className="about-tech-list-item">Weather API integration</li>
            <li className="about-tech-list-item">Real-time market data</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default About;