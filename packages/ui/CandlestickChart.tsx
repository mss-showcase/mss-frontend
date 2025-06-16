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

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#4caf50',
      downColor: '#f44336',
      wickUpColor: '#4caf50',
      wickDownColor: '#f44336',
    });

    // Enable autoscale for the price scale (Y axis)
    chart.priceScale('right').applyOptions({ autoScale: true });

    series.setData(data);

    // Fit X axis to visible data
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: containerRef.current!.clientWidth });
      chart.timeScale().fitContent();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  // Ensure both width and height are set!
  return <div ref={containerRef} style={{ width: '100%', height: 300 }} />;
};

export default CandlestickChart;
