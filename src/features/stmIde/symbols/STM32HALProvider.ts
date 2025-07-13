/**
 * STM32 HAL 库符号提供者
 * 专门处理 STM32 HAL 库的符号和签名
 */

import { CompletionItem, SignatureInfo } from './types'
import { SymbolFactory } from './SymbolFactory'

export class STM32HALProvider {
  private static instance: STM32HALProvider
  private symbols: Map<string, CompletionItem[]> = new Map()
  private signatures: Map<string, SignatureInfo[]> = new Map()

  private constructor() {
    this.initializeSymbols()
  }

  static getInstance(): STM32HALProvider {
    if (!STM32HALProvider.instance) {
      STM32HALProvider.instance = new STM32HALProvider()
    }
    return STM32HALProvider.instance
  }

  /**
   * 初始化所有 STM32 HAL 符号
   */
  private initializeSymbols(): void {
    this.initializeGPIOSymbols()
    this.initializeUARTSymbols()
    this.initializeSystemSymbols()
    this.initializeTimerSymbols()
    this.initializeADCSymbols()
    this.initializeSignatures()
  }

  /**
   * 初始化 GPIO 符号
   */
  private initializeGPIOSymbols(): void {
    const gpioFunctions = [
      { name: 'HAL_GPIO_Init', returnType: 'void', parameters: 'GPIO_TypeDef *GPIOx, GPIO_InitTypeDef *GPIO_Init', documentation: 'Initialize GPIO pins according to specified parameters', library: 'STM32 HAL GPIO' },
      { name: 'HAL_GPIO_DeInit', returnType: 'void', parameters: 'GPIO_TypeDef *GPIOx, uint32_t GPIO_Pin', documentation: 'Deinitialize GPIO pins to their default reset state', library: 'STM32 HAL GPIO' },
      { name: 'HAL_GPIO_ReadPin', returnType: 'GPIO_PinState', parameters: 'GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin', documentation: 'Read the specified input port pin', library: 'STM32 HAL GPIO' },
      { name: 'HAL_GPIO_WritePin', returnType: 'void', parameters: 'GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin, GPIO_PinState PinState', documentation: 'Set or clear the selected data port bit', library: 'STM32 HAL GPIO' },
      { name: 'HAL_GPIO_TogglePin', returnType: 'void', parameters: 'GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin', documentation: 'Toggle the specified GPIO pin', library: 'STM32 HAL GPIO' },
      { name: 'HAL_GPIO_LockPin', returnType: 'HAL_StatusTypeDef', parameters: 'GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin', documentation: 'Lock GPIO pin configuration until next reset', library: 'STM32 HAL GPIO' }
    ]

    const gpioConstants = [
      { name: 'GPIO_PIN_SET', documentation: 'GPIO pin high state (1)' },
      { name: 'GPIO_PIN_RESET', documentation: 'GPIO pin low state (0)' },
      { name: 'GPIO_PIN_0', documentation: 'GPIO pin 0' },
      { name: 'GPIO_PIN_1', documentation: 'GPIO pin 1' },
      { name: 'GPIO_PIN_2', documentation: 'GPIO pin 2' },
      { name: 'GPIO_PIN_3', documentation: 'GPIO pin 3' },
      { name: 'GPIO_PIN_4', documentation: 'GPIO pin 4' },
      { name: 'GPIO_PIN_5', documentation: 'GPIO pin 5' },
      { name: 'GPIO_PIN_All', documentation: 'All GPIO pins' },
      { name: 'GPIO_MODE_INPUT', documentation: 'Input floating mode' },
      { name: 'GPIO_MODE_OUTPUT_PP', documentation: 'Output push-pull mode' },
      { name: 'GPIO_MODE_OUTPUT_OD', documentation: 'Output open-drain mode' },
      { name: 'GPIO_MODE_AF_PP', documentation: 'Alternate function push-pull mode' },
      { name: 'GPIO_MODE_AF_OD', documentation: 'Alternate function open-drain mode' },
      { name: 'GPIO_NOPULL', documentation: 'No pull-up or pull-down activation' },
      { name: 'GPIO_PULLUP', documentation: 'Pull-up activation' },
      { name: 'GPIO_PULLDOWN', documentation: 'Pull-down activation' },
      { name: 'GPIO_SPEED_FREQ_LOW', documentation: 'Low speed (2 MHz)' },
      { name: 'GPIO_SPEED_FREQ_MEDIUM', documentation: 'Medium speed (25 MHz)' },
      { name: 'GPIO_SPEED_FREQ_HIGH', documentation: 'High speed (50 MHz)' },
      { name: 'GPIO_SPEED_FREQ_VERY_HIGH', documentation: 'Very high speed (100 MHz)' }
    ]

    this.symbols.set('gpio_functions', SymbolFactory.createFunctions(gpioFunctions, '🔧 STM32 HAL GPIO'))
    this.symbols.set('gpio_constants', SymbolFactory.createConstants(gpioConstants, '🔧 STM32 GPIO Constant'))
  }

