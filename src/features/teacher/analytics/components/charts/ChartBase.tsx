/**
 * 图表基础组件
 * 
 * 提供图表的通用配置和样式
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

// 通用图表配置
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
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
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 11,
          family: "'Noto Sans SC', sans-serif"
        },
        color: '#666'
      }
    },
    y: {
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 11,
          family: "'Noto Sans SC', sans-serif"
        },
        color: '#666'
      }
    }
  }
};

// 颜色主题
export const chartColors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  gray: '#6B7280'
};

// 渐变色配置
export const gradientColors = {
  blue: ['#3B82F6', '#1D4ED8'],
  green: ['#10B981', '#047857'],
  yellow: ['#F59E0B', '#D97706'],
  red: ['#EF4444', '#DC2626'],
  purple: ['#8B5CF6', '#7C3AED'],
  pink: ['#EC4899', '#DB2777']
};

// 图表容器组件
interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
  className?: string;
  actions?: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  children,
  height = 400,
  className = '',
  actions
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* 图表标题 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      
      {/* 图表内容 */}
      <div style={{ height: `${height}px` }}>
        {children}
      </div>
    </div>
  );
};

// 加载状态组件
export const ChartLoading: React.FC<{ height?: number }> = ({ height = 400 }) => {
  return (
    <div 
      className="flex items-center justify-center bg-gray-50 rounded-lg"
      style={{ height: `${height}px` }}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500">图表加载中...</p>
      </div>
    </div>
  );
};

// 空数据状态组件
export const ChartEmpty: React.FC<{ height?: number; message?: string }> = ({ 
  height = 400, 
  message = '暂无数据' 
}) => {
  return (
    <div 
      className="flex items-center justify-center bg-gray-50 rounded-lg"
      style={{ height: `${height}px` }}
    >
      <div className="flex flex-col items-center space-y-3">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
};

// 错误状态组件
export const ChartError: React.FC<{ height?: number; message?: string; onRetry?: () => void }> = ({ 
  height = 400, 
  message = '图表加载失败',
  onRetry
}) => {
  return (
    <div 
      className="flex items-center justify-center bg-red-50 rounded-lg"
      style={{ height: `${height}px` }}
    >
      <div className="flex flex-col items-center space-y-3">
        <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-sm text-red-600">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            重新加载
          </button>
        )}
      </div>
    </div>
  );
};

// 工具函数：创建渐变色
export const createGradient = (
  ctx: CanvasRenderingContext2D,
  colors: string[],
  direction: 'vertical' | 'horizontal' = 'vertical'
) => {
  const gradient = direction === 'vertical' 
    ? ctx.createLinearGradient(0, 0, 0, 400)
    : ctx.createLinearGradient(0, 0, 400, 0);
  
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  
  return gradient;
};

// 工具函数：格式化数值
export const formatNumber = (value: number, type: 'integer' | 'decimal' | 'percentage' | 'time' = 'integer') => {
  switch (type) {
    case 'decimal':
      return value.toFixed(2);
    case 'percentage':
      return `${(value * 100).toFixed(1)}%`;
    case 'time':
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    default:
      return value.toString();
  }
};

// 工具函数：生成图表数据集样式
export const createDatasetStyle = (color: string, type: 'line' | 'bar' | 'area' = 'line') => {
  const baseStyle = {
    borderColor: color,
    backgroundColor: color,
    borderWidth: 2,
    tension: 0.4
  };

  switch (type) {
    case 'line':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    case 'area':
      return {
        ...baseStyle,
        backgroundColor: `${color}20`,
        fill: true
      };
    case 'bar':
      return {
        ...baseStyle,
        backgroundColor: `${color}80`,
        borderRadius: 4,
        borderSkipped: false
      };
    default:
      return baseStyle;
  }
};
