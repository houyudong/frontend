interface ChipInfo {
  name: string;
  family: string;
  series: string;
  flashSize: number;
  ramSize: number;
  core: string;
  frequency: number;
}

/**
 * 获取芯片信息
 * @param {string} chipName - 芯片名称
 * @returns {ChipInfo | null} 芯片信息
 */
export const getChipInfo = (chipName: string): ChipInfo | null => {
  const chipMap: Record<string, ChipInfo> = {
    'STM32F103C8T6': {
      name: 'STM32F103C8T6',
      family: 'STM32F1',
      series: 'STM32F103',
      flashSize: 64 * 1024,
      ramSize: 20 * 1024,
      core: 'Cortex-M3',
      frequency: 72
    },
    'STM32F103RCT6': {
      name: 'STM32F103RCT6',
      family: 'STM32F1',
      series: 'STM32F103',
      flashSize: 256 * 1024,
      ramSize: 48 * 1024,
      core: 'Cortex-M3',
      frequency: 72
    }
  };

  return chipMap[chipName] || null;
};

/**
 * 获取芯片系列
 * @param {string} chipName - 芯片名称
 * @returns {string} 芯片系列
 */
export const getChipFamily = (chipName: string): string => {
  const info = getChipInfo(chipName);
  return info?.family || 'Unknown';
}; 