  /**
   * 初始化 UART 符号
   */
  private initializeUARTSymbols(): void {
    const uartFunctions = [
      { name: 'HAL_UART_Init', returnType: 'HAL_StatusTypeDef', parameters: 'UART_HandleTypeDef *huart', documentation: 'Initialize UART according to specified parameters', library: 'STM32 HAL UART' },
      { name: 'HAL_UART_DeInit', returnType: 'HAL_StatusTypeDef', parameters: 'UART_HandleTypeDef *huart', documentation: 'Deinitialize UART peripheral', library: 'STM32 HAL UART' },
      { name: 'HAL_UART_Transmit', returnType: 'HAL_StatusTypeDef', parameters: 'UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout', documentation: 'Send an amount of data in blocking mode', library: 'STM32 HAL UART' },
      { name: 'HAL_UART_Receive', returnType: 'HAL_StatusTypeDef', parameters: 'UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout', documentation: 'Receive an amount of data in blocking mode', library: 'STM32 HAL UART' },
      { name: 'HAL_UART_Transmit_IT', returnType: 'HAL_StatusTypeDef', parameters: 'UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size', documentation: 'Send an amount of data in interrupt mode', library: 'STM32 HAL UART' },
      { name: 'HAL_UART_Receive_IT', returnType: 'HAL_StatusTypeDef', parameters: 'UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size', documentation: 'Receive an amount of data in interrupt mode', library: 'STM32 HAL UART' },
      { name: 'HAL_UART_Transmit_DMA', returnType: 'HAL_StatusTypeDef', parameters: 'UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size', documentation: 'Send an amount of data in DMA mode', library: 'STM32 HAL UART' },
      { name: 'HAL_UART_Receive_DMA', returnType: 'HAL_StatusTypeDef', parameters: 'UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size', documentation: 'Receive an amount of data in DMA mode', library: 'STM32 HAL UART' }
    ]

    const uartConstants = [
      { name: 'UART_WORDLENGTH_8B', documentation: '8-bit word length' },
      { name: 'UART_WORDLENGTH_9B', documentation: '9-bit word length' },
      { name: 'UART_STOPBITS_1', documentation: '1 stop bit' },
      { name: 'UART_STOPBITS_2', documentation: '2 stop bits' },
      { name: 'UART_PARITY_NONE', documentation: 'No parity' },
      { name: 'UART_PARITY_EVEN', documentation: 'Even parity' },
      { name: 'UART_PARITY_ODD', documentation: 'Odd parity' },
      { name: 'UART_MODE_TX', documentation: 'Transmit mode only' },
      { name: 'UART_MODE_RX', documentation: 'Receive mode only' },
      { name: 'UART_MODE_TX_RX', documentation: 'Transmit and receive mode' },
      { name: 'UART_HWCONTROL_NONE', documentation: 'No hardware flow control' },
      { name: 'UART_HWCONTROL_RTS', documentation: 'RTS flow control' },
      { name: 'UART_HWCONTROL_CTS', documentation: 'CTS flow control' },
      { name: 'UART_HWCONTROL_RTS_CTS', documentation: 'RTS and CTS flow control' }
    ]

    this.symbols.set('uart_functions', SymbolFactory.createFunctions(uartFunctions, '🔧 STM32 HAL UART'))
    this.symbols.set('uart_constants', SymbolFactory.createConstants(uartConstants, '🔧 STM32 UART Constant'))
  }

