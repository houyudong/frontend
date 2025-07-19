/**
 * 饼图组件
 * 
 * 用于展示占比和分布数据
 */

import React from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import { ChartContainer, ChartLoading, ChartEmpty, ChartError, chartColors } from './ChartBase';

// 饼图数据点
export interface PieChartDataPoint {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

// 饼图属性
export interface PieChartProps {
  title: string;
  subtitle?: string;
  data: PieChartDataPoint[];
  height?: number;
  loading?: boolean;
  error?: string;
  className?: string;
  showLegend?: boolean;
  showPercentage?: boolean;
  doughnut?: boolean;
  cutout?: number;
  actions?: React.ReactNode;
  onRetry?: () => void;
  formatTooltip?: (value: number, label: string, percentage: number) => string;
  onClick?: (dataPoint: PieChartDataPoint, index: number) => void;
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  subtitle,
  data,
  height = 400,
  loading = false,
  error,
  className = '',
  showLegend = true,
  showPercentage = true,
  doughnut = false,
  cutout = 50,
  actions,
  onRetry,
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
  if (!data || data.length === 0) {
    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} className={className}>
        <ChartEmpty height={height} />
      </ChartContainer>
    );
  }

  // 计算总值和百分比
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0
  }));

  // 生成颜色
  const colors = data.map((item, index) => 
    item.color || Object.values(chartColors)[index % Object.values(chartColors).length]
  );

  // 准备图表数据
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [{
      data: data.map(item => item.value),
      backgroundColor: colors.map(color => `${color}80`),
      borderColor: colors,
      borderWidth: 2,
      hoverBackgroundColor: colors.map(color => `${color}CC`),
      hoverBorderColor: colors,
      hoverBorderWidth: 3
    }]
  };

  // 图表配置
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: doughnut ? `${cutout}%` : 0,
    plugins: {
      legend: {
        display: showLegend,
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Noto Sans SC', sans-serif"
          },
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            if (datasets.length) {
              return chart.data.labels.map((label: string, index: number) => {
                const value = datasets[0].data[index];
                const percentage = dataWithPercentage[index].percentage;
                const color = colors[index];
                
                return {
                  text: showPercentage ? `${label} (${percentage.toFixed(1)}%)` : label,
                  fillStyle: color,
                  strokeStyle: color,
                  lineWidth: 2,
                  index
                };
              });
            }
            return [];
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
            const label = context.label || '';
            const value = context.parsed;
            const percentage = dataWithPercentage[context.dataIndex].percentage;
            
            if (formatTooltip) {
              return formatTooltip(value, label, percentage);
            }
            
            return `${label}: ${value} (${percentage.toFixed(1)}%)`;
          }
        }
      }
    },
    onClick: onClick ? (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const element = elements[0];
        const index = element.index;
        const dataPoint = dataWithPercentage[index];
        if (dataPoint) {
          onClick(dataPoint, index);
        }
      }
    } : undefined,
    animation: {
      animateRotate: true,
      animateScale: false
    }
  };

  const ChartComponent = doughnut ? Doughnut : Pie;

  return (
    <ChartContainer 
      title={title} 
      subtitle={subtitle} 
      height={height} 
      className={className}
      actions={actions}
    >
      <div className="flex items-center justify-center h-full">
        <div className="relative" style={{ width: '100%', height: '100%' }}>
          <ChartComponent data={chartData} options={options} />
          
          {/* 中心显示总数（仅环形图） */}
          {doughnut && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">总计</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ChartContainer>
  );
};

export default PieChart;
