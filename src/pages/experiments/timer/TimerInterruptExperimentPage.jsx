import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// 模拟单个定时中断实验的详细数据
const getExperimentData = (id) => {
  // 正常通过后端API获取数据，这里使用静态数据模拟
  const experiments = {
    'basic-timer-interrupt': {
      id: 'basic-timer-interrupt',
      title: '基础定时器中断',
      description: '学习配置STM32系列的基本定时器，使用中断机制实现精确定时控制，掌握中断优先级设置和中断处理程序编写。',
      difficulty: 'beginner',
      thumbnail: '/images/experiments/basic-timer.jpg',
      introduction: `
        定时器中断是嵌入式系统中最常用的功能之一，通过定时器中断可以实现精确的定时控制和周期性任务执行。
        本实验将教你如何配置STM32系列的基本定时器（TIM6/TIM7），并使用中断机制实现精确的定时任务。
      `,
      objectives: [
        '理解STM32系列定时器的基本结构和工作原理',
        '学习配置定时器参数（预分频、自动重载值）',
        '掌握定时器中断配置和NVIC优先级设置',
        '实现LED周期性闪烁的精确定时控制',
        '理解中断服务程序的编写规范'
      ],
      materials: [
        'STM32系列开发板（如STM32F4、STM32F1或STM32G0系列）',
        'LED灯（用于显示定时器触发效果）',
        '限流电阻（220欧-1k欧）',
        '连接导线',
        'USB线（连接开发板与电脑）'
      ],
      theory: `
        <h4>定时器基础知识</h4>
        <p>
          STM32系列的定时器是一种多功能外设，可用于精确定时、PWM生成、输入捕获等多种应用。
          基本定时器(TIM6/TIM7)结构相对简单，主要用于定时功能，包含以下关键部分：
        </p>
        <ul>
          <li>计数器（CNT）：16位计数寄存器，随时钟计数</li>
          <li>预分频器（PSC）：可将输入时钟频率分频</li>
          <li>自动重载寄存器（ARR）：定义计数器的重载值，决定计数周期</li>
          <li>中断/DMA请求：可在计数器溢出时产生中断或DMA请求</li>
        </ul>
        
        <h4>定时计算原理</h4>
        <p>
          定时器的计时周期计算公式为：
        </p>
        <pre>
          定时周期 = (PSC + 1) × (ARR + 1) / 定时器时钟频率
        </pre>
        <p>
          例如，假设定时器时钟频率为72MHz（STM32F1系列常见频率），要实现1秒定时：
          可以设置PSC=7199，ARR=9999，则定时周期 = 7200 × 10000 / 72000000 = 1秒
        </p>
        
        <h4>中断控制器（NVIC）</h4>
        <p>
          STM32系列使用嵌套向量中断控制器(NVIC)管理中断。关键配置包括：
        </p>
        <ul>
          <li>优先级组：决定抢占优先级和子优先级的位分配</li>
          <li>抢占优先级：决定中断是否可以打断其他中断</li>
          <li>子优先级：在相同抢占优先级下决定中断顺序</li>
          <li>中断使能：启用特定外设的中断请求</li>
        </ul>
      `,
      steps: [
        {
          title: '配置时钟和GPIO',
          content: `
            <ol>
              <li>使能TIM6时钟和GPIOE时钟</li>
              <li>配置GPIO引脚为输出模式（用于LED指示）</li>
            </ol>
          `,
          code: `
// 使能TIM6时钟和GPIO时钟（以STM32F1为例）
RCC->APB1ENR |= RCC_APB1ENR_TIM6EN;
RCC->APB2ENR |= RCC_APB2ENR_IOPAEN;  // GPIOA时钟使能

// 配置PA1为输出模式
GPIOA->CRL &= ~(GPIO_CRL_MODE1 | GPIO_CRL_CNF1);
GPIOA->CRL |= GPIO_CRL_MODE1_0 | GPIO_CRL_MODE1_1;  // 输出模式，最大速度50MHz
          `
        },
        {
          title: '配置定时器基本参数',
          content: `
            配置TIM6的预分频值、自动重载值和更新中断使能：
          `,
          code: `
// 设置预分频值和自动重载值，实现1秒定时
// 假设定时器时钟频率为72MHz（STM32F1系列常见频率）
TIM6->PSC = 7199;   // 预分频值为7200-1
TIM6->ARR = 9999;   // 自动重载值为10000-1

// 清除更新中断标志
TIM6->SR &= ~TIM_SR_UIF;

// 使能更新中断
TIM6->DIER |= TIM_DIER_UIE;
          `
        },
        {
          title: '配置NVIC中断',
          content: `
            配置TIM6中断的优先级并使能中断：
          `,
          code: `
// 设置TIM6中断优先级
NVIC_SetPriority(TIM6_IRQn, NVIC_EncodePriority(NVIC_GetPriorityGrouping(), 1, 0));

// 使能TIM6中断
NVIC_EnableIRQ(TIM6_IRQn);
          `
        },
        {
          title: '启动定时器',
          content: `
            启动TIM6定时器：
          `,
          code: `
// 开启TIM6定时器
TIM6->CR1 |= TIM_CR1_CEN;
          `
        },
        {
          title: '编写中断服务函数',
          content: `
            实现TIM6中断服务函数，在每次中断中翻转LED状态：
          `,
          code: `
// TIM6中断服务函数（STM32F1系列）
void TIM6_IRQHandler(void)
{
  // 检查是否是更新中断
  if (TIM6->SR & TIM_SR_UIF)
  {
    // 清除中断标志
    TIM6->SR &= ~TIM_SR_UIF;
    
    // 翻转LED状态（PA1引脚）
    GPIOA->ODR ^= GPIO_ODR_ODR1;
  }
}
          `
        },
        {
          title: '完整示例代码',
          content: `
            下面是一个完整的定时器中断控制LED闪烁的示例：
          `,
          code: `
#include "stm32f10x.h"  // 以STM32F1系列为例

void SystemClock_Config(void);
void GPIO_Config(void);
void TIM6_Config(void);

int main(void)
{
  // 系统时钟配置（假设已经配置为72MHz）
  SystemClock_Config();
  
  // GPIO配置
  GPIO_Config();
  
  // TIM6配置
  TIM6_Config();
  
  while (1)
  {
    // 主循环中不需要做任何事情，一切由定时器中断处理
  }
}

void GPIO_Config(void)
{
  // 使能GPIOA时钟
  RCC->APB2ENR |= RCC_APB2ENR_IOPAEN;
  
  // 配置PA1为输出模式
  GPIOA->CRL &= ~(GPIO_CRL_MODE1 | GPIO_CRL_CNF1);
  GPIOA->CRL |= GPIO_CRL_MODE1_0 | GPIO_CRL_MODE1_1;  // 输出模式，最大速度50MHz
  
  // 初始状态设为低电平
  GPIOA->BSRR = GPIO_BSRR_BR1;
}

void TIM6_Config(void)
{
  // 使能TIM6时钟
  RCC->APB1ENR |= RCC_APB1ENR_TIM6EN;
  
  // 设置预分频值和自动重载值，实现1秒定时
  // 假设定时器时钟频率为72MHz
  TIM6->PSC = 7199;   // 预分频值为7200-1
  TIM6->ARR = 9999;   // 自动重载值为10000-1
  
  // 清除更新中断标志
  TIM6->SR &= ~TIM_SR_UIF;
  
  // 使能更新中断
  TIM6->DIER |= TIM_DIER_UIE;
  
  // 设置TIM6中断优先级
  NVIC_SetPriority(TIM6_IRQn, NVIC_EncodePriority(NVIC_GetPriorityGrouping(), 1, 0));
  
  // 使能TIM6中断
  NVIC_EnableIRQ(TIM6_IRQn);
  
  // 开启TIM6定时器
  TIM6->CR1 |= TIM_CR1_CEN;
}

// TIM6中断服务函数
void TIM6_IRQHandler(void)
{
  // 检查是否是更新中断
  if (TIM6->SR & TIM_SR_UIF)
  {
    // 清除中断标志
    TIM6->SR &= ~TIM_SR_UIF;
    
    // 翻转LED状态（PA1引脚）
    GPIOA->ODR ^= GPIO_ODR_ODR1;
  }
}
          `
        }
      ],
      challenges: [
        '修改定时器参数实现不同的闪烁频率（如0.5秒、2秒）',
        '使用两个定时器同时控制两个不同LED以不同频率闪烁',
        '使用定时器实现呼吸灯效果（需要PWM功能，可能需要使用高级定时器）',
        '实现按钮控制定时器启动和停止的功能'
      ],
      resourceLinks: [
        {
          title: 'STM32系列参考手册 - 定时器章节',
          url: 'https://www.st.com/resource/en/reference_manual/dm00031020-stm32f405-415-stm32f407-417-stm32f427-437-and-stm32f429-439-advanced-arm-based-32-bit-mcus-stmicroelectronics.pdf',
          type: 'documentation'
        },
        {
          title: 'STM32 定时器编程指南',
          url: 'https://www.st.com/resource/en/application_note/an4776-general-purpose-timer-cookbook-for-stm32-microcontrollers-stmicroelectronics.pdf',
          type: 'tutorial'
        }
      ],
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
    },
    // 可以添加更多实验...
  };
  
  return experiments[id] || null;
};

