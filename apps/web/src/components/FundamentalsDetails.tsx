import React, { useState } from 'react';

const fundamentalsLabels: Record<string, string> = {
  ReturnOnEquityTTM: 'Return on Equity (TTM)',
  Sector: 'Sector',
  Address: 'Address',
  CIK: 'CIK',
  '52WeekHigh': '52 Week High',
  GrossProfitTTM: 'Gross Profit (TTM)',
  '200DayMovingAverage': '200 Day Moving Average',
  TrailingPE: 'Trailing P/E',
  PriceToBookRatio: 'Price/Book Ratio',
  DividendYield: 'Dividend Yield',
  EVToRevenue: 'EV to Revenue',
  OfficialSite: 'Official Site',
  RevenuePerShareTTM: 'Revenue Per Share (TTM)',
  Symbol: 'Symbol',
  Name: 'Name',
  DilutedEPSTTM: 'Diluted EPS (TTM)',
  MarketCapitalization: 'Market Capitalization',
  LatestQuarter: 'Latest Quarter',
  symbol: 'Symbol',
  AnalystRatingBuy: 'Analyst Rating (Buy)',
  ProfitMargin: 'Profit Margin',
  QuarterlyRevenueGrowthYOY: 'Quarterly Revenue Growth YOY',
  EBITDA: 'EBITDA',
  FiscalYearEnd: 'Fiscal Year End',
  PEGRatio: 'PEG Ratio',
  EVToEBITDA: 'EV to EBITDA',
  DividendPerShare: 'Dividend Per Share',
  SharesOutstanding: 'Shares Outstanding',
  PERatio: 'P/E Ratio',
  AnalystTargetPrice: 'Analyst Target Price',
  Beta: 'Beta',
  ForwardPE: 'Forward P/E',
  AnalystRatingHold: 'Analyst Rating (Hold)',
  '52WeekLow': '52 Week Low',
  ttl: 'TTL',
  Industry: 'Industry',
  RevenueTTM: 'Revenue (TTM)',
  QuarterlyEarningsGrowthYOY: 'Quarterly Earnings Growth YOY',
  '50DayMovingAverage': '50 Day Moving Average',
  AnalystRatingSell: 'Analyst Rating (Sell)',
  DividendDate: 'Dividend Date',
  Currency: 'Currency',
  AnalystRatingStrongSell: 'Analyst Rating (Strong Sell)',
  AnalystRatingStrongBuy: 'Analyst Rating (Strong Buy)',
  as_of: 'As Of',
  BookValue: 'Book Value',
  PriceToSalesRatioTTM: 'Price to Sales Ratio (TTM)',
  Country: 'Country',
  EPS: 'Earnings Per Share (EPS)',
  AssetType: 'Asset Type',
  ExDividendDate: 'Ex-Dividend Date',
  Description: 'Description',
  OperatingMarginTTM: 'Operating Margin (TTM)',
  ReturnOnAssetsTTM: 'Return on Assets (TTM)',
  Exchange: 'Exchange',
  DebtToEquity: 'Debt to Equity',
};

const mainMarkers = [
  'MarketCapitalization',
  'PERatio',
  'EPS',
  'DividendYield',
  'PriceToBookRatio',
  'ReturnOnEquityTTM',
  'DebtToEquity',
];

