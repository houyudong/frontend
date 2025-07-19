/**
 * 折线图组件
 * 
 * 用于展示时间序列数据和趋势分析
 */

import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartContainer, ChartLoading, ChartEmpty, ChartError, defaultChartOptions, chartColors, createDatasetStyle } from './ChartBase';

// 折线图数据点
export interface LineChartDataPoint {
  x: string | number;
  y: number;
}

// 折线图数据集
export interface LineChartDataset {
  label: string;
  data: LineChartDataPoint[];
  color?: string;
  type?: 'line' | 'area';
  yAxisID?: string;
}

// 折线图属性
export interface LineChartProps {
  title: string;
  subtitle?: string;
  datasets: LineChartDataset[];
  height?: number;
  loading?: boolean;
  error?: string;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  smooth?: boolean;
  actions?: React.ReactNode;
  onRetry?: () => void;
  xAxisLabel?: string;
  yAxisLabel?: string;
  formatTooltip?: (value: number, label: string) => string;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  subtitle,
  datasets,
  height = 400,
  loading = false,
  error,
  className = '',
  showGrid = true,
  showLegend = true,
  smooth = true,
  actions,
  onRetry,
  xAxisLabel,
  yAxisLabel,
  formatTooltip
}) => {
  // 如果正在加载
  if (loading) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className}>
        <ChartLoading height={height} />
      </ChartContainer>
    );
  }

  // 如果有错误
  if (error) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className}>
        <ChartError height={height} message={error} onRetry={onRetry} />
      </ChartContainer>
    );
  }

  // 如果没有数据
  if (!datasets || datasets.length === 0 || datasets.every(d => d.data.length === 0)) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className}>
        <ChartEmpty height={height} />
      </ChartContainer>
    );
  }

  // 获取所有x轴标签
  const allLabels = Array.from(
    new Set(datasets.flatMap(dataset => dataset.data.map(point => point.x)))
  ).sort();

  // 准备图表数据
  const chartData = {
    labels: allLabels,
    datasets: datasets.map((dataset, index) => {
      const color = dataset.color || Object.values(chartColors)[index % Object.values(chartColors).length];
      const style = createDatasetStyle(color, dataset.type || 'line');
      
      // 创建完整的数据数组，缺失的点用null填充
      const dataMap = new Map(dataset.data.map(point => [point.x, point.y]));
      const fullData = allLabels.map(label => dataMap.get(label) ?? null);

      return {
        label: dataset.label,
        data: fullData,
        yAxisID: dataset.yAxisID,
        tension: smooth ? 0.4 : 0,
        ...style
      };
    })
  };

  // 图表配置
  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      legend: {
        ...defaultChartOptions.plugins.legend,
        display: showLegend
      },
      tooltip: {
        ...defaultChartOptions.plugins.tooltip,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (formatTooltip) {
              return formatTooltip(value, label);
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        ...defaultChartOptions.scales.x,
        display: true,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          font: {
            size: 12,
            family: "'Noto Sans SC', sans-serif"
          }
        }
      },
      y: {
        ...defaultChartOptions.scales.y,
        display: true,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: {
            size: 12,
            family: "'Noto Sans SC', sans-serif"
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  return (
    <ChartContainer 
      title={title} 
      subtitle={subtitle} 
      height={height} 
      className={className}
      actions={actions}
    >
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
};

export default LineChart;
