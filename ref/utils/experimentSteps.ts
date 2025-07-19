/**
 * 实验步骤生成工具函数
 * 
 * 从ExperimentDetailPage.tsx中拆分出来，遵循DRY原则
 * 根据实验名称和项目代码生成对应的实验步骤
 */

export interface ExperimentStep {
  title: string;
  description: string;
  code: string;
  note: string;
}

/**
 * 基于真实实验代码的步骤生成函数
 */
export const getExperimentSteps = (experiment: any): ExperimentStep[] => {
  const name = experiment.name?.toLowerCase() || '';
  const projectName = experiment.project_name?.toLowerCase() || '';

  // LED基础控制实验步骤 (03-1)
  if (name.includes('led基础') || projectName.includes('03-1')) {
    return [
      {
        title: "GPIO初始化配置",
        description: "配置LED对应的GPIO端口为输出模式",
        code: `// GPIO初始化配置
GPIO_InitTypeDef GPIO_InitStruct = {0};

// 使能GPIOC时钟
__HAL_RCC_GPIOC_CLK_ENABLE();

// 配置PC13为推挽输出
GPIO_InitStruct.Pin = GPIO_PIN_13;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);`,
        note: "PC13通常连接开发板上的LED"
      },
      {
        title: "LED控制函数",
        description: "编写LED点亮和熄灭的控制函数",
        code: `// LED控制函数
void LED_On(void) {
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
}

void LED_Off(void) {
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);
}

void LED_Toggle(void) {
  HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
}`,
        note: "STM32F103开发板LED通常是低电平点亮"
      },
      {
        title: "主程序实现",
        description: "在主循环中调用LED控制函数",
        code: `// 主程序
int main(void) {
  // 系统初始化
  HAL_Init();
  SystemClock_Config();
  
  // GPIO初始化
  MX_GPIO_Init();
  
  // 主循环
  while (1) {
    LED_On();   // 点亮LED
    HAL_Delay(1000);
    LED_Off();  // 熄灭LED
    HAL_Delay(1000);
  }
}`,
        note: "实现LED每秒闪烁一次的效果"
      }
    ];
  }

  // LED闪烁控制实验步骤 (03-2)
  if (name.includes('led闪烁') || projectName.includes('03-2')) {
    return [
      {
        title: "系统时钟配置",
        description: "配置系统时钟为72MHz",
        code: `// 系统时钟配置
void SystemClock_Config(void) {
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
  RCC_OscInitStruct.HSEState = RCC_HSE_ON;
  RCC_OscInitStruct.HSEPredivValue = RCC_HSE_PREDIV_DIV1;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
  RCC_OscInitStruct.PLL.PLLMUL = RCC_PLL_MUL9;
  HAL_RCC_OscConfig(&RCC_OscInitStruct);
}`,
        note: "8MHz外部晶振 × 9 = 72MHz系统时钟"
      },
      {
        title: "GPIO配置与初始化",
        description: "配置LED GPIO并初始化状态",
        code: `// GPIO配置
void MX_GPIO_Init(void) {
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  __HAL_RCC_GPIOC_CLK_ENABLE();

  // 初始化LED为熄灭状态
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);

  GPIO_InitStruct.Pin = GPIO_PIN_13;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
}`,
        note: "确保LED初始状态为熄灭"
      },
      {
        title: "闪烁控制逻辑",
        description: "实现LED周期性闪烁",
        code: `// 闪烁控制主循环
while (1) {
  // 点亮LED
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
  HAL_Delay(500);  // 延时500ms
  
  // 熄灭LED
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);
  HAL_Delay(500);  // 延时500ms
}`,
        note: "实现1Hz频率的LED闪烁效果"
      }
    ];
  }

  // LED跑马灯实验步骤 (03-3)
  if (name.includes('跑马灯') || projectName.includes('03-3')) {
    return [
      {
        title: "多LED GPIO配置",
        description: "配置多个LED对应的GPIO端口",
        code: `// 多LED GPIO配置
void MX_GPIO_Init(void) {
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  __HAL_RCC_GPIOA_CLK_ENABLE();

  // 配置PA0-PA3为输出模式
  GPIO_InitStruct.Pin = GPIO_PIN_0|GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
  
  // 初始化所有LED为熄灭状态
  HAL_GPIO_WritePin(GPIOA, GPIO_PIN_0|GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3, GPIO_PIN_SET);
}`,
        note: "使用PA0-PA3控制4个LED"
      },
      {
        title: "跑马灯算法实现",
        description: "使用数组和循环实现跑马灯效果",
        code: `// 跑马灯控制函数
void LED_RunningLight(void) {
  uint16_t led_pins[] = {GPIO_PIN_0, GPIO_PIN_1, GPIO_PIN_2, GPIO_PIN_3};
  
  for (int i = 0; i < 4; i++) {
    // 熄灭所有LED
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_0|GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3, GPIO_PIN_SET);
    
    // 点亮当前LED
    HAL_GPIO_WritePin(GPIOA, led_pins[i], GPIO_PIN_RESET);
    
    // 延时
    HAL_Delay(200);
  }
}`,
        note: "依次点亮每个LED，形成流水灯效果"
      },
      {
        title: "主循环调用",
        description: "在主循环中连续执行跑马灯",
        code: `// 主程序
int main(void) {
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  
  while (1) {
    LED_RunningLight();  // 执行跑马灯
  }
}`,
        note: "连续循环执行跑马灯效果"
      }
    ];
  }

  // LED呼吸灯实验步骤 (03-4)
  if (name.includes('呼吸灯') || projectName.includes('03-4')) {
    return [
      {
        title: "定时器PWM配置",
        description: "配置定时器产生PWM信号",
        code: `// 定时器PWM配置
TIM_HandleTypeDef htim3;

void MX_TIM3_Init(void) {
  TIM_OC_InitTypeDef sConfigOC = {0};

  htim3.Instance = TIM3;
  htim3.Init.Prescaler = 71;
  htim3.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim3.Init.Period = 999;
  htim3.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
  HAL_TIM_PWM_Init(&htim3);

  sConfigOC.OCMode = TIM_OCMODE_PWM1;
  sConfigOC.Pulse = 0;
  sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
  HAL_TIM_PWM_ConfigChannel(&htim3, &sConfigOC, TIM_CHANNEL_1);
}`,
        note: "配置TIM3_CH1输出PWM，频率1kHz"
      },
      {
        title: "PWM输出控制",
        description: "启动PWM输出并控制占空比",
        code: `// PWM控制函数
void PWM_SetDutyCycle(uint16_t duty) {
  __HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_1, duty);
}

// 启动PWM输出
void PWM_Start(void) {
  HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_1);
}`,
        note: "duty范围0-999，对应0%-100%占空比"
      },
      {
        title: "呼吸灯效果实现",
        description: "通过改变PWM占空比实现呼吸效果",
        code: `// 呼吸灯主循环
while (1) {
  // 渐亮过程
  for (int i = 0; i <= 999; i += 10) {
    PWM_SetDutyCycle(i);
    HAL_Delay(10);
  }
  
  // 渐暗过程
  for (int i = 999; i >= 0; i -= 10) {
    PWM_SetDutyCycle(i);
    HAL_Delay(10);
  }
}`,
        note: "实现LED亮度的渐变效果"
      }
    ];
  }

  // 默认返回LED基础控制步骤
  return [
    {
      title: "GPIO初始化",
      description: "配置GPIO端口为输出模式",
      code: `GPIO_InitTypeDef GPIO_InitStruct = {0};
__HAL_RCC_GPIOC_CLK_ENABLE();
GPIO_InitStruct.Pin = GPIO_PIN_13;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);`,
      note: "基础GPIO配置"
    },
    {
      title: "LED控制",
      description: "控制LED的点亮和熄灭",
      code: `HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET); // 点亮
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);   // 熄灭`,
      note: "基础LED控制"
    }
  ];
};
