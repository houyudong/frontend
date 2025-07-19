import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ExperimentNavigationProps {
  experimentName?: string;
}

// 获取实验显示名称
const getExperimentDisplayName = (experimentName: string): string => {
  const nameMap: Record<string, string> = {
    'led': 'LED基础控制',
    'ledblink': 'LED闪烁控制',
    'ledbanner': 'LED跑马灯',
    'ledbreath': 'LED呼吸灯',
    'keyscan': '按键扫描',
    'keyint': '按键中断',
    'timbase': '定时器基础',
    'timpwm': '定时器PWM',
    'uart': '串口通信',
    'uart_transrecvint': '串口中断收发',
    'adc': '模数转换',
    'adcmq2': 'ADC气体传感器',
    'dacvoltageout': 'DAC电压输出',
    'dacwave': 'DAC波形生成',
    'lcd': 'LCD显示',
    'smartecowatch': '智能环境监测系统',
    'autopark': '智能自动泊车系统',
    'fitband': '智能健身手环',
    'optitracer': '光学追踪器'
  };
  
  return nameMap[experimentName] || experimentName;
};

const ExperimentNavigation: React.FC<ExperimentNavigationProps> = ({ experimentName }) => {
  const location = useLocation();

  const navigationItems = [
    { path: '/student/experiments', label: '实验中心', icon: '🧪' },
    { path: '/student/courses', label: '课程学习', icon: '📚' },
    { path: '/student/dashboard', label: '学习仪表板', icon: '📊' },
  ];

  const isActive = (path: string) => {
    if (path === '/student/experiments') {
      return location.pathname === '/student/experiments' || location.pathname.startsWith('/student/experiments/');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 面包屑导航 */}
          <div className="flex items-center space-x-2 text-sm">
            <Link 
              to="/student/experiments" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              实验中心
            </Link>
            {experimentName && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">
                  {getExperimentDisplayName(experimentName)}
                </span>
              </>
            )}
          </div>

          {/* 快速导航 */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentNavigation;
