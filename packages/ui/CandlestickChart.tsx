import { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  type CandlestickData,
  type IChartApi,
  type DeepPartial,
  type ChartOptions,
} from 'lightweight-charts';

type Props = { data: CandlestickData[] };

const CandlestickChart = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const options: DeepPartial<ChartOptions> = {
      layout: { background: { color: '#ffffff' }, textColor: '#000000' },
      grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    };

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 300,
      ...options,
    });

    chartRef.current = chart;

    // Új v5 szintaxis: típus és stílus opciók
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#4caf50',
      downColor: '#f44336',
      wickUpColor: '#4caf50',
      wickDownColor: '#f44336',
    });

    series.setData(data);

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: containerRef.current!.clientWidth });
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%' }} />;
};

export default CandlestickChart;
