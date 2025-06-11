// 从MCU型号获取芯片系列
export const getChipFamilyFromModel = (model) => {
  if (model.includes('F103')) return 'STM32F1';
  if (model.includes('F4')) return 'STM32F4';
  if (model.includes('H7')) return 'STM32H7';
  return 'STM32F1'; // 默认为F1系列
};

// 根据MCU型号获取默认Flash大小
export const getDefaultFlashSize = (model) => {
  // 从型号中提取字符
  if (model.includes('ZET6')) return '512KB';
  if (model.includes('RCT6')) return '256KB';
  if (model.includes('C8T6')) return '64KB';
  if (model.includes('VET6')) return '512KB';
  if (model.includes('RBT6')) return '128KB';
  return '128KB'; // 默认值
};

export default { getChipFamilyFromModel, getDefaultFlashSize };
