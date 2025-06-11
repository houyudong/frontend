import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  FaRegLightbulb, 
  FaRegKeyboard, 
  FaMicrochip, 
  FaThermometerHalf, 
  FaVolumeUp, 
  FaWifi, 
  FaRegClock,
  FaRegEye, 
  FaRegChartBar,
  FaPowerOff,
  FaRegQuestionCircle,
  FaBrain
} from 'react-icons/fa';
import { BsFillLightningFill, BsArrowsMove } from 'react-icons/bs';
import { MdOutlineDevices, MdMemory } from 'react-icons/md';
import { SiGooglecalendar } from 'react-icons/si';
import './ExperimentTypeIcon.css';

/**
 * 为所有可能的图标类型预先创建一个映射表，避免重复计算
 */
const ICON_MAP = {
  'gpio': FaRegLightbulb,
  'button': FaRegKeyboard,
  'input': FaRegKeyboard,
  'serial': FaMicrochip,
  'uart': FaMicrochip,
  'sensor': FaThermometerHalf,
  'audio': FaVolumeUp,
  'wireless': FaWifi,
  'wifi': FaWifi,
  'timer': FaRegClock,
  'lcd': FaRegEye,
  'display': FaRegEye,
  'adc': FaRegChartBar,
  'analog': FaRegChartBar,
  'pwm': BsFillLightningFill,
  'motor': BsArrowsMove,
  'actuator': BsArrowsMove,
  'power': FaPowerOff,
  'rtc': SiGooglecalendar,
  'clock': SiGooglecalendar,
  'i2c': MdOutlineDevices,
  'spi': MdOutlineDevices,
  'communication': MdOutlineDevices,
  'memory': MdMemory,
  'dma': MdMemory,
  'advanced': FaBrain,
  'application': FaBrain,
  'default': FaRegQuestionCircle,
  // 添加中文名称映射
  'gpio实验': FaRegLightbulb,
  '串口实验': FaMicrochip,
  '定时中断': FaRegClock,
  'adc实验': FaRegChartBar,
  'dac实验': FaVolumeUp,
  'dma实验': MdMemory,
  '综合应用场景': FaBrain
};

/**
 * 根据类型获取适当的图标组件
 * @param {string} type - 实验类型
 * @returns {React.ComponentType} 图标组件
 */
const getIconForType = (type) => {
  if (!type) return ICON_MAP.default;
  
  const normalizedType = type.toLowerCase().trim();
  return ICON_MAP[normalizedType] || ICON_MAP.default;
};

/**
 * 实验类型图标组件 - 根据实验类型显示不同的图标
 * @param {string} type - 实验类型
 * @param {string} color - 图标颜色
 * @param {string} size - 图标大小
 * @param {string} className - 可选的CSS类名
 * @returns {JSX.Element} - 适当的图标组件
 */
const ExperimentTypeIcon = ({ type, color = 'currentColor', size = '1.1em', className = '' }) => {
  // 规范化类型，避免大小写和额外空格引起的闪烁
  const normalizedType = (type || '').toLowerCase().trim();
  
  // 使用useMemo获取图标组件，避免不必要的状态更新
  const Icon = useMemo(() => {
    return getIconForType(normalizedType);
  }, [normalizedType]);
  
  // 标准化图标属性，确保所有图标有相同的基本属性
  const iconProps = { 
    color, 
    size, 
    className: `experiment-type-icon ${className || ''}`.trim(),
    style: { 
      display: 'inline-block', 
      verticalAlign: 'middle', 
      flexShrink: 0,
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      willChange: 'transform', // 告诉浏览器这个元素会变化，提高渲染性能
      transform: 'translateZ(0)' // 强制GPU渲染
    },
    'data-type': normalizedType, // 添加data-type属性用于CSS选择器
    'aria-hidden': 'true'
  };

  // 返回固定尺寸的图标以避免闪烁
  return <Icon {...iconProps} />;
};

ExperimentTypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string
};

// 使用memo包装组件以避免不必要的重新渲染
export default memo(ExperimentTypeIcon); 