function TimerInterruptExperimentPage() {
  const { id } = useParams();
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('introduction');
  
  useEffect(() => {
    // 模拟API调用
    setLoading(true);
    setTimeout(() => {
      const data = getExperimentData(id);
      setExperiment(data);
      setLoading(false);
    }, 500);
  }, [id]);
  
  // 获取难度标签
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">实验未找到</h2>
        <p className="text-gray-600 mb-6">找不到ID为 "{id}" 的定时中断实验</p>
        <Link
          to="/timer/experiments"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          返回定时中断实验列表
        </Link>
      </div>
    );
  }

  // 难度标签
  const badge = getDifficultyBadge(experiment.difficulty);

  return (
    <div className="py-8">
      {/* 实验标题和基本信息 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to="/timer/experiments"
            className="text-primary-600 hover:underline mr-2"
          >
            定时中断实验
          </Link>
          <svg className="w-4 h-4 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span className="text-gray-600">{experiment.title}</span>
        </div>
        
        <h1 className="text-3xl font-bold">{experiment.title}</h1>
        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
            {badge.text}
          </span>
          <span className="text-gray-500 text-sm ml-4">最后更新: {experiment.updatedAt}</span>
        </div>
      </div>
      
      {/* 实验内容和导航 */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧导航 */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-20">
            <nav className="space-y-1">
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'introduction' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('introduction')}
              >
                介绍
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'objectives' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('objectives')}
              >
                学习目标
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'materials' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('materials')}
              >
                所需材料
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'theory' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('theory')}
              >
                理论基础
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'steps' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('steps')}
              >
                实验步骤
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'challenges' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('challenges')}
              >
                挑战任务
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'resources' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('resources')}
              >
                相关资源
              </button>
            </nav>
          </div>
        </div>
        
        {/* 右侧内容 */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* 内容展示 */}
            {activeTab === 'introduction' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">实验介绍</h2>
                <div className="mb-6 h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={experiment.thumbnail} 
                    alt={experiment.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = `
                        <div class="flex items-center justify-center h-full">
                          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                </div>
                <p className="text-gray-700 whitespace-pre-line">{experiment.introduction}</p>
              </div>
            )}
            
            {activeTab === 'objectives' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">学习目标</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {experiment.objectives.map((objective, index) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'materials' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">所需材料</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {experiment.materials.map((material, index) => (
                    <li key={index} className="text-gray-700">{material}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'theory' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">理论基础</h2>
                <div 
                  className="text-gray-700 theory-content"
                  dangerouslySetInnerHTML={{ __html: experiment.theory }}
                />
              </div>
            )}
            
            {activeTab === 'steps' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">实验步骤</h2>
                <div className="space-y-8">
                  {experiment.steps.map((step, index) => (
                    <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-xl font-semibold mb-3">
                        <span className="inline-block w-8 h-8 bg-primary-600 text-white rounded-full text-center leading-8 mr-2">
                          {index + 1}
                        </span>
                        {step.title}
                      </h3>
                      <div 
                        className="text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{ __html: step.content }}
                      />
                      {step.code && (
                        <div className="bg-gray-800 rounded-md overflow-hidden">
                          <pre className="p-4 text-gray-100 overflow-x-auto">
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
                <h2 className="text-2xl font-bold mb-4">挑战任务</h2>
                <p className="text-gray-700 mb-4">完成基本实验后，尝试以下挑战以加深对定时器中断的理解：</p>
                <ul className="list-disc pl-5 space-y-2">
                  {experiment.challenges.map((challenge, index) => (
                    <li key={index} className="text-gray-700">{challenge}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'resources' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">相关资源</h2>
                <div className="space-y-4">
                  {experiment.resourceLinks.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3">
                        {resource.type === 'documentation' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{resource.title}</h3>
                        <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 底部导航 */}
          <div className="mt-8 flex justify-between">
            <Link
              to="/timer/experiments"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              返回实验列表
            </Link>
            
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => window.open(`/code-generator?preset=timer_interrupt&ref=${experiment.id}`, '_blank')}
            >
              生成实验代码
              <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerInterruptExperimentPage; 