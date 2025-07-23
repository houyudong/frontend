/**
 * 图表组件库
 * 
 * 提供各种数据可视化图表组件
 */

import React from 'react';

// 线性图表组件
interface LineChartProps {
  data: { label: string; value: number }[];
  title?: string;
  color?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title, 
  color = '#3B82F6', 
  height = 200 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="relative" style={{ height }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* 网格线 */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1="0"
              y1={height * ratio}
              x2="100%"
              y2={height * ratio}
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* 数据线 */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = ((maxValue - point.value) / range) * (height - 20) + 10;
              return `${x}%,${y}`;
            }).join(' ')}
          />
          
          {/* 数据点 */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = ((maxValue - point.value) / range) * (height - 20) + 10;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={y}
                r="4"
                fill={color}
                className="hover:r-6 transition-all duration-200"
              >
                <title>{`${point.label}: ${point.value}`}</title>
              </circle>
            );
          })}
        </svg>
        
        {/* X轴标签 */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((point, index) => (
            <span key={index} className="text-center">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 柱状图组件
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  height = 200 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="flex items-end space-x-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
              style={{
                height: `${(item.value / maxValue) * (height - 40)}px`,
                backgroundColor: item.color || '#3B82F6',
                minHeight: '4px'
              }}
            >
              {/* 悬停显示数值 */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.value}
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2 text-center">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 饼图组件
interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  title, 
  size = 200 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="flex items-center space-x-6">
        <svg width={size} height={size}>
          {data.map((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                className="hover:opacity-80 transition-opacity duration-200"
              >
                <title>{`${item.label}: ${item.value} (${(percentage * 100).toFixed(1)}%)`}</title>
              </path>
            );
          })}
        </svg>
        
        {/* 图例 */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-500">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 环形进度图组件
interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  size?: number;
  centerText?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  title, 
  size = 200,
  centerText 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const innerRadius = radius * 0.6;
  const centerX = size / 2;
  const centerY = size / 2;
  
  let currentAngle = 0;

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width={size} height={size}>
            {data.map((item, index) => {
              const percentage = item.value / total;
              const angle = percentage * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const x3 = centerX + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180);
              const y3 = centerY + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180);
              const x4 = centerX + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180);
              const y4 = centerY + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <title>{`${item.label}: ${item.value} (${(percentage * 100).toFixed(1)}%)`}</title>
                </path>
              );
            })}
          </svg>
          
          {/* 中心文字 */}
          {centerText && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{centerText}</div>
                <div className="text-sm text-gray-500">总计</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 雷达图组件
interface RadarChartProps {
  data: { label: string; value: number }[];
  title?: string;
  size?: number;
  maxValue?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  title, 
  size = 200,
  maxValue = 100 
}) => {
  const radius = size / 2 - 40;
  const centerX = size / 2;
  const centerY = size / 2;
  const angleStep = (2 * Math.PI) / data.length;

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="flex justify-center">
        <svg width={size} height={size}>
          {/* 背景网格 */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((ratio, index) => (
            <polygon
              key={index}
              points={data.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + radius * ratio * Math.cos(angle);
                const y = centerY + radius * ratio * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* 轴线 */}
          {data.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            );
          })}
          
          {/* 数据区域 */}
          <polygon
            points={data.map((item, index) => {
              const angle = index * angleStep - Math.PI / 2;
              const ratio = item.value / maxValue;
              const x = centerX + radius * ratio * Math.cos(angle);
              const y = centerY + radius * ratio * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          
          {/* 数据点 */}
          {data.map((item, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const ratio = item.value / maxValue;
            const x = centerX + radius * ratio * Math.cos(angle);
            const y = centerY + radius * ratio * Math.sin(angle);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3B82F6"
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </circle>
            );
          })}
          
          {/* 标签 */}
          {data.map((item, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + (radius + 20) * Math.cos(angle);
            const y = centerY + (radius + 20) * Math.sin(angle);
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-600"
              >
                {item.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
