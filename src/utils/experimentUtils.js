/**
 * 实验类型与颜色的映射
 */
export const experimentTypeColors = {
  gpio: 'primary',
  uart: 'success',
  i2c: 'warning',
  spi: 'danger',
  adc: 'info',
  dac: 'secondary',
  timer: 'dark',
  pwm: 'primary',
  dma: 'success',
  interrupt: 'warning',
  basic: 'info',
  advanced: 'danger',
  default: 'secondary'
};

/**
 * 实验难度与颜色的映射
 */
export const difficultyColors = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
  expert: 'dark',
  default: 'secondary'
};

/**
 * 根据实验类型获取徽章颜色
 * @param {string} type - 实验类型
 * @returns {string} 对应的Bootstrap颜色类名
 */
export const getTypeColor = (type) => {
  return experimentTypeColors[type?.toLowerCase()] || experimentTypeColors.default;
};

/**
 * 根据难度级别获取徽章颜色
 * @param {string} difficulty - 难度级别
 * @returns {string} 对应的Bootstrap颜色类名
 */
export const getDifficultyColor = (difficulty) => {
  return difficultyColors[difficulty?.toLowerCase()] || difficultyColors.default;
};

/**
 * 根据实验时长估计返回格式化的字符串
 * @param {number} minutes - 估计时长（分钟）
 * @returns {string} 格式化后的时长字符串
 */
export const formatTimeEstimate = (minutes) => {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} 小时`;
  }
  
  return `${hours} 小时 ${remainingMinutes} 分钟`;
};

/**
 * 获取实验类型的中文名称
 * @param {string} type - 实验类型
 * @returns {string} 中文名称
 */
export const getTypeDisplayName = (type) => {
  const typeMap = {
    gpio: 'GPIO',
    uart: '串口通信',
    i2c: 'I2C总线',
    spi: 'SPI总线',
    adc: 'ADC转换',
    dac: 'DAC转换',
    timer: '定时器',
    pwm: 'PWM调制',
    dma: 'DMA传输',
    interrupt: '中断处理',
    basic: '基础实验',
    advanced: '高级实验'
  };
  
  return typeMap[type?.toLowerCase()] || type;
};

/**
 * 获取难度级别的中文名称
 * @param {string} difficulty - 难度级别
 * @returns {string} 中文名称
 */
export const getDifficultyDisplayName = (difficulty) => {
  const difficultyMap = {
    beginner: '入门',
    intermediate: '中级',
    advanced: '高级',
    expert: '专家'
  };
  
  return difficultyMap[difficulty?.toLowerCase()] || difficulty;
}; 