  /**
   * 🔧 增强：详细的系统符号描述
   */
  private initializeSystemSymbols(): void {
    const systemFunctions = [
      {
        name: 'HAL_Init',
        returnType: 'HAL_StatusTypeDef',
        parameters: 'void',
        documentation: '初始化HAL库 - 配置Flash预取、指令缓存、数据缓存、设置SysTick中断优先级\n返回: HAL_OK(成功) 或 HAL_ERROR(失败)\n注意: 必须在所有HAL函数调用前执行',
        library: 'STM32 HAL System'
      },
      {
        name: 'HAL_DeInit',
        returnType: 'HAL_StatusTypeDef',
        parameters: 'void',
        documentation: '反初始化HAL库 - 恢复所有外设到复位状态\n返回: HAL_OK(成功) 或 HAL_ERROR(失败)\n用途: 系统重启前的清理工作',
        library: 'STM32 HAL System'
      },
      {
        name: 'HAL_Delay',
        returnType: 'void',
        parameters: 'uint32_t Delay',
        documentation: '精确毫秒延时 - 基于SysTick定时器实现\n参数: Delay - 延时时间(毫秒)\n示例: HAL_Delay(1000); // 延时1秒\n注意: 会阻塞CPU，不适用于中断中调用',
        library: 'STM32 HAL System'
      },
      {
        name: 'HAL_GetTick',
        returnType: 'uint32_t',
        parameters: 'void',
        documentation: '获取系统滴答计数 - 自系统启动后的毫秒数\n返回: 当前滴答值(毫秒)\n用途: 时间测量、超时检测\n注意: 约49.7天后会溢出重新计数',
        library: 'STM32 HAL System'
      },
      {
        name: 'HAL_IncTick',
        returnType: 'void',
        parameters: 'void',
        documentation: '系统滴答计数器递增 - 通常在SysTick中断中调用\n用途: 维护系统时间基准\n注意: 用户代码一般不需要直接调用',
        library: 'STM32 HAL System'
      },
      {
        name: 'HAL_NVIC_SetPriority',
        returnType: 'void',
        parameters: 'IRQn_Type IRQn, uint32_t PreemptPriority, uint32_t SubPriority',
        documentation: '设置中断优先级\n参数:\n- IRQn: 中断号\n- PreemptPriority: 抢占优先级(0-15,数值越小优先级越高)\n- SubPriority: 子优先级(0-15)\n示例: HAL_NVIC_SetPriority(USART1_IRQn, 0, 0);',
        library: 'STM32 HAL NVIC'
      },
      {
        name: 'HAL_NVIC_EnableIRQ',
        returnType: 'void',
        parameters: 'IRQn_Type IRQn',
        documentation: '使能中断\n参数: IRQn - 中断号\n示例: HAL_NVIC_EnableIRQ(USART1_IRQn);\n注意: 使能前应先设置优先级',
        library: 'STM32 HAL NVIC'
      },
      {
        name: 'HAL_NVIC_DisableIRQ',
        returnType: 'void',
        parameters: 'IRQn_Type IRQn',
        documentation: '禁用中断\n参数: IRQn - 中断号\n示例: HAL_NVIC_DisableIRQ(USART1_IRQn);\n用途: 临时关闭中断或系统清理',
        library: 'STM32 HAL NVIC'
      }
    ]

    const systemConstants = [
      { name: 'HAL_OK', documentation: 'HAL operation successful' },
      { name: 'HAL_ERROR', documentation: 'HAL operation error' },
      { name: 'HAL_BUSY', documentation: 'HAL operation busy' },
      { name: 'HAL_TIMEOUT', documentation: 'HAL operation timeout' },
      { name: 'HAL_MAX_DELAY', documentation: 'Maximum delay value (0xFFFFFFFF)' }
    ]

    this.symbols.set('system_functions', SymbolFactory.createFunctions(systemFunctions, '🔧 STM32 HAL System'))
    this.symbols.set('system_constants', SymbolFactory.createConstants(systemConstants, '🔧 STM32 System Constant'))
  }

  /**
   * 初始化定时器符号
   */
  private initializeTimerSymbols(): void {
    const timerFunctions = [
      { name: 'HAL_TIM_Init', returnType: 'HAL_StatusTypeDef', parameters: 'TIM_HandleTypeDef *htim', documentation: 'Initialize Timer', library: 'STM32 HAL TIM' },
      { name: 'HAL_TIM_Base_Start', returnType: 'HAL_StatusTypeDef', parameters: 'TIM_HandleTypeDef *htim', documentation: 'Start Timer base', library: 'STM32 HAL TIM' },
      { name: 'HAL_TIM_Base_Stop', returnType: 'HAL_StatusTypeDef', parameters: 'TIM_HandleTypeDef *htim', documentation: 'Stop Timer base', library: 'STM32 HAL TIM' },
      { name: 'HAL_TIM_PWM_Start', returnType: 'HAL_StatusTypeDef', parameters: 'TIM_HandleTypeDef *htim, uint32_t Channel', documentation: 'Start PWM generation', library: 'STM32 HAL TIM' },
      { name: 'HAL_TIM_PWM_Stop', returnType: 'HAL_StatusTypeDef', parameters: 'TIM_HandleTypeDef *htim, uint32_t Channel', documentation: 'Stop PWM generation', library: 'STM32 HAL TIM' }
    ]

    const timerConstants = [
      { name: 'TIM_CHANNEL_1', documentation: 'Timer channel 1' },
      { name: 'TIM_CHANNEL_2', documentation: 'Timer channel 2' },
      { name: 'TIM_CHANNEL_3', documentation: 'Timer channel 3' },
      { name: 'TIM_CHANNEL_4', documentation: 'Timer channel 4' }
    ]

    this.symbols.set('timer_functions', SymbolFactory.createFunctions(timerFunctions, '🔧 STM32 HAL TIM'))
    this.symbols.set('timer_constants', SymbolFactory.createConstants(timerConstants, '🔧 STM32 Timer Constant'))
  }

