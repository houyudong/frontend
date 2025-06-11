import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LcdInterfaceExperimentPage() {
  const [activeTab, setActiveTab] = useState('introduction');
  
  // 实验数据
  const experiment = {
    id: 'lcd-interface',
    title: 'LCD显示器接口',
    description: '通过GPIO并行接口控制字符LCD显示器，学习显示文本和创建自定义字符。',
    difficulty: 'advanced',
    thumbnail: '/images/experiments/lcd-interface.jpg',
    introduction: `
      本实验将教你如何使用STM32H7的GPIO接口连接和控制基于HD44780控制器的字符LCD显示器。
      这类显示器广泛应用于各种嵌入式设备中，用于显示文本信息和简单图形。通过本实验，你将学习
      并行总线接口的工作原理，以及如何编写驱动程序控制LCD显示文本和自定义字符。
    `,
    objectives: [
      '理解字符LCD显示器的工作原理和接口标准',
      '学习配置STM32H7的GPIO引脚进行并行通信',
      '实现LCD初始化和基本控制功能',
      '掌握在LCD上显示文本和移动光标的方法',
      '学习创建和显示自定义字符的技术'
    ],
    materials: [
      'STM32H7系列开发板（如STM32H750VBT6或STM32H743VIT6）',
      '1602或1604字符LCD模块（基于HD44780控制器）',
      '可变电阻（10K欧姆，用于调节对比度）',
      '面包板和连接导线',
      'USB线（连接开发板与电脑）'
    ],
    theory: `
      <h4>字符LCD显示器基础</h4>
      <p>
        基于HD44780控制器的字符LCD是一种常见的显示设备，通常有以下规格：
      </p>
      <ul>
        <li>1602：16列×2行，共32个字符显示位置</li>
        <li>1604：16列×4行，共64个字符显示位置</li>
        <li>2004：20列×4行，共80个字符显示位置</li>
      </ul>
      <p>
        每个字符由5×8或5×10的点阵构成，可以显示ASCII字符或自定义字符。
      </p>
      
      <h4>接口引脚</h4>
      <p>
        标准HD44780 LCD接口包含以下引脚：
      </p>
      <ul>
        <li>VSS：接地</li>
        <li>VDD：电源（通常为5V或3.3V）</li>
        <li>V0：对比度调节（通过电位器连接）</li>
        <li>RS：寄存器选择（0=指令，1=数据）</li>
        <li>R/W：读/写控制（0=写，1=读）</li>
        <li>E：使能信号</li>
        <li>D0-D7：8位数据总线</li>
        <li>A、K：背光正极和负极</li>
      </ul>
      
      <h4>通信模式</h4>
      <p>
        LCD可以工作在两种模式下：
      </p>
      <ul>
        <li>8位模式：使用全部8根数据线（D0-D7）</li>
        <li>4位模式：仅使用高4位数据线（D4-D7），每次传输分两次进行</li>
      </ul>
      <p>
        4位模式减少了所需的GPIO数量，但速度稍慢。在本实验中，我们将使用更简单的8位模式。
      </p>
      
      <h4>LCD指令集</h4>
      <p>
        LCD接受多种指令来控制其操作：
      </p>
      <ul>
        <li>清屏 (0x01)</li>
        <li>返回光标到初始位置 (0x02)</li>
        <li>设置输入模式 (0x04 + 标志位)</li>
        <li>显示控制 (0x08 + 标志位)</li>
        <li>光标/显示移动 (0x10 + 标志位)</li>
        <li>功能设置 (0x20 + 标志位)</li>
        <li>设置CGRAM地址 (0x40 + 地址)</li>
        <li>设置DDRAM地址 (0x80 + 地址)</li>
      </ul>
    `,
    steps: [
      {
        title: '硬件连接',
        content: `
          <ol>
            <li>将LCD的VSS引脚连接到开发板的GND</li>
            <li>将LCD的VDD引脚连接到开发板的3.3V电源</li>
            <li>将10K电位器的一端连接到GND，另一端连接到3.3V，中间抽头连接到LCD的V0引脚（用于调节对比度）</li>
            <li>将LCD的RS引脚连接到STM32H7的PD0</li>
            <li>将LCD的R/W引脚连接到STM32H7的PD1</li>
            <li>将LCD的E引脚连接到STM32H7的PD2</li>
            <li>将LCD的D0-D7引脚分别连接到STM32H7的PE0-PE7</li>
            <li>将LCD的背光引脚A连接到3.3V，K连接到GND</li>
          </ol>
          <div class="mt-4">
            <img src="/images/experiments/lcd-connection.png" alt="LCD连接图" class="max-w-md mx-auto rounded-lg shadow-md" />
          </div>
        `
      },
      {
        title: '配置GPIO引脚',
        content: `
          配置连接LCD的GPIO引脚：
        `,
        code: `
// 使能GPIOD和GPIOE的时钟
__HAL_RCC_GPIOD_CLK_ENABLE();
__HAL_RCC_GPIOE_CLK_ENABLE();

// 配置控制引脚（RS, R/W, E）为输出模式
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_1 | GPIO_PIN_2;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOD, &GPIO_InitStruct);

// 配置数据引脚（D0-D7）为输出模式
GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_1 | GPIO_PIN_2 | GPIO_PIN_3 |
                     GPIO_PIN_4 | GPIO_PIN_5 | GPIO_PIN_6 | GPIO_PIN_7;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);

// 初始状态，所有控制信号为低电平
HAL_GPIO_WritePin(GPIOD, GPIO_PIN_0 | GPIO_PIN_1 | GPIO_PIN_2, GPIO_PIN_RESET);
        `
      },
      {
        title: 'LCD通信基本函数',
        content: `
          实现与LCD通信的基本函数：
        `,
        code: `
/* LCD引脚定义 */
#define LCD_RS_PIN                GPIO_PIN_0
#define LCD_RS_GPIO_PORT          GPIOD
#define LCD_RW_PIN                GPIO_PIN_1
#define LCD_RW_GPIO_PORT          GPIOD
#define LCD_EN_PIN                GPIO_PIN_2
#define LCD_EN_GPIO_PORT          GPIOD
#define LCD_DATA_GPIO_PORT        GPIOE

/* LCD控制宏定义 */
#define LCD_RS_CMD                0   // 命令
#define LCD_RS_DATA               1   // 数据
#define LCD_RW_WRITE              0   // 写入
#define LCD_RW_READ               1   // 读取

/* LCD指令码 */
#define LCD_CLEAR_DISPLAY         0x01
#define LCD_RETURN_HOME           0x02
#define LCD_ENTRY_MODE_SET        0x04
#define LCD_DISPLAY_CONTROL       0x08
#define LCD_CURSOR_SHIFT          0x10
#define LCD_FUNCTION_SET          0x20
#define LCD_SET_CGRAM_ADDR        0x40
#define LCD_SET_DDRAM_ADDR        0x80

/* 显示控制标志位 */
#define LCD_DISPLAY_ON            0x04
#define LCD_CURSOR_ON             0x02
#define LCD_BLINK_ON              0x01

/* 输入模式标志位 */
#define LCD_INCREMENT             0x02
#define LCD_SHIFT                 0x01

/**
 * @brief  设置LCD的RS和RW引脚
 * @param  rs: RS引脚状态 (LCD_RS_CMD 或 LCD_RS_DATA)
 * @param  rw: RW引脚状态 (LCD_RW_WRITE 或 LCD_RW_READ)
 * @retval None
 */
void LCD_SetControl(uint8_t rs, uint8_t rw)
{
  HAL_GPIO_WritePin(LCD_RS_GPIO_PORT, LCD_RS_PIN, rs ? GPIO_PIN_SET : GPIO_PIN_RESET);
  HAL_GPIO_WritePin(LCD_RW_GPIO_PORT, LCD_RW_PIN, rw ? GPIO_PIN_SET : GPIO_PIN_RESET);
}

/**
 * @brief  向LCD发送一个脉冲信号
 * @param  None
 * @retval None
 */
void LCD_Pulse(void)
{
  HAL_GPIO_WritePin(LCD_EN_GPIO_PORT, LCD_EN_PIN, GPIO_PIN_SET);
  HAL_Delay(1);  // 保持1ms
  HAL_GPIO_WritePin(LCD_EN_GPIO_PORT, LCD_EN_PIN, GPIO_PIN_RESET);
  HAL_Delay(1);  // 等待1ms
}

/**
 * @brief  向LCD发送数据
 * @param  data: 要发送的8位数据
 * @retval None
 */
void LCD_Write(uint8_t data)
{
  // 设置数据引脚
  GPIOE->ODR = (GPIOE->ODR & 0xFF00) | data;
  
  // 发送脉冲
  LCD_Pulse();
}

/**
 * @brief  向LCD发送命令
 * @param  cmd: 要发送的命令
 * @retval None
 */
void LCD_Command(uint8_t cmd)
{
  LCD_SetControl(LCD_RS_CMD, LCD_RW_WRITE);  // RS=0, RW=0 表示写命令
  LCD_Write(cmd);  // 发送命令
  HAL_Delay(2);    // 等待执行完成
}

/**
 * @brief  向LCD发送数据
 * @param  data: 要发送的数据
 * @retval None
 */
void LCD_Data(uint8_t data)
{
  LCD_SetControl(LCD_RS_DATA, LCD_RW_WRITE);  // RS=1, RW=0 表示写数据
  LCD_Write(data);  // 发送数据
}
        `
      },
      {
        title: 'LCD初始化函数',
        content: `
          实现LCD初始化函数：
        `,
        code: `
/**
 * @brief  初始化LCD
 * @param  None
 * @retval None
 */
void LCD_Init(void)
{
  // 等待LCD上电稳定
  HAL_Delay(50);
  
  // 功能设置：8位数据模式，2行显示，5x8点阵
  LCD_Command(LCD_FUNCTION_SET | 0x18);
  HAL_Delay(5);
  
  // 显示控制：显示开，光标关，闪烁关
  LCD_Command(LCD_DISPLAY_CONTROL | LCD_DISPLAY_ON);
  HAL_Delay(5);
  
  // 清屏
  LCD_Command(LCD_CLEAR_DISPLAY);
  HAL_Delay(5);
  
  // 输入模式设置：写入后光标右移，显示不移动
  LCD_Command(LCD_ENTRY_MODE_SET | LCD_INCREMENT);
  HAL_Delay(5);
  
  // 返回光标到原点
  LCD_Command(LCD_RETURN_HOME);
  HAL_Delay(5);
}
        `
      },
      {
        title: '显示文本函数',
        content: `
          实现在LCD上显示文本的函数：
        `,
        code: `
/**
 * @brief  设置LCD光标位置
 * @param  row: 行号 (0-1)
 * @param  col: 列号 (0-15)
 * @retval None
 */
void LCD_SetCursor(uint8_t row, uint8_t col)
{
  uint8_t address;
  
  // 1602 LCD的DDRAM地址映射:
  // 第一行: 0x00-0x0F
  // 第二行: 0x40-0x4F
  address = (row == 0) ? 0x00 : 0x40;
  address += col;
  
  LCD_Command(LCD_SET_DDRAM_ADDR | address);
}

/**
 * @brief  向LCD写入字符串
 * @param  str: 要显示的字符串
 * @retval None
 */
void LCD_Print(char* str)
{
  while (*str)
  {
    LCD_Data(*str++);
  }
}

/**
 * @brief  清除LCD显示
 * @param  None
 * @retval None
 */
void LCD_Clear(void)
{
  LCD_Command(LCD_CLEAR_DISPLAY);
  HAL_Delay(2);
}

// 测试LCD显示的主函数
int main(void)
{
  /* 系统初始化 */
  HAL_Init();
  SystemClock_Config();
  
  /* GPIO初始化 */
  // 初始化控制和数据引脚（如前面所示）
  
  /* 初始化LCD */
  LCD_Init();
  
  /* 显示欢迎信息 */
  LCD_SetCursor(0, 0);
  LCD_Print("STM32H7 LCD Demo");
  LCD_SetCursor(1, 0);
  LCD_Print("Hello, World!");
  
  /* 主循环 */
  while (1)
  {
    // 可以在这里添加更多动态显示内容
    HAL_Delay(1000);
  }
}
        `
      },
      {
        title: '创建自定义字符',
        content: `
          实现创建和显示自定义字符的功能：
        `,
        code: `
/**
 * @brief  创建自定义字符
 * @param  location: 字符的CGRAM位置 (0-7)
 * @param  pattern: 字符的点阵数据 (8字节)
 * @retval None
 */
void LCD_CreateCustomChar(uint8_t location, uint8_t pattern[8])
{
  uint8_t i;
  
  // 设置CGRAM地址 (0x40-0x7F)
  LCD_Command(LCD_SET_CGRAM_ADDR | (location << 3));
  
  // 写入字符点阵数据
  for (i = 0; i < 8; i++)
  {
    LCD_Data(pattern[i]);
  }
  
  // 恢复DDRAM地址，回到显示模式
  LCD_Command(LCD_SET_DDRAM_ADDR);
}

/* 自定义字符示例 - 笑脸 */
uint8_t smile[8] = {
  0b00000,
  0b00000,
  0b01010,
  0b00000,
  0b10001,
  0b01110,
  0b00000,
  0b00000
};

/* 自定义字符示例 - 箭头 */
uint8_t arrow[8] = {
  0b00000,
  0b00100,
  0b00110,
  0b01111,
  0b00110,
  0b00100,
  0b00000,
  0b00000
};

// 在主函数中使用
int main(void)
{
  /* 系统初始化同前 */
  
  /* 创建自定义字符 */
  LCD_CreateCustomChar(0, smile);
  LCD_CreateCustomChar(1, arrow);
  
  /* 显示自定义字符 */
  LCD_Clear();
  LCD_SetCursor(0, 0);
  LCD_Print("Custom Chars:");
  LCD_SetCursor(1, 0);
  LCD_Data(0);  // 显示位置0的自定义字符(笑脸)
  LCD_Print(" and ");
  LCD_Data(1);  // 显示位置1的自定义字符(箭头)
  
  /* 主循环 */
  while (1)
  {
    HAL_Delay(1000);
  }
}
        `
      }
    ],
    challenges: [
      '实现显示滚动文本的功能，让长文本在LCD上滚动显示',
      '使用多个LED或其他控制器创建一个简单的数字时钟',
      '添加温度传感器，在LCD上实时显示温度',
      '创建一个简单的菜单系统，允许用户通过按钮导航',
      '扩展代码支持4位模式，减少所需的GPIO引脚数量'
    ],
    resourceLinks: [
      {
        title: 'HD44780 LCD控制器数据手册',
        url: 'https://www.sparkfun.com/datasheets/LCD/HD44780.pdf',
        type: 'documentation'
      },
      {
        title: '字符LCD接口教程',
        url: 'https://www.electronicshub.org/interfacing-16x2-lcd-with-8051/',
        type: 'tutorial'
      },
      {
        title: 'STM32 LCD库参考',
        url: 'https://stm32f4-discovery.net/2014/06/library-16-interfacing-hd44780-lcd-controller-with-stm32f4/',
        type: 'library'
      }
    ],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05',
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
        <div className="flex flex-wrap -mb-px">
          <button
            className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'introduction' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('introduction')}
          >
            介绍
          </button>
          <button
            className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'steps' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('steps')}
          >
            步骤
          </button>
          <button
            className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'challenges' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('challenges')}
          >
            挑战
          </button>
          <button
            className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'resources' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('resources')}
          >
            资源
          </button>
        </div>
      </div>
      
      {/* 主要内容 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {activeTab === 'introduction' && (
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">实验介绍</h2>
                <p className="whitespace-pre-line">{experiment.introduction}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">学习目标</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {experiment.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">所需材料</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {experiment.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">理论基础</h2>
                <div dangerouslySetInnerHTML={{ __html: experiment.theory }}></div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'steps' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">实验步骤</h2>
            <div className="space-y-8">
              {experiment.steps.map((step, index) => (
                <div key={index} className="border-b pb-8 last:border-b-0 last:pb-0">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    {step.title}
                  </h3>
                  {step.content && (
                    <div className="mb-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: step.content }}></div>
                  )}
                  {step.code && (
                    <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
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
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">挑战任务</h2>
            <p className="mb-4 text-gray-600">
              完成了基本实验后，尝试以下挑战来提升你的技能：
            </p>
            <ul className="space-y-4 pl-6 list-decimal">
              {experiment.challenges.map((challenge, index) => (
                <li key={index} className="text-lg">{challenge}</li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'resources' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">相关资源</h2>
            <div className="space-y-4">
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
  );
}

export default LcdInterfaceExperimentPage; 