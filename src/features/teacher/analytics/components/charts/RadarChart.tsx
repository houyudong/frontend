/**
 * 雷达图组件
 * 
 * 用于展示多维度数据对比
 */

import React from 'react';
import { Radar } from 'react-chartjs-2';
import { ChartContainer, ChartLoading, ChartEmpty, ChartError, defaultChartOptions, chartColors } from './ChartBase';

// 雷达图数据点
export interface RadarChartDataPoint {
  dimension: string;
  value: number;
  maxValue?: number;
}

// 雷达图数据集
export interface RadarChartDataset {
  label: string;
  data: RadarChartDataPoint[];
  color?: string;
  fill?: boolean;
}

// 雷达图属性
export interface RadarChartProps {
  title: string;
  subtitle?: string;
  datasets: RadarChartDataset[];
  height?: number;
  loading?: boolean;
  error?: string;
  className?: string;
  showLegend?: boolean;
  actions?: React.ReactNode;
  onRetry?: () => void;
  formatTooltip?: (value: number, label: string, dimension: string) => string;
}

const RadarChart: React.FC<RadarChartProps> = ({
  title,
  subtitle,
  datasets,
  height = 400,
  loading = false,
  error,
  className = '',
  showLegend = true,
  actions,
  onRetry,
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

  // 获取所有维度
  const allDimensions = Array.from(
    new Set(datasets.flatMap(dataset => dataset.data.map(point => point.dimension)))
  );

  // 计算最大值用于标准化
  const maxValue = Math.max(
    ...datasets.flatMap(dataset => 
      dataset.data.map(point => point.maxValue || point.value)
    )
  );

  // 准备图表数据
  const chartData = {
    labels: allDimensions,
    datasets: datasets.map((dataset, index) => {
      const color = dataset.color || Object.values(chartColors)[index % Object.values(chartColors).length];
      
      // 创建完整的数据数组
      const dataMap = new Map(dataset.data.map(point => [point.dimension, point.value]));
      const fullData = allDimensions.map(dimension => dataMap.get(dimension) || 0);

      return {
        label: dataset.label,
        data: fullData,
        backgroundColor: dataset.fill !== false ? `${color}20` : 'transparent',
        borderColor: color,
        borderWidth: 2,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      };
    })
  };

  // 图表配置
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Noto Sans SC', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          family: "'Noto Sans SC', sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'Noto Sans SC', sans-serif"
        },
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.r;
            const dimension = allDimensions[context.dataIndex];
            
            if (formatTooltip) {
              return formatTooltip(value, label, dimension);
            }
            
            return `${label} - ${dimension}: ${value}`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: maxValue,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 11,
            family: "'Noto Sans SC', sans-serif"
          },
          color: '#666'
        },
        ticks: {
          display: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.1
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
      <Radar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default RadarChart;
