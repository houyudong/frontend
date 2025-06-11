import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ExternalInterruptExperimentPage() {
  const [activeTab, setActiveTab] = useState('introduction');
  
  // 实验数据
  const experiment = {
    id: 'external-interrupt',
    title: '外部中断',
    description: '学习配置GPIO外部中断，使用按钮触发中断事件，掌握中断处理机制和优先级管理。',
    difficulty: 'intermediate',
    thumbnail: '/images/experiments/external-interrupt.jpg',
    introduction: `
      外部中断是微控制器处理外部事件的重要机制。通过外部中断，STM32H7可以立即响应外部信号的变化，
      而不需要在主循环中不断查询。本实验将教你如何配置和使用STM32H7的外部中断功能，实现按钮按下时
      立即触发操作，掌握中断处理机制和优先级管理。
    `,
    objectives: [
      '理解中断的概念和工作原理',
      '学习配置STM32H7的外部中断',
      '实现按钮触发的中断处理',
      '掌握中断优先级的设置方法',
      '理解中断服务函数的编写规范'
    ],
    materials: [
      'STM32H7系列开发板（如STM32H750VBT6或STM32H743VIT6）',
      'LED灯',
      '限流电阻（220欧-1k欧）',
      '按钮开关',
      '连接导线',
      '面包板',
      'USB线（连接开发板与电脑）'
    ],
    theory: `
      <h4>中断基础概念</h4>
      <p>
        中断是一种硬件机制，允许外部事件或特定条件出现时暂停当前程序执行，转而执行特定的中断服务程序。
        中断的主要特点：
      </p>
      <ul>
        <li>异步执行：中断可以在任何时候发生，与主程序执行无关</li>
        <li>快速响应：中断触发后立即响应，不需要轮询检测</li>
        <li>优先级管理：可以设置不同中断的优先级，高优先级中断可以打断低优先级中断</li>
        <li>专用处理程序：每个中断都有对应的中断服务程序(ISR)</li>
      </ul>
      
      <h4>STM32H7的外部中断架构</h4>
      <p>
        STM32H7的外部中断系统主要包含以下部分：
      </p>
      <ul>
        <li>EXTI线：每个GPIO引脚可以通过EXTI控制器连接到一个中断线</li>
        <li>NVIC：嵌套向量中断控制器，管理中断优先级和中断请求</li>
        <li>SYSCFG：系统配置控制器，用于配置哪个GPIO端口连接到EXTI线</li>
      </ul>
      <p>
        特别注意：相同编号的GPIO引脚共享同一个EXTI线。例如，PA0、PB0、PC0等都映射到EXTI0线。
      </p>
      
      <h4>中断触发条件</h4>
      <p>
        外部中断可以在不同条件下触发：
      </p>
      <ul>
        <li>上升沿：信号从低电平变为高电平</li>
        <li>下降沿：信号从高电平变为低电平</li>
        <li>双边沿：信号电平发生任何变化</li>
      </ul>
      
      <h4>优先级管理</h4>
      <p>
        STM32H7的中断优先级由两部分组成：
      </p>
      <ul>
        <li>抢占优先级：决定中断是否可以打断其他正在执行的中断</li>
        <li>子优先级：决定同一抢占优先级下的中断执行顺序</li>
      </ul>
      <p>
        数值越小，优先级越高（0为最高优先级）。
      </p>
    `,
    steps: [
      {
        title: '硬件连接',
        content: `
          <ol>
            <li>将LED阳极通过限流电阻连接到开发板PE5引脚</li>
            <li>将LED阴极连接到开发板GND引脚</li>
            <li>将按钮一端连接到开发板PC13引脚</li>
            <li>将按钮另一端连接到开发板GND引脚</li>
          </ol>
          <div class="mt-4">
            <img src="/images/experiments/external-interrupt-connection.png" alt="外部中断连接图" class="max-w-md mx-auto rounded-lg shadow-md" />
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
__HAL_RCC_GPIOE_CLK_ENABLE();

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
        title: '配置按钮为外部中断引脚',
        content: `
          配置按钮连接的PC13引脚为外部中断，在下降沿（按下）触发中断：
        `,
        code: `
// 使能GPIOC时钟
__HAL_RCC_GPIOC_CLK_ENABLE();

// 配置PC13为中断引脚，下降沿触发
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_13;
GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;  // 下降沿触发中断
GPIO_InitStruct.Pull = GPIO_PULLUP;
HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

// 配置NVIC，设置中断优先级
HAL_NVIC_SetPriority(EXTI15_10_IRQn, 0, 0);  // PC13对应EXTI15_10_IRQn中断
HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);          // 使能中断
        `
      },
      {
        title: '编写中断服务函数',
        content: `
          首先需要添加中断处理函数。在STM32CubeIDE中，通常在stm32h7xx_it.c文件中实现：
        `,
        code: `
/**
  * @brief  外部中断15-10中断处理函数
  * @param  None
  * @retval None
  */
void EXTI15_10_IRQHandler(void)
{
  /* 调用HAL库的中断处理函数 */
  HAL_GPIO_EXTI_IRQHandler(GPIO_PIN_13);
}
        `
      },
      {
        title: '实现中断回调函数',
        content: `
          在HAL库中，需要实现HAL_GPIO_EXTI_Callback回调函数，这是实际的中断处理逻辑：
        `,
        code: `
/**
  * @brief  GPIO外部中断回调函数
  * @param  GPIO_Pin 触发中断的引脚
  * @retval None
  */
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
  if (GPIO_Pin == GPIO_PIN_13)
  {
    /* PC13触发的中断，翻转LED状态 */
    HAL_GPIO_TogglePin(GPIOE, GPIO_PIN_5);
    
    /* 简单的软件消抖 */
    HAL_Delay(50);  // 注意：在实际中断中不应使用HAL_Delay()，这里仅作演示
  }
}
        `
      },
      {
        title: '主函数实现',
        content: `
          主函数非常简单，只需初始化外设，然后系统就会通过中断响应按钮事件：
        `,
        code: `
int main(void)
{
  /* 系统初始化 */
  HAL_Init();
  SystemClock_Config();
  
  /* 初始化GPIO - LED */
  __HAL_RCC_GPIOE_CLK_ENABLE();
  
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  GPIO_InitStruct.Pin = GPIO_PIN_5;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);
  
  HAL_GPIO_WritePin(GPIOE, GPIO_PIN_5, GPIO_PIN_RESET);  // LED初始状态为熄灭
  
  /* 初始化GPIO - 中断按钮 */
  __HAL_RCC_GPIOC_CLK_ENABLE();
  
  GPIO_InitStruct.Pin = GPIO_PIN_13;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
  
  /* 配置NVIC */
  HAL_NVIC_SetPriority(EXTI15_10_IRQn, 0, 0);
  HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);
  
  /* 主循环 */
  while (1)
  {
    /* 主循环可以执行其他任务，按钮按下会触发中断处理 */
    HAL_Delay(100);
  }
}
        `
      },
      {
        title: '中断处理中的注意事项',
        content: `
          在编写中断服务函数时，需要遵循以下规则：
          
          <ol>
            <li>保持中断服务函数尽可能简短，减少中断时间</li>
            <li>避免在中断中使用可能阻塞的函数（如HAL_Delay）</li>
            <li>保存和恢复可能被修改的寄存器</li>
            <li>使用易变变量（volatile）来在主程序和中断之间共享数据</li>
            <li>在中断结束前必须清除中断标志位（HAL库会自动处理）</li>
          </ol>
          
          以下是优化后的中断处理例子：
        `,
        code: `
