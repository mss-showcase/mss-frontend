import React from 'react';
import CandlestickChart from './CandlestickChart';
import type { CandlestickData } from 'lightweight-charts';

type Props = { ticks: any[] };

export const ChartSection: React.FC<Props> = ({ ticks }) => (
  <div>
    <pre style={{ background: '#f4f4f4', padding: 12, borderRadius: 6, overflowX: 'auto' }}>
      <CandlestickChart
        data={ticks.map(tick => ({
          time: Math.floor(new Date(tick.timestamp).getTime() / 1000),
          open: tick.open,
          high: tick.high,
          low: tick.low,
          close: tick.close,
        })) as CandlestickData[]}
      />
    </pre>
  </div>
);