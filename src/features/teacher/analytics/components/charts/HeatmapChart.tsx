/**
 * 热力图组件
 * 
 * 用于展示二维数据的密度分布
 */

import React from 'react';
import { ChartContainer, ChartLoading, ChartEmpty, ChartError } from './ChartBase';

// 热力图数据点
export interface HeatmapDataPoint {
  x: string | number;
  y: string | number;
  value: number;
  label?: string;
}

// 热力图属性
export interface HeatmapChartProps {
  title: string;
  subtitle?: string;
  data: HeatmapDataPoint[];
  height?: number;
  loading?: boolean;
  error?: string;
  className?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colorScheme?: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  showValues?: boolean;
  actions?: React.ReactNode;
  onRetry?: () => void;
  formatTooltip?: (value: number, x: string | number, y: string | number) => string;
  onClick?: (dataPoint: HeatmapDataPoint) => void;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  title,
  subtitle,
  data,
  height = 400,
  loading = false,
  error,
  className = '',
  xAxisLabel,
  yAxisLabel,
  colorScheme = 'blue',
  showValues = false,
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

  // 获取唯一的x和y值
  const xValues = Array.from(new Set(data.map(d => d.x))).sort();
  const yValues = Array.from(new Set(data.map(d => d.y))).sort();

  // 创建数据映射
  const dataMap = new Map();
  data.forEach(d => {
    dataMap.set(`${d.x}-${d.y}`, d);
  });

  // 计算最大值和最小值用于颜色映射
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // 颜色方案
  const colorSchemes = {
    blue: ['#EBF8FF', '#BEE3F8', '#90CDF4', '#63B3ED', '#4299E1', '#3182CE', '#2B77CB', '#2C5282'],
    green: ['#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D'],
    red: ['#FEF2F2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
    purple: ['#FAF5FF', '#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA', '#7C3AED', '#6B21A8'],
    orange: ['#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C']
  };

  const colors = colorSchemes[colorScheme];

  // 获取颜色
  const getColor = (value: number) => {
    if (maxValue === minValue) return colors[0];
    const ratio = (value - minValue) / (maxValue - minValue);
    const colorIndex = Math.floor(ratio * (colors.length - 1));
    return colors[Math.min(colorIndex, colors.length - 1)];
  };

  // 获取文本颜色（根据背景色深浅）
  const getTextColor = (value: number) => {
    if (maxValue === minValue) return '#374151';
    const ratio = (value - minValue) / (maxValue - minValue);
    return ratio > 0.5 ? '#FFFFFF' : '#374151';
  };

  // 计算单元格大小
  const cellWidth = Math.max(60, Math.min(120, (height * 0.8) / Math.max(xValues.length, yValues.length)));
  const cellHeight = cellWidth;

  return (
    <ChartContainer 
      title={title} 
      subtitle={subtitle} 
      height={height} 
      className={className}
      actions={actions}
    >
      <div className="flex flex-col h-full">
        {/* Y轴标签 */}
        {yAxisLabel && (
          <div className="flex items-center justify-center mb-2">
            <span className="text-sm font-medium text-gray-700 transform -rotate-90 whitespace-nowrap">
              {yAxisLabel}
            </span>
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-center overflow-auto">
          <div className="flex flex-col">
            {/* 热力图网格 */}
            <div className="grid gap-1" style={{ 
              gridTemplateColumns: `repeat(${xValues.length}, ${cellWidth}px)`,
              gridTemplateRows: `repeat(${yValues.length}, ${cellHeight}px)`
            }}>
              {yValues.map(y => 
                xValues.map(x => {
                  const key = `${x}-${y}`;
                  const dataPoint = dataMap.get(key);
                  const value = dataPoint?.value || 0;
                  const backgroundColor = getColor(value);
                  const textColor = getTextColor(value);

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md rounded"
                      style={{
                        backgroundColor,
                        color: textColor,
                        width: cellWidth,
                        height: cellHeight
                      }}
                      title={formatTooltip ? formatTooltip(value, x, y) : `${x}, ${y}: ${value}`}
                      onClick={() => dataPoint && onClick?.(dataPoint)}
                    >
                      {showValues && (
                        <span className="text-center leading-tight">
                          {value.toFixed(1)}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* X轴标签 */}
            <div className="grid gap-1 mt-2" style={{ 
              gridTemplateColumns: `repeat(${xValues.length}, ${cellWidth}px)`
            }}>
              {xValues.map(x => (
                <div key={x} className="text-xs text-center text-gray-600 truncate" title={String(x)}>
                  {x}
                </div>
              ))}
            </div>
            
            {/* X轴标题 */}
            {xAxisLabel && (
              <div className="text-center mt-2">
                <span className="text-sm font-medium text-gray-700">{xAxisLabel}</span>
              </div>
            )}
          </div>
          
          {/* Y轴标签 */}
          <div className="flex flex-col gap-1 ml-2" style={{ 
            height: yValues.length * (cellHeight + 4) - 4
          }}>
            {yValues.map(y => (
              <div 
                key={y} 
                className="text-xs text-gray-600 flex items-center justify-start truncate"
                style={{ height: cellHeight }}
                title={String(y)}
              >
                {y}
              </div>
            ))}
          </div>
        </div>
        
        {/* 颜色图例 */}
        <div className="flex items-center justify-center mt-4 space-x-4">
          <span className="text-xs text-gray-500">{minValue.toFixed(1)}</span>
          <div className="flex space-x-1">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">{maxValue.toFixed(1)}</span>
        </div>
      </div>
    </ChartContainer>
  );
};

export default HeatmapChart;
