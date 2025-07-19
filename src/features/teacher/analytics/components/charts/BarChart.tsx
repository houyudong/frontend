/**
 * 柱状图组件
 * 
 * 用于展示分类数据和对比分析
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartContainer, ChartLoading, ChartEmpty, ChartError, defaultChartOptions, chartColors, createDatasetStyle } from './ChartBase';

// 柱状图数据点
export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

// 柱状图数据集
export interface BarChartDataset {
  label: string;
  data: BarChartDataPoint[];
  color?: string;
  type?: 'vertical' | 'horizontal';
}

// 柱状图属性
export interface BarChartProps {
  title: string;
  subtitle?: string;
  datasets: BarChartDataset[];
  height?: number;
  loading?: boolean;
  error?: string;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  actions?: React.ReactNode;
  onRetry?: () => void;
  xAxisLabel?: string;
  yAxisLabel?: string;
  formatTooltip?: (value: number, label: string) => string;
  onClick?: (dataPoint: BarChartDataPoint, datasetIndex: number) => void;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  subtitle,
  datasets,
  height = 400,
  loading = false,
  error,
  className = '',
  showGrid = true,
  showLegend = true,
  stacked = false,
  horizontal = false,
  actions,
  onRetry,
  xAxisLabel,
  yAxisLabel,
  formatTooltip,
  onClick
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

  // 获取所有标签
  const allLabels = Array.from(
    new Set(datasets.flatMap(dataset => dataset.data.map(point => point.label)))
  );

  // 准备图表数据
  const chartData = {
    labels: allLabels,
    datasets: datasets.map((dataset, index) => {
      const baseColor = dataset.color || Object.values(chartColors)[index % Object.values(chartColors).length];
      
      // 创建完整的数据数组
      const dataMap = new Map(dataset.data.map(point => [point.label, point]));
      const fullData = allLabels.map(label => {
        const point = dataMap.get(label);
        return point ? point.value : 0;
      });

      // 为每个数据点设置颜色
      const backgroundColors = allLabels.map(label => {
        const point = dataMap.get(label);
        return point?.color || `${baseColor}80`;
      });

      const borderColors = allLabels.map(label => {
        const point = dataMap.get(label);
        return point?.color || baseColor;
      });

      return {
        label: dataset.label,
        data: fullData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      };
    })
  };

  // 图表配置
  const options = {
    ...defaultChartOptions,
    indexAxis: horizontal ? 'y' as const : 'x' as const,
    plugins: {
      ...defaultChartOptions.plugins,
      legend: {
        ...defaultChartOptions.plugins.legend,
        display: showLegend && datasets.length > 1
      },
      tooltip: {
        ...defaultChartOptions.plugins.tooltip,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed[horizontal ? 'x' : 'y'];
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
        stacked,
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
        stacked,
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
    onClick: onClick ? (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const dataIndex = element.index;
        const dataset = datasets[datasetIndex];
        const dataPoint = dataset.data[dataIndex];
        if (dataPoint) {
          onClick(dataPoint, datasetIndex);
        }
      }
    } : undefined
  };

  return (
    <ChartContainer 
      title={title} 
      subtitle={subtitle} 
      height={height} 
      className={className}
      actions={actions}
    >
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default BarChart;
