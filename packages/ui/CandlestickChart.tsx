import { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  type CandlestickData,
  type LineData,
  type IChartApi,
  type ISeriesApi,
  type DeepPartial,
  type ChartOptions,
} from 'lightweight-charts';

interface MarkerDataPoint {
  time: string;
  value: number;
}

interface MarkerData {
  symbol: string;
  marker: string;
  series: MarkerDataPoint[];
}

type Props = { 
  data: CandlestickData[]; 
  markerData?: MarkerData[];
};

const CandlestickChart = ({ data, markerData = [] }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const markerSeriesRef = useRef<Map<string, ISeriesApi<'Line'>>>(new Map());

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

  // Effect to handle marker data
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const currentSeries = markerSeriesRef.current;

    // Remove existing marker series
    currentSeries.forEach((series) => {
      try {
        chart.removeSeries(series);
      } catch (error) {
        console.warn('Error removing series:', error);
      }
    });
    currentSeries.clear();

    // Add new marker series only if we have valid data
    if (!markerData || markerData.length === 0) return;

    markerData.forEach((marker, index) => {
      try {
        // Validate marker data before processing
        if (!marker || !marker.series || !Array.isArray(marker.series) || marker.series.length === 0) {
          console.warn(`Skipping invalid marker data:`, marker);
          return;
        }

        const colors = [
          '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
          '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
        ];
        
        const lineSeries = chart.addSeries(LineSeries, {
          color: colors[index % colors.length],
          lineWidth: 2,
          title: marker.marker,
        });

        // Convert and validate marker data to LineData format
        const lineData: LineData[] = marker.series
          .map(point => {
            try {
              const timestamp = new Date(point.time).getTime();
              if (isNaN(timestamp) || !isFinite(point.value)) {
                return null;
              }
              return {
                time: Math.floor(timestamp / 1000) as any,
                value: point.value,
              };
            } catch (error) {
              console.warn('Error processing data point:', point, error);
              return null;
            }
          })
          .filter((point): point is LineData => point !== null)
          .sort((a, b) => (a.time as number) - (b.time as number)); // Sort by time

        // Only add series if we have valid data points
        if (lineData.length > 0) {
          lineSeries.setData(lineData);
          currentSeries.set(marker.marker, lineSeries);
        } else {
          console.warn(`No valid data points for marker: ${marker.marker}`);
          // Remove the series if no valid data
          chart.removeSeries(lineSeries);
        }
      } catch (error) {
        console.error(`Error adding marker series for ${marker.marker}:`, error);
      }
    });

    // Fit content after adding markers (only if we have series)
    if (currentSeries.size > 0) {
      try {
        chart.timeScale().fitContent();
      } catch (error) {
        console.warn('Error fitting chart content:', error);
      }
    }
  }, [markerData]);

  // Ensure both width and height are set!
  return <div ref={containerRef} style={{ width: '100%', height: 300 }} />;
};

export default CandlestickChart;
