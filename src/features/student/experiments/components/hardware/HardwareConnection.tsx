/**
 * 硬件连接组件
 * 
 * 重构版本，使用配置数据而非硬编码
 * 遵循DRY原则
 */

import React, { useState } from 'react';

interface HardwareConnectionProps {
  experimentName: string;
}

interface ConnectionInfo {
  title: string;
  connections: Array<{
    pin: string;
    device: string;
    description: string;
  }>;
  components: Array<{
    name: string;
    quantity: string;
  }>;
  notes: string[];
}

// 简化的硬件连接信息生成
const getHardwareConnectionInfo = (experimentName: string): ConnectionInfo => {
  const name = experimentName?.toLowerCase() || '';
  
  // GPIO类实验的通用连接信息
  if (name.includes('led')) {
    return {
      title: "LED控制电路连接",
      connections: [
        { pin: "PC13", device: "LED", description: "LED正极连接（板载LED）" },
        { pin: "GND", device: "限流电阻", description: "LED负极通过限流电阻接地" }
      ],
      components: [
        { name: "STM32F103开发板", quantity: "× 1" },
        { name: "LED灯", quantity: "× 1（可使用板载LED）" },
        { name: "限流电阻", quantity: "220Ω × 1（板载已有）" }
      ],
      notes: [
        "可以使用板载LED进行实验",
        "如需外接LED，注意正负极性",
        "确保限流电阻值合适（220Ω-1kΩ）"
      ]
    };
  }
  
  // 按键类实验
  if (name.includes('按键') || name.includes('key')) {
    return {
      title: "按键输入电路连接",
      connections: [
        { pin: "PA0", device: "按键", description: "按键一端连接GPIO" },
        { pin: "GND", device: "按键", description: "按键另一端接地" }
      ],
      components: [
        { name: "STM32F103开发板", quantity: "× 1" },
        { name: "轻触按键", quantity: "× 1" },
        { name: "上拉电阻", quantity: "10kΩ × 1（可选，GPIO内部上拉）" }
      ],
      notes: [
        "可以使用板载按键进行实验",
        "GPIO配置为输入模式，启用内部上拉",
        "按键按下时GPIO读取到低电平"
      ]
    };
  }
  
  // 串口类实验
  if (name.includes('uart') || name.includes('串口')) {
    return {
      title: "串口通信连接",
      connections: [
        { pin: "PA9", device: "USB转串口模块", description: "UART1_TX连接" },
        { pin: "PA10", device: "USB转串口模块", description: "UART1_RX连接" },
        { pin: "GND", device: "USB转串口模块", description: "共地连接" }
      ],
      components: [
        { name: "STM32F103开发板", quantity: "× 1" },
        { name: "USB转串口模块", quantity: "× 1" },
        { name: "杜邦线", quantity: "× 3" }
      ],
      notes: [
        "确保波特率设置一致（通常115200）",
        "TX连RX，RX连TX（交叉连接）",
        "使用串口调试助手查看数据"
      ]
    };
  }
  
  // 默认连接信息
  return {
    title: "硬件连接",
    connections: [
      { pin: "VCC", device: "开发板", description: "电源连接" },
      { pin: "GND", device: "开发板", description: "接地连接" }
    ],
    components: [
      { name: "STM32F103开发板", quantity: "× 1" },
      { name: "USB数据线", quantity: "× 1" }
    ],
    notes: [
      "确保开发板正常供电",
      "检查USB连接是否稳定"
    ]
  };
};

const HardwareConnection: React.FC<HardwareConnectionProps> = ({ experimentName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const connectionInfo = getHardwareConnectionInfo(experimentName);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 标题栏 */}
      <div 
        className="px-6 py-4 bg-gray-50 border-b border-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{connectionInfo.title}</h3>
              <p className="text-sm text-gray-600">硬件连接和元器件清单</p>
            </div>
          </div>
          
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* 内容区域 */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* 连接表 */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">引脚连接</h4>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STM32引脚
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      连接设备
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {connectionInfo.connections.map((connection, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {connection.pin}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {connection.device}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {connection.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 元器件清单 */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">所需元器件</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {connectionInfo.components.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{component.name}</span>
                  <span className="text-sm text-gray-600">{component.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 注意事项 */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">注意事项</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul className="space-y-2">
                {connectionInfo.notes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="flex-shrink-0 w-4 h-4 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-yellow-800">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwareConnection;