  /**
   * 初始化 ADC 符号
   */
  private initializeADCSymbols(): void {
    const adcFunctions = [
      { name: 'HAL_ADC_Init', returnType: 'HAL_StatusTypeDef', parameters: 'ADC_HandleTypeDef *hadc', documentation: 'Initialize ADC', library: 'STM32 HAL ADC' },
      { name: 'HAL_ADC_Start', returnType: 'HAL_StatusTypeDef', parameters: 'ADC_HandleTypeDef *hadc', documentation: 'Start ADC conversion', library: 'STM32 HAL ADC' },
      { name: 'HAL_ADC_Stop', returnType: 'HAL_StatusTypeDef', parameters: 'ADC_HandleTypeDef *hadc', documentation: 'Stop ADC conversion', library: 'STM32 HAL ADC' },
      { name: 'HAL_ADC_PollForConversion', returnType: 'HAL_StatusTypeDef', parameters: 'ADC_HandleTypeDef *hadc, uint32_t Timeout', documentation: 'Poll for ADC conversion completion', library: 'STM32 HAL ADC' },
      { name: 'HAL_ADC_GetValue', returnType: 'uint32_t', parameters: 'ADC_HandleTypeDef *hadc', documentation: 'Get ADC conversion value', library: 'STM32 HAL ADC' }
    ]

    this.symbols.set('adc_functions', SymbolFactory.createFunctions(adcFunctions, '🔧 STM32 HAL ADC'))
  }

  /**
   * 初始化函数签名
   */
  private initializeSignatures(): void {
    const signatures = new Map<string, SignatureInfo[]>()

    // HAL_GPIO_WritePin 签名
    signatures.set('HAL_GPIO_WritePin', [
      SymbolFactory.createSignature({
        label: 'HAL_GPIO_WritePin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin, GPIO_PinState PinState)',
        documentation: 'Set or clear the selected data port bit\n\nExample:\nHAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);',
        parameters: [
          { name: 'GPIOx', documentation: 'GPIO port: GPIOA, GPIOB, GPIOC, GPIOD, GPIOE, GPIOF, GPIOG, GPIOH' },
          { name: 'GPIO_Pin', documentation: 'Pin number: GPIO_PIN_0 to GPIO_PIN_15, or GPIO_PIN_All' },
          { name: 'PinState', documentation: 'Pin state: GPIO_PIN_SET (high) or GPIO_PIN_RESET (low)' }
        ]
      })
    ])

    // HAL_UART_Transmit 签名
    signatures.set('HAL_UART_Transmit', [
      SymbolFactory.createSignature({
        label: 'HAL_UART_Transmit(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout)',
        documentation: 'Send an amount of data in blocking mode\n\nReturns: HAL_OK, HAL_ERROR, HAL_BUSY, or HAL_TIMEOUT',
        parameters: [
          { name: 'huart', documentation: 'Pointer to UART handle structure (e.g., &huart1, &huart2)' },
          { name: 'pData', documentation: 'Pointer to data buffer (uint8_t array or string)' },
          { name: 'Size', documentation: 'Amount of data to be sent (number of bytes)' },
          { name: 'Timeout', documentation: 'Timeout duration in milliseconds (e.g., 1000, HAL_MAX_DELAY)' }
        ]
      })
    ])

    // HAL_Delay 签名
    signatures.set('HAL_Delay', [
      SymbolFactory.createSignature({
        label: 'HAL_Delay(uint32_t Delay)',
        documentation: 'Provide accurate delay (in milliseconds) based on variable incremented in SysTick ISR',
        parameters: [
          { name: 'Delay', documentation: 'Delay duration in milliseconds (e.g., 1000 for 1 second)' }
        ]
      })
    ])

    this.signatures = signatures
  }

  /**
   * 获取所有 STM32 HAL 符号
   */
  getAllSymbols(): CompletionItem[] {
    const allSymbols: CompletionItem[] = []
    for (const symbols of this.symbols.values()) {
      allSymbols.push(...symbols)
    }
    return allSymbols
  }

  /**
   * 获取所有签名
   */
  getAllSignatures(): Map<string, SignatureInfo[]> {
    return this.signatures
  }

  /**
   * 根据分类获取符号
   */
  getSymbolsByCategory(category: string): CompletionItem[] {
    return this.symbols.get(category) || []
  }
}
