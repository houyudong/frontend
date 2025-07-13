/**
 * 支持的文件类型映射
 */
export const languageMap: Record<string, string> = {
  '.c': 'c',
  '.h': 'c',
  '.cpp': 'cpp',
  '.hpp': 'cpp',
  '.java': 'java',
  '.py': 'python',
  '.js': 'javascript',
  '.html': 'html',
  '.css': 'css',
  '.json': 'json',
  '.txt': 'plaintext',
  '.md': 'markdown',
};

/**
 * 获取文件扩展名的语言类型
 * @param filename - 文件名
 * @returns 对应的语言类型
 */
export const getLanguageByExtension = (filename: string): string => {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return languageMap[ext] || 'plaintext';
};

/**
 * MCU型号列表
 */
export const MCU_MODELS: string[] = [
  'STM32F103C8T6',  // Blue Pill board - most common
  'STM32F103RBT6',
  'STM32F103RCT6',
  'STM32F103VET6',
  'STM32F103ZET6',
  'STM32F407VET6',
  'STM32F407ZGT6',
  'STM32H743ZIT6',
];

/**
 * 输出面板标签页
 */
export const TABS: Record<string, string> = {
  ERROR_OUTPUT: '错误信息',
  CONSOLE_OUTPUT: '控制台'
};

/**
 * 默认代码模板
 */
export const DEFAULT_CODE: string = `
#include "stm32f10x.h"
#include "delay.h"

// LED初始化函数
void LED_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStructure;

    // 使能GPIOB时钟
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);

    // 配置PB5为推挽输出
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOB, &GPIO_InitStructure);

    // 关闭LED
    GPIO_SetBits(GPIOB, GPIO_Pin_5);
}

int main(void)
{
    // 系统初始化
    SystemInit();

    // 初始化延时函数
    delay_init();

    // 初始化LED
    LED_Init();

    while(1)
    {
        GPIO_ResetBits(GPIOB, GPIO_Pin_5);  // LED亮
        delay_ms(500);                      // 延时500ms
        GPIO_SetBits(GPIOB, GPIO_Pin_5);    // LED灭
        delay_ms(500);                      // 延时500ms
    }
}
`;

/**
 * API 基础URL
 */
export const API_BASE_URL: string = '/api';

/**
 * 更新 STM 服务 URL 地址
 */
export const STM_SERVICE_URL: string = '';

export const STLINK_API = {
  CONNECT: '/api/stlink/connect',
  DISCONNECT: '/api/stlink/disconnect',
  STATUS: '/api/stlink/status',
  FLASH: '/api/stlink/flash',
  VERIFY: '/api/stlink/verify',
  ERASE: '/api/stlink/erase',
  RESET: '/api/stlink/reset'
};

export const PROJECT_API = {
  LIST: '/api/projects',
  CREATE: '/api/projects',
  GET: '/api/projects',
  UPDATE: '/api/projects',
  DELETE: '/api/projects',
  GET_FILE_CONTENT: '/api/projects/file'
};

export const COMPILER_API = {
  COMPILE: '/api/compiler/compile',
  SETTINGS: '/api/compiler/settings'
};

export const WORKSPACE_API = {
  CREATE: '/api/workspaces',
  LIST: '/api/workspaces',
  GET: '/api/workspaces',
  UPDATE: '/api/workspaces',
  DELETE: '/api/workspaces'
};

export const FILE_API = {
  CREATE: '/api/files',
  LIST: '/api/files',
  GET_CONTENT: '/api/files/content',
  UPDATE: '/api/files',
  DELETE: '/api/files'
}; 