const formatCurrency = (value: any) => {
  const num = Number(value);
  if (isNaN(num)) return value;
  return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const formatNumber = (value: any) => {
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const formatPercent = (value: any) => {
  const num = Number(value);
  if (isNaN(num)) return value;
  return (num * 100).toFixed(2) + '%';
};

const formatDate = (value: any) => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US');
};

const fieldFormatters: Record<string, (value: any) => string> = {
  MarketCapitalization: formatCurrency,
  MarketCapitalizationUSD: formatCurrency,
  EBITDA: formatCurrency,
  RevenueTTM: formatCurrency,
  GrossProfitTTM: formatCurrency,
  AnalystTargetPrice: formatCurrency,
  DividendPerShare: formatCurrency,
  BookValue: formatCurrency,
  SharesOutstanding: formatNumber,
  '52WeekHigh': formatCurrency,
  '52WeekLow': formatCurrency,
  '50DayMovingAverage': formatCurrency,
  '200DayMovingAverage': formatCurrency,
  PriceToBookRatio: formatNumber,
  PERatio: formatNumber,
  PEGRatio: formatNumber,
  TrailingPE: formatNumber,
  ForwardPE: formatNumber,
  PriceToSalesRatioTTM: formatNumber,
  EVToRevenue: formatNumber,
  EVToEBITDA: formatNumber,
  Beta: formatNumber,
  EPS: formatNumber,
  DilutedEPSTTM: formatNumber,
  ReturnOnEquityTTM: formatPercent,
  ReturnOnAssetsTTM: formatPercent,
  ProfitMargin: formatPercent,
  OperatingMarginTTM: formatPercent,
  DividendYield: formatPercent,
  QuarterlyRevenueGrowthYOY: formatPercent,
  QuarterlyEarningsGrowthYOY: formatPercent,
  DividendDate: formatDate,
  ExDividendDate: formatDate,
  LatestQuarter: formatDate,
  as_of: formatDate,
};

type FundamentalsDetailsProps = {
  fundamentals: {
    data: Record<string, any> | null;
    loading: boolean;
    error: string | null;
  };
};

const FundamentalsDetails: React.FC<FundamentalsDetailsProps> = ({ fundamentals }) => {
  const [showFundamentalsDetails, setShowFundamentalsDetails] = useState(false);

  // Extract asOf value and remove from fundamentals for table rendering
  const asOf = fundamentals.data?.as_of;

  // Render main fundamental markers
  const renderMainFundamentals = () => {
    if (!fundamentals.data) return null;
    // Filter and sort mainMarkers that exist in the data
    const sortedMainMarkers = mainMarkers
      .filter((marker) => fundamentals.data![marker] !== undefined)
      .sort((a, b) => a.localeCompare(b));
    return (
      <table style={{ marginTop: '1rem', marginBottom: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ textAlign: 'left', fontSize: '1.1rem', paddingBottom: 4 }}>Main Fundamentals</th>
          </tr>
        </thead>
        <tbody>
          {sortedMainMarkers.map((marker) => (
            <tr key={marker}>
              <td style={{ fontWeight: 500, paddingRight: 12 }}>
                {fundamentalsLabels[marker] || marker}
              </td>
              <td>
                {fieldFormatters[marker]
                  ? fieldFormatters[marker](fundamentals.data![marker])
                  : fundamentals.data![marker]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Render all other fundamentals
  const renderOtherFundamentals = () => {
    if (!fundamentals.data) return null;
    const otherKeys = Object.keys(fundamentals.data)
      .filter((key) => !mainMarkers.includes(key))
      .filter((key) => key !== "ttl" && key !== "as_of")
      .sort((a, b) => a.localeCompare(b)); // Sort keys ascending
    if (otherKeys.length === 0) return <div>No further details.</div>;
    return (
      <table style={{ marginTop: '0.5rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ textAlign: 'left', fontSize: '1.05rem', paddingBottom: 4 }}>All Fundamentals</th>
          </tr>
        </thead>
        <tbody>
          {otherKeys.map((key) => (
            <tr key={key}>
              <td style={{ fontWeight: 500, paddingRight: 12 }}>
                {fundamentalsLabels[key] || key}
              </td>
              <td>
                {fieldFormatters[key]
                  ? fieldFormatters[key](fundamentals.data![key])
                  : fundamentals.data![key]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      {/* Data as of */}
      {asOf && (
        <div style={{ margin: '1rem 0 0.5rem 0', fontStyle: 'italic', color: '#444', fontSize: '1rem' }}>
          Data as of: {fieldFormatters['as_of'](asOf)}
        </div>
      )}

      {/* Fundamentals main markers */}
      {fundamentals.loading && <div>Loading fundamentals...</div>}
      {fundamentals.error && <div style={{ color: 'red' }}>{fundamentals.error}</div>}
      {fundamentals.data && renderMainFundamentals()}

      {/* Fundamentals details toggle */}
      {fundamentals.data && (
        <div style={{ marginTop: '1rem' }}>
          <button
            className="button"
            style={{ maxWidth: 200, marginBottom: '0.5rem' }}
            onClick={() => setShowFundamentalsDetails((v) => !v)}
          >
            {showFundamentalsDetails ? 'Hide Details' : 'Show All Fundamentals'}
          </button>
          {showFundamentalsDetails && renderOtherFundamentals()}
        </div>
      )}
    </>
  );
};

export default FundamentalsDetails;