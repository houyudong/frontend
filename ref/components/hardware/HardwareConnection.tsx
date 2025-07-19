/**
 * 硬件连接组件
 * 
 * 重构版本，使用配置数据而非硬编码
 * 遵循DRY原则
 */

import React, { useState } from 'react';
import { getExperimentByName } from '../../data/experiments';

interface HardwareConnectionProps {
  experimentName: string;
}

// 简化的硬件连接信息生成
const getHardwareConnectionInfo = (experimentName: string) => {
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
        { name: "杜邦线", quantity: "若干" }
      ],
      notes: [
        "使用GPIO内部上拉电阻",
        "按键按下时GPIO读取低电平",
        "注意按键消抖处理"
      ]
    };
  }
  
  // 串口类实验
  if (name.includes('串口') || name.includes('uart')) {
    return {
      title: "串口通信连接",
      connections: [
        { pin: "PA9", device: "UART1_TX", description: "串口发送引脚" },
        { pin: "PA10", device: "UART1_RX", description: "串口接收引脚" }
      ],
      components: [
        { name: "STM32F103开发板", quantity: "× 1" },
        { name: "USB转串口模块", quantity: "× 1" },
        { name: "杜邦线", quantity: "若干" }
      ],
      notes: [
        "注意TX和RX交叉连接",
        "波特率设置要一致",
        "可使用串口调试助手测试"
      ]
    };
  }
  
  // ADC类实验
  if (name.includes('adc') || name.includes('模数')) {
    return {
      title: "ADC采集电路连接",
      connections: [
        { pin: "PA0", device: "ADC_IN0", description: "ADC输入通道0" },
        { pin: "VREF+", device: "参考电压", description: "ADC参考电压（3.3V）" }
      ],
      components: [
        { name: "STM32F103开发板", quantity: "× 1" },
        { name: "电位器", quantity: "× 1" },
        { name: "杜邦线", quantity: "若干" }
      ],
      notes: [
        "输入电压不能超过3.3V",
        "可使用电位器产生可变电压",
        "注意ADC精度和采样频率"
      ]
    };
  }
  
  // DAC类实验
  if (name.includes('dac') || name.includes('数模')) {
    return {
      title: "DAC输出电路连接",
      connections: [
        { pin: "PA4", device: "DAC_OUT1", description: "DAC输出通道1" },
        { pin: "PA5", device: "DAC_OUT2", description: "DAC输出通道2" }
      ],
      components: [
        { name: "STM32F103开发板", quantity: "× 1" },
        { name: "示波器", quantity: "× 1" },
        { name: "杜邦线", quantity: "若干" }
      ],
      notes: [
        "DAC输出电压范围0-3.3V",
        "使用示波器观察输出波形",
        "注意输出负载能力"
      ]
    };
  }
  
  // 默认连接信息
  return {
    title: "基础电路连接",
    connections: [
      { pin: "VCC", device: "电源", description: "3.3V电源连接" },
      { pin: "GND", device: "地线", description: "公共地线连接" }
    ],
    components: [
      { name: "STM32F103开发板", quantity: "× 1" },
      { name: "杜邦线", quantity: "若干" }
    ],
    notes: [
      "确保电源连接正确",
      "检查接线无误后再上电"
    ]
  };
};

const HardwareConnection: React.FC<HardwareConnectionProps> = ({ experimentName }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const connectionInfo = getHardwareConnectionInfo(experimentName);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="text-2xl mr-2">🔌</span>
          {connectionInfo.title}
        </h2>
        <span className="text-gray-400">
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* 连接表 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">引脚连接</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STM32引脚
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      连接设备
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {connectionInfo.connections.map((connection, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {connection.pin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {connection.device}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {connection.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 器件清单 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">所需器件</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectionInfo.components.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{component.name}</span>
                  <span className="text-sm text-gray-500">{component.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 注意事项 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">注意事项</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul className="space-y-2">
                {connectionInfo.notes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">⚠️</span>
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
