import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AiAssistant from '../../components/AiAssistant';
import AdvancedCodeGenerator from '../../components/AdvancedCodeGenerator';
import ChallengeCard from '../../components/ChallengeCard';
import { FaRobot, FaBrain, FaQuestionCircle, FaLightbulb, FaTimes, FaChevronLeft, FaChevronRight, FaRegLightbulb, FaCode, FaClipboard } from 'react-icons/fa';

function KeypadInterfacingExperimentPage() {
  const [activeTab, setActiveTab] = useState('introduction');
  const [showAssistant, setShowAssistant] = useState(false);
  const [hasVisitedPage, setHasVisitedPage] = useState(false);
  const [aiAssistantCollapsed, setAiAssistantCollapsed] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState('');
  
  // 实验数据
  const experiment = {
    id: 'keypad-interfacing',
    title: '矩阵键盘接口',
    description: '学习使用STM32嵌入式连接和读取矩阵键盘，掌握多按键扫描技术和按键解码方法。',
    difficulty: 'advanced',
    thumbnail: '/images/experiments/keypad-matrix.jpg',
    introduction: `
      矩阵键盘是嵌入式系统中常用的输入设备，它使用行列排列的方式连接多个按键，大大减少了所需的GPIO引脚数量。
      通过本实验，你将学习如何连接4×4矩阵键盘到STM32嵌入式微控制器，掌握键盘扫描算法，以及如何通过查找表解码按键值。
      这些技能对于任何需要多按键输入的嵌入式项目都非常有价值。
    `,
    objectives: [
      '理解矩阵键盘的工作原理和连接方式',
      '学习配置STM32嵌入式的GPIO用于矩阵键盘扫描',
      '掌握行列扫描算法识别按下的按键',
      '实现按键消抖和多键检测',
      '开发简单的用户界面显示按键输入'
    ],
    materials: [
      'STM32嵌入式系列开发板（如STM32F4、STM32G0或STM32L4系列）',
      '4×4矩阵键盘（16个按键）',
      'LED指示灯（至少4个）或字符LCD显示屏',
      '连接导线',
      '1k欧姆上拉电阻（8个，可选）',
      '面包板',
      'USB线（连接开发板与电脑）'
    ],
    theory: `
      <h4>矩阵键盘工作原理</h4>
      <p>
        矩阵键盘通过将按键排列在行和列的交叉点，大大减少了所需的I/O引脚：
      </p>
      <ul>
        <li>对于4×4矩阵键盘（16个按键），仅需8个I/O引脚（4行+4列）</li>
        <li>按键位于行线和列线的交叉点</li>
        <li>按下按键时，对应的行和列电气连通</li>
      </ul>
      
      <h4>键盘扫描方法</h4>
      <p>
        常用的扫描方法是逐行扫描：
      </p>
      <ol>
        <li>将一行设为低电平（激活态），其他行设为高阻态</li>
        <li>读取所有列的状态，低电平表示该列上的按键被按下</li>
        <li>依次激活每一行，重复上述过程</li>
        <li>通过行号和列号确定按下的具体按键</li>
      </ol>
      
      <h4>常见矩阵键盘布局</h4>
      <p>
        标准4×4矩阵键盘通常有以下布局：
      </p>
      <pre>
| 1 | 2 | 3 | A |
| 4 | 5 | 6 | B |
| 7 | 8 | 9 | C |
| * | 0 | # | D |
      </pre>
      <p>
        每个符号对应键盘上的一个物理按键。
      </p>
      
      <h4>GPIO配置考虑</h4>
      <p>
        为了正确扫描矩阵键盘，GPIO的配置需要注意：
      </p>
      <ul>
        <li>行引脚：需要能够在输出（扫描时）和高阻态（非扫描时）之间切换</li>
        <li>列引脚：配置为带上拉电阻的输入模式</li>
        <li>需要处理按键抖动问题</li>
        <li>考虑可能的多键同时按下情况</li>
      </ul>
    `,
    steps: [
      {
        title: '硬件连接',
        content: `
          <ol>
            <li>将矩阵键盘的4个行线（R1-R4）分别连接到STM32嵌入式的PD0-PD3引脚</li>
            <li>将矩阵键盘的4个列线（C1-C4）分别连接到STM32嵌入式的PD4-PD7引脚</li>
            <li>可选：在每个列线上连接1kΩ上拉电阻到VCC（如果键盘本身没有上拉电阻）</li>
            <li>连接LED指示灯：
              <ul>
                <li>LED1：PE0（用于显示按键状态）</li>
                <li>LED2：PE1</li>
                <li>LED3：PE2</li>
                <li>LED4：PE3</li>
              </ul>
            </li>
          </ol>
          <div class="mt-4">
            <img src="/images/experiments/keypad-matrix-connection.png" alt="矩阵键盘连接图" class="max-w-md mx-auto rounded-lg shadow-md" />
          </div>
        `
      },
      {
        title: '配置行GPIO引脚',
        content: `
          配置连接到矩阵键盘行的GPIO引脚为输出模式：
        `,
        code: `
// 使能GPIOD时钟
__HAL_RCC_GPIOD_CLK_ENABLE();

// 配置PD0-PD3为推挽输出模式（行线）
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_1 | GPIO_PIN_2 | GPIO_PIN_3;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOD, &GPIO_InitStruct);

// 默认将所有行设置为高电平（非激活状态）
GPIOD->BSRR = 0x0000000F; // 设置PD0-PD3为高电平
        `
      },
      {
        title: '配置列GPIO引脚',
        content: `
          配置连接到矩阵键盘列的GPIO引脚为输入模式，带上拉电阻：
        `,
        code: `
// 配置PD4-PD7为输入模式（列线）
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_4 | GPIO_PIN_5 | GPIO_PIN_6 | GPIO_PIN_7;
GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
GPIO_InitStruct.Pull = GPIO_PULLUP; // 启用内部上拉电阻
HAL_GPIO_Init(GPIOD, &GPIO_InitStruct);
        `
      },
      {
        title: '配置LED输出引脚',
        content: `
          配置LED指示灯的GPIO引脚为输出模式：
        `,
        code: `
// 使能GPIOE时钟
__HAL_RCC_GPIOE_CLK_ENABLE();

// 配置PE0-PE3为推挽输出模式（LED）
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_1 | GPIO_PIN_2 | GPIO_PIN_3;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);

// 初始状态，所有LED熄灭
GPIOE->BSRR = 0x000000F0; // 清除PE0-PE3（低电平熄灭）
        `
      },
      {
        title: '实现键盘扫描函数',
        content: `
          创建矩阵键盘扫描函数，检测按下的按键：
        `,
        code: `
/**
 * @brief  扫描矩阵键盘
 * @param  None
 * @retval 按键代码（0-15）或255表示无按键按下
 */
uint8_t Keypad_Scan(void)
{
  const uint16_t ROW_PINS[4] = {GPIO_PIN_0, GPIO_PIN_1, GPIO_PIN_2, GPIO_PIN_3}; // 行引脚
  const uint16_t COL_PINS[4] = {GPIO_PIN_4, GPIO_PIN_5, GPIO_PIN_6, GPIO_PIN_7}; // 列引脚
  uint8_t row, col;
  uint8_t keycode = 255; // 默认无按键按下
  
  // 逐行扫描
  for (row = 0; row < 4; row++)
  {
    // 将当前行设为低电平（激活）
    GPIOD->BSRR = (uint32_t)(ROW_PINS[row]) << 16; // 将对应位写0
    
    // 短暂延时，让信号稳定
    for(volatile int i = 0; i < 10; i++);
    
    // 检查每一列
    for (col = 0; col < 4; col++)
    {
      if (HAL_GPIO_ReadPin(GPIOD, COL_PINS[col]) == GPIO_PIN_RESET)
      {
        // 检测到按键按下，计算按键代码(0-15)
        keycode = row * 4 + col;
        
        // 等待按键释放（简单防抖）
        while (HAL_GPIO_ReadPin(GPIOD, COL_PINS[col]) == GPIO_PIN_RESET);
        HAL_Delay(20); // 延时20ms消抖
      }
    }
    
    // 将当前行恢复为高电平（非激活）
    GPIOD->BSRR = ROW_PINS[row];
  }
  
  return keycode;
}
        `
      },
      {
        title: '实现按键解码函数',
        content: `
          创建函数将按键代码转换为实际符号：
        `,
        code: `
/**
 * @brief  将按键代码转换为字符
 * @param  keycode 按键代码(0-15)
 * @retval 对应的字符
 */
char Keypad_Decode(uint8_t keycode)
{
  // 按键映射表（4x4矩阵键盘标准布局）
  const char KEYMAP[16] = {
    '1', '2', '3', 'A',
    '4', '5', '6', 'B',
    '7', '8', '9', 'C',
    '*', '0', '#', 'D'
  };
  
  // 检查keycode是否有效
  if (keycode < 16)
    return KEYMAP[keycode];
  else
    return '\0'; // 无效按键
}
        `
      },
      {
        title: '控制LED显示按键数字',
        content: `
          使用二进制方式在LED上显示按下的按键数字：
        `,
        code: `
/**
 * @brief  在LED上显示数字（二进制显示）
 * @param  number 要显示的数字(0-15)
 * @retval None
 */
void LED_DisplayNumber(uint8_t number)
{
  // 首先清除所有LED
  GPIOE->BSRR = 0x000000F0; // 清除PE0-PE3
  
  // 然后设置对应的位
  GPIOE->BSRR = (number & 0x0F); // 仅使用低4位（0-15）
}
        `
      },
      {
        title: '主程序集成',
        content: `
          将所有功能集成到主程序中：
        `,
        code: `
int main(void)
{
  uint8_t keycode;
  char    keychar;
  
  /* 系统初始化 */
  HAL_Init();
  SystemClock_Config();
  
  /* GPIO初始化 */
  // 使能GPIOD和GPIOE时钟
  __HAL_RCC_GPIOD_CLK_ENABLE();
  __HAL_RCC_GPIOE_CLK_ENABLE();
  
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  
  // 配置PD0-PD3为推挽输出模式（行线）
  GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_1 | GPIO_PIN_2 | GPIO_PIN_3;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOD, &GPIO_InitStruct);
  
  // 配置PD4-PD7为输入模式（列线）
  GPIO_InitStruct.Pin = GPIO_PIN_4 | GPIO_PIN_5 | GPIO_PIN_6 | GPIO_PIN_7;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOD, &GPIO_InitStruct);
  
  // 配置PE0-PE3为推挽输出模式（LED）
  GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_1 | GPIO_PIN_2 | GPIO_PIN_3;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);
  
  // 将所有行设为高电平（初始状态）
  GPIOD->BSRR = 0x0000000F;
  
  // 将所有LED熄灭（初始状态）
  GPIOE->BSRR = 0x000000F0;
  
  /* 主循环 */
  while (1)
  {
    // 扫描键盘
    keycode = Keypad_Scan();
    
    // 如果有按键按下
    if (keycode != 255)
    {
      // 解码按键
      keychar = Keypad_Decode(keycode);
      
      // 在LED上显示按键代码（二进制）
      LED_DisplayNumber(keycode);
      
      // 可以在这里添加其他处理，如通过串口发送按键信息
      
      HAL_Delay(100); // 短暂延时
    }
  }
}
        `
      },
      {
        title: '高级功能：按键缓冲区实现',
        content: `
          添加按键缓冲区功能，存储最近按下的按键序列：
        `,
        code: `
#define KEY_BUFFER_SIZE 16 // 按键缓冲区大小

// 按键缓冲区
char key_buffer[KEY_BUFFER_SIZE] = {0};
uint8_t buffer_index = 0;

/**
 * @brief  添加按键到缓冲区
 * @param  key 按键字符
 * @retval None
 */
void Key_AddToBuffer(char key)
{
  if (buffer_index < KEY_BUFFER_SIZE - 1) // 留出结束符空间
  {
    key_buffer[buffer_index++] = key;
    key_buffer[buffer_index] = '\0'; // 添加字符串结束符
  }
  else
  {
    // 缓冲区已满，可以移位或清空
    buffer_index = 0;
    key_buffer[buffer_index++] = key;
    key_buffer[buffer_index] = '\0';
  }
}

// 在主循环中使用
while (1)
{
  keycode = Keypad_Scan();
  
  if (keycode != 255)
  {
    keychar = Keypad_Decode(keycode);
    
    // 添加到缓冲区
    Key_AddToBuffer(keychar);
    
    // 显示最近按下的按键
    LED_DisplayNumber(keycode);
    
    HAL_Delay(100);
  }
}
        `
      }
    ],
    challenges: [
      '实现密码验证功能：设定一个固定密码，通过键盘输入并验证，LED灯显示验证结果',
      '实现一个简单计算器，支持输入数字和基本运算符（+，-，*，/）',
      '修改代码支持多键同时按下的检测（键盘扫描时不等待按键释放）',
      '添加蜂鸣器反馈，在按键按下时发出短促的提示音',
      '将键盘输入结果显示在LCD屏幕上（需要额外的LCD库）'
    ],
    resourceLinks: [
      {
        title: 'STM32嵌入式参考手册',
        url: 'https://www.st.com/resource/en/reference_manual/dm00176879-stm32h745755-and-stm32h747757-advanced-armbased-32bit-mcus-stmicroelectronics.pdf',
        type: 'documentation'
      },
      {
        title: '矩阵键盘理论与实践',
        url: 'https://www.embedded.com/keypad-interfacing-techniques-for-microcontrollers/',
        type: 'tutorial'
      },
      {
        title: '键盘扫描和去抖动技术',
        url: 'https://www.embedded.com/advanced-keypad-scanning-techniques/',
        type: 'tutorial'
      }
    ],
    createdAt: '2024-02-15',
    updatedAt: '2024-02-20',
    thoughtQuestions: [
      '为什么矩阵键盘能够使用较少的GPIO引脚控制较多的按键？请解释其原理。',
      '扫描时为什么要将一行设为低电平而不是高电平？这与列的上拉电阻有什么关系？',
      '在不使用延时函数的情况下，有哪些方法可以实现更高效的按键消抖？',
      '如何改进当前的扫描算法以支持多键同时按下的检测？'
    ],
  };

  // 当用户访问页面时，随机选择一个思考题
  useEffect(() => {
    document.title = `${experiment.title} - STM32嵌入式 AI辅助学习平台`;
    
    // 仅在首次访问页面时显示思考题
    if (!localStorage.getItem('visited_keypad_page')) {
      setShowAssistant(true);
      localStorage.setItem('visited_keypad_page', 'true');
    }
    
    setHasVisitedPage(localStorage.getItem('visited_keypad_page') === 'true');
  }, []);

  // 当标签页切换时，处理AI助手状态
  useEffect(() => {
    // 如果进入挑战任务标签页，自动折叠侧边栏AI助手
    // 思考题标签页不再折叠侧边栏助手，避免内容重复
    if (activeTab === 'challenges') {
      setAiAssistantCollapsed(true);
    } else if (activeTab === 'thoughts') {
      // 确保思考题页面下显示右侧助手
      setAiAssistantCollapsed(false);
    }
  }, [activeTab]);

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
  
  // 随机选择一个思考题
  const getRandomThoughtQuestion = () => {
    const randomIndex = Math.floor(Math.random() * experiment.thoughtQuestions.length);
    return experiment.thoughtQuestions[randomIndex];
  };

  const toggleAiAssistant = () => {
    setAiAssistantCollapsed(!aiAssistantCollapsed);
  };

  return (
    <div className="py-8 flex">
      {/* 主内容区域 */}
      <div className={`transition-all duration-300 ${aiAssistantCollapsed ? 'mr-12' : 'mr-96'} flex-grow`}>
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
            <button
              onClick={() => setActiveTab('thoughts')}
              className={`py-4 px-1 font-medium text-sm border-b-2 flex items-center ${
                activeTab === 'thoughts' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaBrain className="mr-1" /> 思考题
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
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaQuestionCircle className="mr-2 text-primary-600" />
                挑战任务
              </h2>
              <p className="mb-6 text-gray-700">
                完成以下挑战任务，巩固和拓展您的知识。您可以使用下方的高级代码生成器帮您生成代码，或者您可以自行编写代码。
              </p>
              <div className="space-y-6">
                {experiment.challenges.map((challenge, index) => (
                  <ChallengeCard 
                    key={index}
                    challenge={challenge}
                    index={index}
                  />
                ))}
              </div>
              
              {/* 挑战任务中的高级代码生成器 */}
              <div className="mt-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <FaRobot className="mr-2 text-primary-600" />
                    矩阵键盘高级代码生成器
                  </h3>
                  <p className="mb-4 text-gray-700">
                    使用AI大模型帮助您完成上述挑战任务。选择一个挑战任务或输入自定义需求，AI将为您生成完整的代码、流程图和详细解释。
                  </p>

                  <div className="border rounded-lg mb-6 p-4 bg-blue-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FaRegLightbulb className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <strong>提示：</strong> 输入 "use context7" 可获取最新的STM32文档和编程指南，帮助您生成更准确的代码。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 代码生成器选择界面 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">选择挑战任务：</label>
                    <div className="grid grid-cols-1 gap-3">
                      {experiment.challenges.map((challenge, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            // 设置代码生成器的输入内容
                            setSelectedChallenge(`use context7\n请为以下STM32矩阵键盘挑战生成完整代码和解释：${challenge}。\n请使用STM32 HAL库，并包含所有必要的初始化函数、主要函数实现和详细注释。请同时提供：\n1. 代码的详细解释\n2. 实现的流程图(使用mermaid语法)\n3. 测试和调试建议`);
                            
                            // 添加选中效果
                            const allButtons = document.querySelectorAll('.challenge-button');
                            allButtons.forEach(btn => btn.classList.remove('ring-2', 'ring-primary-500'));
                            document.getElementById(`challenge-button-${index}`).classList.add('ring-2', 'ring-primary-500');
                          }}
                          id={`challenge-button-${index}`}
                          className="challenge-button text-left p-4 border rounded-md hover:bg-gray-50 transition-colors flex items-start bg-gray-50 hover:bg-white"
                        >
                          <span className="inline-block w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <div>
                            <span className="text-gray-800 font-medium block">{challenge}</span>
                            <span className="text-gray-500 text-sm mt-1 block">点击生成代码、流程图和解释</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 集成高级代码生成器组件 */}
                  <AdvancedCodeGenerator 
                    initialPrompt={selectedChallenge}
                    contextData={experiment.description}
                  />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mt-10 mb-4">参考资源</h3>
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
          
          {activeTab === 'thoughts' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaLightbulb className="mr-2 text-primary-600" />
                思考题
              </h2>
              <p className="mb-6 text-gray-700">
                以下思考题旨在帮助您更深入地理解矩阵键盘的原理和应用。您可以使用右侧的智能助手来讨论这些问题。
              </p>
              <div className="space-y-4">
                {experiment.thoughtQuestions.map((question, index) => (
                  <div key={index} className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-400">
                    <h3 className="font-semibold flex items-center">
                      <FaBrain className="mr-2 text-yellow-600" />
                      思考题 {index + 1}:
                    </h3>
                    <p className="text-gray-800 mt-1">{question}</p>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => {
                          setAiAssistantCollapsed(false);
                        }}
                        className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
                      >
                        <FaRobot className="mr-1" />
                        使用AI助手讨论这个问题
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 页面底部导航 */}
        <div className="mt-8 flex justify-between">
          <Link 
            to="/gpio/experiments/external-interrupt" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            上一个实验：外部中断
          </Link>
          <Link 
            to="/gpio/experiments" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
          >
            返回实验列表
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* 右侧AI助手 */}
      <div className={`fixed right-0 top-0 bottom-0 h-full bg-white shadow-lg z-10 transition-all duration-300 ${aiAssistantCollapsed ? 'w-12' : 'w-96'}`} style={{ marginTop: '64px' }}>
        {aiAssistantCollapsed ? (
          <button 
            onClick={toggleAiAssistant}
            className="absolute top-4 right-0 w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-l-md"
            title="展开AI助手"
          >
            <FaChevronLeft className="text-xl" />
          </button>
        ) : (
          <>
            <button 
              onClick={toggleAiAssistant}
              className="absolute top-4 left-0 w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-r-md"
              title="收起AI助手"
            >
              <FaChevronRight className="text-xl" />
            </button>
            <div className="h-full overflow-y-auto pt-16 px-4 pb-4">
              <AiAssistant 
                context={experiment.description}
                thoughtQuestion={!hasVisitedPage ? getRandomThoughtQuestion() : null}
                hideContextTip={true}
              />
            </div>
          </>
        )}
      </div>
      
      {/* CSS动画 */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default KeypadInterfacingExperimentPage; 