/* 定义一个易变变量用于主程序和中断间通信 */
volatile uint8_t button_pressed = 0;

/**
  * @brief  GPIO外部中断回调函数
  * @param  GPIO_Pin 触发中断的引脚
  * @retval None
  */
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
  if (GPIO_Pin == GPIO_PIN_13)
  {
    /* 设置标志，在主循环中处理 */
    button_pressed = 1;
  }
}

/* 主循环中处理中断产生的事件 */
while (1)
{
  if (button_pressed)
  {
    /* 清除标志 */
    button_pressed = 0;
    
    /* 翻转LED状态 */
    HAL_GPIO_TogglePin(GPIOE, GPIO_PIN_5);
    
    /* 消抖延时可以放在主循环中 */
    HAL_Delay(50);
  }
  
  /* 其他任务... */
}
        `
      }
    ],
    challenges: [
      '修改代码使LED在按钮按下时点亮，松开时熄灭（提示：使用上升沿和下降沿中断）',
      '实现按钮按下次数计数，并在LED上以不同闪烁模式显示',
      '使用两个按钮和两个中断，每个按钮控制不同的LED',
      '实现长按和短按的区分（在中断中记录时间，在主循环中判断）',
      '使用中断实现按键的多级菜单系统，通过LED不同的闪烁模式表示不同的菜单项'
    ],
    resourceLinks: [
      {
        title: 'STM32H7参考手册',
        url: 'https://www.st.com/resource/en/reference_manual/dm00176879-stm32h745755-and-stm32h747757-advanced-armbased-32bit-mcus-stmicroelectronics.pdf',
        type: 'documentation'
      },
      {
        title: 'STM32 外部中断教程',
        url: 'https://www.st.com/content/ccc/resource/training/technical/product_training/group0/71/7e/90/d8/b6/27/42/39/STM32F0_EXTI_STM32G0_EXTI/files/STM32F0_EXTI_STM32G0_EXTI.pdf/_jcr_content/translations/en.STM32F0_EXTI_STM32G0_EXTI.pdf',
        type: 'tutorial'
      },
      {
        title: '中断优先级管理详解',
        url: 'https://www.embedded.com/interrupts-in-c/',
        type: 'tutorial'
      }
    ],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
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
          to="/gpio/experiments/multi-led-control" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          上一个实验：多LED控制
        </Link>
        <Link 
          to="/gpio/experiments/lcd-interface" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          下一个实验：LCD显示器接口
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default ExternalInterruptExperimentPage; 