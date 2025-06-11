import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MultiLedControlExperimentPage() {
  const [activeTab, setActiveTab] = useState('introduction');
  
  // 实验数据
  const experiment = {
    id: 'multi-led-control',
    title: '多LED控制',
    description: '使用STM32H7控制多个LED，实现流水灯、交替闪烁等效果，掌握GPIO编程技能。',
    difficulty: 'intermediate',
    thumbnail: '/images/experiments/multi-led.jpg',
    introduction: `
      本实验将教你如何使用STM32H7的GPIO控制多个LED灯，实现各种复杂的灯光效果，如流水灯、呼吸灯、二进制计数器等。
      通过本实验，你将深入掌握GPIO的批量控制技术，以及掌握使用数组和循环来简化多设备控制的编程方法。
    `,
    objectives: [
      '学习同时控制多个GPIO引脚',
      '实现多种LED灯光效果（流水灯、交替闪烁等）',
      '掌握GPIO寄存器的位操作技巧',
      '学习使用数组和循环简化多设备控制',
      '理解位移和位操作在嵌入式系统中的应用'
    ],
    materials: [
      'STM32H7系列开发板（如STM32H750VBT6或STM32H743VIT6）',
      '多个LED灯（建议8个，不同颜色更佳）',
      '限流电阻（220欧-1k欧）× 8',
      '连接导线',
      '面包板',
      'USB线（连接开发板与电脑）'
    ],
    theory: `
      <h4>多GPIO控制基础</h4>
      <p>
        控制多个GPIO引脚有以下几种方法：
      </p>
      <ul>
        <li>单独控制每个引脚（简单但代码冗长）</li>
        <li>使用寄存器批量操作（高效但需要了解位操作）</li>
        <li>使用HAL库的批量函数（易用但可能效率较低）</li>
      </ul>
      
      <h4>寄存器批量控制技术</h4>
      <p>
        STM32的GPIO寄存器支持同时控制多个引脚：
      </p>
      <ul>
        <li>BSRR寄存器：可以在一条指令中设置或清除多个引脚</li>
        <li>ODR寄存器：可以读取或修改整个端口的状态</li>
      </ul>
      <p>
        例如，要同时设置GPIOE的引脚0、2、4，可以使用：
      </p>
      <pre>GPIOE->BSRR = (1 << 0) | (1 << 2) | (1 << 4);</pre>
      
      <h4>位操作技巧</h4>
      <p>
        在多LED控制中，常用的位操作技巧包括：
      </p>
      <ul>
        <li>位与（&）：保留特定位，清除其他位</li>
        <li>位或（|）：设置特定位，保留其他位</li>
        <li>位非（~）：反转所有位</li>
        <li>位异或（^）：翻转特定位，保留其他位</li>
        <li>位移（<<, >>）：移动位的位置</li>
      </ul>
      
      <h4>使用数组简化控制</h4>
      <p>
        使用数组存储引脚信息可以大大简化代码：
      </p>
      <pre>
uint16_t ledPins[8] = {GPIO_PIN_0, GPIO_PIN_1, GPIO_PIN_2, GPIO_PIN_3, 
                      GPIO_PIN_4, GPIO_PIN_5, GPIO_PIN_6, GPIO_PIN_7};
      </pre>
      <p>
        这样就可以用循环来控制所有LED：
      </p>
      <pre>
for(int i=0; i<8; i++) {
  HAL_GPIO_WritePin(GPIOE, ledPins[i], GPIO_PIN_SET);
}
      </pre>
    `,
    steps: [
      {
        title: '硬件连接',
        content: `
          <ol>
            <li>将8个LED的阳极分别通过限流电阻连接到开发板的PE0~PE7引脚</li>
            <li>将所有LED的阴极连接到开发板的GND引脚</li>
            <li>确保连接正确，避免短路</li>
          </ol>
          <div class="mt-4">
            <img src="/images/experiments/multi-led-connection.png" alt="多LED连接图" class="max-w-md mx-auto rounded-lg shadow-md" />
          </div>
        `
      },
      {
        title: '初始化多个GPIO引脚',
        content: `
          配置多个LED连接的GPIO引脚为输出模式：
        `,
        code: `
// 使能GPIOE时钟
__HAL_RCC_GPIOE_CLK_ENABLE();

// 配置PE0-PE7为推挽输出模式
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_1 | GPIO_PIN_2 | GPIO_PIN_3 |
                     GPIO_PIN_4 | GPIO_PIN_5 | GPIO_PIN_6 | GPIO_PIN_7;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);

// 初始状态，所有LED熄灭
GPIOE->BSRR = 0x0000FF00; // 低8位置为0（清除PE0-PE7）
        `
      },
      {
        title: '实现流水灯效果',
        content: `
          依次点亮和熄灭每个LED，形成流水灯效果：
        `,
        code: `
void RunningLight(uint32_t delay_ms)
{
  // 方法1：使用HAL库函数
  for (int i = 0; i < 8; i++)
  {
    // 点亮当前LED
    HAL_GPIO_WritePin(GPIOE, (1 << i), GPIO_PIN_SET);
    HAL_Delay(delay_ms);
    
    // 熄灭当前LED
    HAL_GPIO_WritePin(GPIOE, (1 << i), GPIO_PIN_RESET);
  }
  
  // 方法2：使用寄存器直接操作（更高效）
  for (int i = 0; i < 8; i++)
  {
    // 点亮当前LED
    GPIOE->BSRR = (1 << i); // 设置对应位
    HAL_Delay(delay_ms);
    
    // 熄灭当前LED
    GPIOE->BSRR = (1 << (i + 16)); // 清除对应位（高16位用于清除）
  }
}

// 在主循环中调用
while (1)
{
  RunningLight(100); // 流水灯，延时100ms
}
        `
      },
      {
        title: '实现交替闪烁效果',
        content: `
          实现LED交替闪烁的效果（奇数位和偶数位交替点亮）：
        `,
        code: `
void AlternatingBlink(uint32_t delay_ms, uint32_t count)
{
  // 定义奇数位和偶数位掩码
  const uint8_t oddMask = 0b10101010;  // 奇数位掩码
  const uint8_t evenMask = 0b01010101; // 偶数位掩码
  
  for (uint32_t i = 0; i < count; i++)
  {
    // 点亮偶数位，熄灭奇数位
    GPIOE->BSRR = evenMask | (oddMask << 16);
    HAL_Delay(delay_ms);
    
    // 点亮奇数位，熄灭偶数位
    GPIOE->BSRR = oddMask | (evenMask << 16);
    HAL_Delay(delay_ms);
  }
  
  // 最后熄灭所有LED
  GPIOE->BSRR = 0x0000FF00;
}

// 在主循环中调用
while (1)
{
  AlternatingBlink(200, 5); // 交替闪烁5次，每次延时200ms
  HAL_Delay(1000);          // 暂停1秒
}
        `
      },
      {
        title: '实现二进制计数器',
        content: `
          使用LED显示二进制计数值，从0到255：
        `,
        code: `
void BinaryCounter(uint32_t delay_ms)
{
  for (uint8_t count = 0; count < 255; count++)
  {
    // 直接将计数值写入ODR的低8位
    GPIOE->ODR = (GPIOE->ODR & 0xFF00) | count;
    HAL_Delay(delay_ms);
  }
}

// 在主循环中调用
while (1)
{
  BinaryCounter(100); // 二进制计数，每个数字显示100ms
  HAL_Delay(1000);    // 计数结束后暂停1秒
}
        `
      },
      {
        title: '集成多种灯光效果',
        content: `
          创建完整的演示程序，集成多种灯光效果：
        `,
        code: `
int main(void)
{
  /* 系统初始化 */
  HAL_Init();
  SystemClock_Config();
  
  /* 初始化GPIO */
  __HAL_RCC_GPIOE_CLK_ENABLE();
  
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  GPIO_InitStruct.Pin = 0xFF; // PE0-PE7
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);
  
  /* 主循环 */
  while (1)
  {
    // 播放演示序列
    
    // 1. 流水灯效果
    for (int j = 0; j < 3; j++) { // 重复3次
      for (int i = 0; i < 8; i++) {
        GPIOE->BSRR = (1 << i);
        HAL_Delay(100);
        GPIOE->BSRR = (1 << (i + 16));
      }
    }
    HAL_Delay(500);
    
    // 2. 交替闪烁效果
    for (int i = 0; i < 10; i++) {
      GPIOE->ODR = (GPIOE->ODR & 0xFF00) | 0x55; // 01010101
      HAL_Delay(200);
      GPIOE->ODR = (GPIOE->ODR & 0xFF00) | 0xAA; // 10101010
      HAL_Delay(200);
    }
    HAL_Delay(500);
    
    // 3. LED全部点亮后依次熄灭
    GPIOE->ODR = (GPIOE->ODR & 0xFF00) | 0xFF; // 全亮
    HAL_Delay(500);
    
    for (int i = 0; i < 8; i++) {
      GPIOE->BSRR = (1 << (i + 16)); // 依次熄灭
      HAL_Delay(200);
    }
    HAL_Delay(500);
    
    // 4. 二进制计数（较慢）
    for (uint8_t count = 0; count < 32; count++) {
      GPIOE->ODR = (GPIOE->ODR & 0xFF00) | count;
      HAL_Delay(200);
    }
    HAL_Delay(1000);
  }
}
        `
      }
    ],
    challenges: [
      '实现一个"Knight Rider"效果（类似于《霹雳游侠》中的前灯，LED来回扫描）',
      '创建LED随机闪烁效果',
      '实现LED波浪效果（亮度逐渐增加然后逐渐减少）',
      '根据某种模式（例如莫尔斯电码）闪烁LED来显示一条消息',
      '设计一个LED VU表（音量单位）效果，模拟音频均衡器'
    ],
    resourceLinks: [
      {
        title: 'STM32H7参考手册',
        url: 'https://www.st.com/resource/en/reference_manual/dm00176879-stm32h745755-and-stm32h747757-advanced-armbased-32bit-mcus-stmicroelectronics.pdf',
        type: 'documentation'
      },
      {
        title: 'GPIO批量操作技巧',
        url: 'https://www.st.com/content/ccc/resource/training/technical/product_training/group0/71/7e/90/d8/b6/27/42/39/STM32F0_GPIO_STM32G0_GPIO/files/STM32F0_GPIO_STM32G0_GPIO.pdf/_jcr_content/translations/en.STM32F0_GPIO_STM32G0_GPIO.pdf',
        type: 'tutorial'
      },
      {
        title: 'C语言位操作教程',
        url: 'https://www.embedded.com/introduction-to-c-programming-for-embedded-applications/',
        type: 'tutorial'
      }
    ],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25',
  };

  // 格式化页面标题
  useEffect(() => {
    document.title = `${experiment.title} - STM32H7 AI辅助学习平台`;
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
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('introduction')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'introduction' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            简介
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'theory' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            理论知识
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'steps' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            实验步骤
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
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
          to="/gpio/experiments/button-led" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          上一个实验：按钮控制LED
        </Link>
        <Link 
          to="/gpio/experiments/external-interrupt" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          下一个实验：外部中断
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default MultiLedControlExperimentPage; 