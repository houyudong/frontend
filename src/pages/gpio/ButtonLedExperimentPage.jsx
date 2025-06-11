import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ButtonLedExperimentPage() {
  const [activeTab, setActiveTab] = useState('introduction');

  // 实验数据
  const experiment = {
    id: 'button-led',
    title: '按钮控制LED',
    description: '学习配置基本GPIO输入模式，使用按钮控制LED的点亮和熄灭，掌握输入检测和防抖技术。',
    difficulty: 'beginner',
    thumbnail: '/images/experiments/button-led.jpg',
    introduction: `
      本实验将教你如何使用STM32嵌入式的GPIO输入功能，通过按钮控制LED的亮灭状态。这是嵌入式系统中常见的
      人机交互方式，通过本实验你将掌握GPIO输入的配置方法、按键检测技术以及按键去抖动处理。
    `,
    objectives: [
      '学习配置GPIO为输入模式',
      '理解上拉和下拉电阻的作用及配置',
      '掌握按键状态检测方法',
      '实现按钮控制LED亮灭的功能',
      '学习按键去抖动技术'
    ],
    materials: [
      'STM32嵌入式系列开发板（如STM32F4、STM32G0或STM32L4系列）',
      'LED灯',
      '限流电阻（220欧-1k欧）',
      '按钮开关',
      '连接导线',
      '面包板',
      'USB线（连接开发板与电脑）'
    ],
    theory: `
      <h4>GPIO输入模式</h4>
      <p>
        GPIO输入模式用于读取外部信号的电平状态。在STM32嵌入式中，输入模式有以下特点：
      </p>
      <ul>
        <li>可以读取引脚上的电平状态（高电平或低电平）</li>
        <li>可以配置为浮空、上拉或下拉模式</li>
        <li>支持外部中断功能</li>
      </ul>

      <h4>上拉和下拉电阻</h4>
      <p>
        在输入模式下，通常需要配置上拉或下拉电阻：
      </p>
      <ul>
        <li>上拉电阻：将未连接的引脚拉至高电平，防止悬空</li>
        <li>下拉电阻：将未连接的引脚拉至低电平，防止悬空</li>
      </ul>
      <p>
        对于按钮应用，常见的连接方式有两种：
      </p>
      <ul>
        <li>上拉电阻 + 接地按钮：按钮未按下时引脚为高电平，按下后为低电平</li>
        <li>下拉电阻 + 接电源按钮：按钮未按下时引脚为低电平，按下后为高电平</li>
      </ul>

      <h4>按键抖动问题</h4>
      <p>
        机械按键在按下或释放时，触点会发生多次瞬间通断，产生"抖动"。这会导致单次按键被误判为多次按键。
        常见的消抖方法有：
      </p>
      <ul>
        <li>延时消抖：检测到按键后等待一段时间，确保抖动结束</li>
        <li>多次采样：连续多次采样，确保状态稳定后才判定</li>
        <li>硬件滤波：使用RC电路或施密特触发器</li>
      </ul>
    `,
    steps: [
      {
        title: '硬件连接',
        content: `
          <ol>
            <li>将LED阳极通过限流电阻连接到开发板PE5引脚</li>
            <li>将LED阴极连接到开发板GND引脚</li>
            <li>将按钮一端连接到开发板PD4引脚</li>
            <li>将按钮另一端连接到开发板GND引脚</li>
          </ol>
          <div class="mt-4">
            <img src="/images/experiments/button-led-connection.png" alt="按钮与LED连接图" class="max-w-md mx-auto rounded-lg shadow-md" />
          </div>
          <p class="mt-4">
            注意：我们使用的是接地按钮配合内部上拉电阻，按钮未按下时引脚为高电平，按下后为低电平。
          </p>
        `
      },
      {
        title: '配置LED输出引脚',
        content: `
          首先配置LED连接的GPIO引脚为输出模式：
        `,
        code: `
// 使能GPIOE时钟
RCC->AHB4ENR |= RCC_AHB4ENR_GPIOEEN;

// 配置PE5为推挽输出模式
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_5;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);

// 初始状态，LED熄灭
HAL_GPIO_WritePin(GPIOE, GPIO_PIN_5, GPIO_PIN_RESET);
        `
      },
      {
        title: '配置按钮输入引脚',
        content: `
          配置按钮连接的GPIO引脚为输入模式，并启用内部上拉电阻：
        `,
        code: `
// 使能GPIOD时钟
RCC->AHB4ENR |= RCC_AHB4ENR_GPIODEN;

// 配置PD4为输入模式，使用内部上拉电阻
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_4;
GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
GPIO_InitStruct.Pull = GPIO_PULLUP;
HAL_GPIO_Init(GPIOD, &GPIO_InitStruct);
        `
      },
      {
        title: '读取按钮状态并控制LED',
        content: `
          通过读取按钮引脚状态来控制LED亮灭：
        `,
        code: `
int main(void)
{
  // 系统初始化
  HAL_Init();
  SystemClock_Config();

  // 初始化GPIO - LED
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  __HAL_RCC_GPIOE_CLK_ENABLE();

  GPIO_InitStruct.Pin = GPIO_PIN_5;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);

  // 初始化GPIO - 按钮
  __HAL_RCC_GPIOD_CLK_ENABLE();

  GPIO_InitStruct.Pin = GPIO_PIN_4;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOD, &GPIO_InitStruct);

  while (1)
  {
    // 读取按钮状态（低电平有效）
    GPIO_PinState buttonState = HAL_GPIO_ReadPin(GPIOD, GPIO_PIN_4);

    if (buttonState == GPIO_PIN_RESET) { // 按钮按下
      HAL_GPIO_WritePin(GPIOE, GPIO_PIN_5, GPIO_PIN_SET); // 点亮LED
    } else {
      HAL_GPIO_WritePin(GPIOE, GPIO_PIN_5, GPIO_PIN_RESET); // 熄灭LED
    }

    HAL_Delay(10); // 去抖延时
  }
}
        `
      },
      {
        title: '实现按键去抖动',
        content: `
          加入简单的软件去抖动方法，防止按键抖动导致LED闪烁：
        `,
        code: `
// 按键去抖函数
GPIO_PinState Button_Read_Debounced(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin)
{
  GPIO_PinState state1, state2;

  // 读取两次按键状态，中间延时
  state1 = HAL_GPIO_ReadPin(GPIOx, GPIO_Pin);
  HAL_Delay(20); // 延时20ms
  state2 = HAL_GPIO_ReadPin(GPIOx, GPIO_Pin);

  // 两次状态一致时才认为有效
  if (state1 == state2)
    return state1;
  else
    return GPIO_PIN_SET; // 默认返回未按下状态
}

int main(void)
{
  // 初始化代码同上...

  while (1)
  {
    // 使用去抖函数读取按钮状态
    GPIO_PinState buttonState = Button_Read_Debounced(GPIOD, GPIO_PIN_4);

    if (buttonState == GPIO_PIN_RESET) { // 按钮按下
      HAL_GPIO_WritePin(GPIOE, GPIO_PIN_5, GPIO_PIN_SET); // 点亮LED
    } else {
      HAL_GPIO_WritePin(GPIOE, GPIO_PIN_5, GPIO_PIN_RESET); // 熄灭LED
    }
  }
}
        `
      },
      {
        title: '改进的按钮控制方式',
        content: `
          实现按一下切换LED状态（而不是按住才亮）的功能：
        `,
        code: `
int main(void)
{
  // 初始化代码同上...

  GPIO_PinState lastButtonState = GPIO_PIN_SET; // 记录上一次按钮状态
  uint8_t ledState = 0; // LED状态，0表示熄灭，1表示点亮

  while (1)
  {
    // 读取按钮当前状态（带去抖）
    GPIO_PinState currentButtonState = Button_Read_Debounced(GPIOD, GPIO_PIN_4);

    // 检测按钮是否从未按下变为按下（下降沿）
    if (lastButtonState == GPIO_PIN_SET && currentButtonState == GPIO_PIN_RESET)
    {
      // 翻转LED状态
      ledState = !ledState;

      // 更新LED
      HAL_GPIO_WritePin(GPIOE, GPIO_PIN_5, ledState ? GPIO_PIN_SET : GPIO_PIN_RESET);

      // 等待按钮释放，防止连续触发
      while (Button_Read_Debounced(GPIOD, GPIO_PIN_4) == GPIO_PIN_RESET) {
        HAL_Delay(10);
      }
    }

    // 更新上一次按钮状态
    lastButtonState = currentButtonState;

    HAL_Delay(10); // 短暂延时
  }
}
        `
      }
    ],
    challenges: [
      '实现长按和短按的不同功能（短按切换LED状态，长按使LED闪烁）',
      '同时使用多个按钮控制多个LED',
      '实现按钮控制LED亮度调节（提示：使用PWM）',
      '实现按钮计数器功能，并在LED上用二进制形式显示计数值'
    ],
    resourceLinks: [
      {
        title: 'STM32H7参考手册',
        url: 'https://www.st.com/resource/en/reference_manual/dm00176879-stm32h745755-and-stm32h747757-advanced-armbased-32bit-mcus-stmicroelectronics.pdf',
        type: 'documentation'
      },
      {
        title: 'STM32 GPIO输入模式指南',
        url: 'https://www.st.com/content/ccc/resource/training/technical/product_training/group0/71/7e/90/d8/b6/27/42/39/STM32F0_GPIO_STM32G0_GPIO/files/STM32F0_GPIO_STM32G0_GPIO.pdf/_jcr_content/translations/en.STM32F0_GPIO_STM32G0_GPIO.pdf',
        type: 'tutorial'
      },
      {
        title: '按键消抖技术详解',
        url: 'https://www.embedded.com/electronics-blogs/beginner-s-corner/4023879/How-to-Debounce-a-Switch',
        type: 'tutorial'
      }
    ],
    aiCodingTest: {
      title: '按钮控制LED编程测试',
      description: '使用AI编写一个函数，实现带消抖功能的按钮状态读取，并根据按钮状态控制LED',
      tasks: [
        '创建一个函数，能够读取按钮状态并进行消抖处理',
        '根据按钮状态控制LED的亮灭',
        '实现按钮长按和短按不同功能：短按切换LED状态，长按使LED闪烁',
        '使用HAL库简化GPIO操作'
      ],
      functionTemplate: `
/**
 * @brief  读取按钮状态并控制LED
 * @param  BUTTON_GPIO: 按钮所在的GPIO端口
 * @param  BUTTON_PIN: 按钮连接的GPIO引脚
 * @param  LED_GPIO: LED所在的GPIO端口
 * @param  LED_PIN: LED连接的GPIO引脚
 * @param  activeLevel: 按钮激活电平 (0:低电平有效, 1:高电平有效)
 * @retval 无
 */
void Button_LED_Control(GPIO_TypeDef* BUTTON_GPIO, uint16_t BUTTON_PIN,
                         GPIO_TypeDef* LED_GPIO, uint16_t LED_PIN,
                         uint8_t activeLevel) {
  // 在此编写实现代码
}
      `,
      hints: [
        '使用HAL_GetTick()函数获取系统运行时间，用于判断按钮按下的持续时间',
        '长按时间可以定义为大于1秒',
        '使用状态机思想处理按钮的不同状态：未按下、短按、长按',
        '闪烁效果可以通过间隔翻转LED状态实现'
      ],
      sampleSolution: `
/**
 * @brief  读取按钮状态并控制LED
 * @param  BUTTON_GPIO: 按钮所在的GPIO端口
 * @param  BUTTON_PIN: 按钮连接的GPIO引脚
 * @param  LED_GPIO: LED所在的GPIO端口
 * @param  LED_PIN: LED连接的GPIO引脚
 * @param  activeLevel: 按钮激活电平 (0:低电平有效, 1:高电平有效)
 * @retval 无
 */
void Button_LED_Control(GPIO_TypeDef* BUTTON_GPIO, uint16_t BUTTON_PIN,
                         GPIO_TypeDef* LED_GPIO, uint16_t LED_PIN,
                         uint8_t activeLevel) {
  // 定义状态变量
  static uint8_t buttonState = 0;     // 0:未按下, 1:按下
  static uint8_t ledState = 0;        // 0:熄灭, 1:点亮
  static uint32_t pressTime = 0;      // 按下时间点
  static uint32_t lastDebounceTime = 0; // 上次抖动时间
  static uint8_t lastReading = 0;     // 上次读取的状态
  static uint8_t longPressActive = 0; // 长按激活标志

  // 读取当前按钮状态
  uint8_t reading = HAL_GPIO_ReadPin(BUTTON_GPIO, BUTTON_PIN);

  // 如果是高电平有效，需要翻转读取的值
  if (activeLevel == 1) {
    reading = reading;
  } else {
    reading = !reading;
  }

  // 检测到按钮状态变化
  if (reading != lastReading) {
    lastDebounceTime = HAL_GetTick(); // 重置抖动时间
  }

  // 消抖处理 (50ms)
  if ((HAL_GetTick() - lastDebounceTime) > 50) {
    // 状态稳定后，检测是否有变化
    if (reading != buttonState) {
      buttonState = reading;

      // 按钮按下
      if (buttonState == 1) {
        pressTime = HAL_GetTick(); // 记录按下时间
      }
      // 按钮释放
      else {
        // 检查是否是短按 (按下时间小于1000ms)
        if ((HAL_GetTick() - pressTime) < 1000 && !longPressActive) {
          // 短按：切换LED状态
          ledState = !ledState;
          HAL_GPIO_WritePin(LED_GPIO, LED_PIN, ledState ? GPIO_PIN_SET : GPIO_PIN_RESET);
        }

        // 重置长按标志
        longPressActive = 0;
      }
    }

    // 检测长按 (按下时间大于1000ms)
    if (buttonState == 1 && (HAL_GetTick() - pressTime) > 1000) {
      // 设置长按激活标志
      longPressActive = 1;

      // 长按：LED闪烁
      if ((HAL_GetTick() % 200) < 100) {
        HAL_GPIO_WritePin(LED_GPIO, LED_PIN, GPIO_PIN_SET);
      } else {
        HAL_GPIO_WritePin(LED_GPIO, LED_PIN, GPIO_PIN_RESET);
      }
    }
  }

  // 保存当前读取的状态
  lastReading = reading;
}

// 函数使用示例:
void Example_Usage(void) {
  // 初始化GPIO
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  __HAL_RCC_GPIOD_CLK_ENABLE();
  __HAL_RCC_GPIOE_CLK_ENABLE();

  // 配置按钮引脚为输入，使用上拉电阻（按钮接地，低电平有效）
  GPIO_InitStruct.Pin = GPIO_PIN_4;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOD, &GPIO_InitStruct);

  // 配置LED引脚为输出
  GPIO_InitStruct.Pin = GPIO_PIN_5;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);

  // 主循环
  while (1) {
    // 0表示按钮为低电平有效（接地）
    Button_LED_Control(GPIOD, GPIO_PIN_4, GPIOE, GPIO_PIN_5, 0);

    // 其他任务...
    HAL_Delay(10);
  }
}
      `
    },
    createdAt: '2023-12-01',
    updatedAt: '2024-03-15',
  };

  // 格式化页面标题
  useEffect(() => {
    document.title = `${experiment.title} - STM32嵌入式 AI辅助学习平台`;
  }, []);

  // 根据难度返回不同的颜色和标签文本
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return { color: 'bg-green-100 text-green-800', text: '初学者' };
      case 'intermediate':
        return { color: 'bg-blue-100 text-blue-800', text: '中级' };
      case 'advanced':
        return { color: 'bg-purple-100 text-purple-800', text: '高级' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: '未知' };
    }
  };

  const badge = getDifficultyBadge(experiment.difficulty);

  return (
    <div className="py-8">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Link to="/gpio/experiments" className="text-primary-600 hover:underline mr-3">
            &larr; 返回GPIO实验列表
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <h1 className="text-3xl font-bold">{experiment.title}</h1>
          <span className={`mt-2 md:mt-0 text-sm px-3 py-1 rounded-full ${badge.color}`}>
            {badge.text}
          </span>
        </div>
        <p className="text-gray-600 mt-2">{experiment.description}</p>
      </div>

      {/* 导航标签 */}
      <div className="mb-8 border-b">
        <nav className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('introduction')}
            className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'introduction'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            简介
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'theory'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            理论知识
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'steps'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            实验步骤
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'challenges'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            挑战任务
          </button>

        </nav>
      </div>

      {/* 内容区域 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'introduction' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">实验介绍</h2>
            <div className="mb-6 text-gray-700">
              {experiment.introduction}
            </div>

            <h3 className="text-xl font-semibold mb-3">实验目标</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              {experiment.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mb-3">所需材料</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {experiment.materials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'theory' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">理论知识</h2>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: experiment.theory }}
            />
          </div>
        )}

        {activeTab === 'steps' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">实验步骤</h2>
            <div className="space-y-12">
              {experiment.steps.map((step, index) => (
                <div key={index} className="pb-6 border-b border-gray-200 last:border-0">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <div
                    className="prose max-w-none ml-14 mb-4 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: step.content }}
                  />
                  {step.code && (
                    <div className="ml-14 bg-gray-800 text-white p-4 rounded-md">
                      <pre className="text-sm overflow-auto">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">挑战任务</h2>
            <p className="mb-4 text-gray-700">
              完成以下挑战任务，巩固和拓展您的知识：
            </p>
            <div className="space-y-4">
              {experiment.challenges.map((challenge, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold">挑战 {index + 1}:</h3>
                  <p className="text-gray-700">{challenge}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4">参考资源</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiment.resourceLinks.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">{resource.title}</div>
                    <div className="text-sm text-gray-500">{resource.type}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}


      </div>

      {/* 页面底部导航 */}
      <div className="mt-8 flex justify-between">
        <Link
          to="/gpio/experiments/led-blinking"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          上一个实验：LED闪烁控制
        </Link>
        <Link
          to="/gpio/experiments/multi-led-control"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          下一个实验：多LED控制
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default ButtonLedExperimentPage;