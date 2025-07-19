/**
 * 实验目标生成工具函数
 * 
 * 从ExperimentDetailPage.tsx中拆分出来，遵循DRY原则
 * 根据实验名称和项目代码生成对应的实验目标
 */

export interface ExperimentPurpose {
  title: string;
  description: string;
}

/**
 * 基于真实实验内容的目标生成函数
 */
export const getEnhancedPurposes = (experiment: any): ExperimentPurpose[] => {
  const name = experiment.name?.toLowerCase() || '';
  const projectName = experiment.project_name?.toLowerCase() || '';

  // LED基础控制实验 (03-1)
  if (name.includes('led基础') || projectName.includes('03-1')) {
    return [
      {
        title: "掌握GPIO基础操作",
        description: "学习STM32 HAL库的GPIO配置和控制方法"
      },
      {
        title: "理解BSP架构设计",
        description: "掌握bsp_init()和bsp_loop()的标准架构模式"
      },
      {
        title: "LED硬件控制原理",
        description: "理解LED的驱动电路和GPIO输出控制原理"
      },
      {
        title: "HAL库函数应用",
        description: "熟练使用HAL_GPIO_WritePin()和HAL_GPIO_TogglePin()函数"
      }
    ];
  }

  // LED闪烁控制实验 (03-2)
  if (name.includes('led闪烁') || projectName.includes('03-2')) {
    return [
      {
        title: "定时延时控制",
        description: "掌握HAL_Delay()函数的使用和时序控制"
      },
      {
        title: "GPIO状态切换",
        description: "学习GPIO输出状态的动态切换方法"
      },
      {
        title: "循环程序设计",
        description: "理解嵌入式系统的主循环程序结构"
      },
      {
        title: "视觉效果实现",
        description: "通过编程实现LED闪烁的视觉效果"
      }
    ];
  }

  // LED跑马灯实验 (03-3)
  if (name.includes('跑马灯') || projectName.includes('03-3')) {
    return [
      {
        title: "多GPIO协调控制",
        description: "学习同时控制多个GPIO端口的方法"
      },
      {
        title: "数组与循环算法",
        description: "掌握数组存储GPIO信息和循环控制算法"
      },
      {
        title: "时序控制技术",
        description: "实现LED依次点亮的时序控制"
      },
      {
        title: "动态效果编程",
        description: "通过编程实现动态的跑马灯效果"
      }
    ];
  }

  // LED呼吸灯实验 (03-4)
  if (name.includes('呼吸灯') || projectName.includes('03-4')) {
    return [
      {
        title: "PWM原理与应用",
        description: "深入理解脉宽调制(PWM)的工作原理"
      },
      {
        title: "定时器PWM配置",
        description: "掌握STM32定时器PWM模式的配置方法"
      },
      {
        title: "占空比动态控制",
        description: "学习通过改变占空比实现亮度控制"
      },
      {
        title: "模拟信号生成",
        description: "理解数字信号模拟模拟量输出的原理"
      }
    ];
  }

  // 按键扫描实验 (03-5)
  if (name.includes('按键扫描') || projectName.includes('03-5')) {
    return [
      {
        title: "GPIO输入模式配置",
        description: "学习GPIO输入模式和上拉/下拉电阻配置"
      },
      {
        title: "按键状态检测",
        description: "掌握按键状态的读取和判断方法"
      },
      {
        title: "软件消抖技术",
        description: "理解和实现按键消抖的软件算法"
      },
      {
        title: "轮询检测机制",
        description: "学习主循环中的轮询检测程序设计"
      }
    ];
  }

  // 按键中断实验 (03-6)
  if (name.includes('按键中断') || projectName.includes('03-6')) {
    return [
      {
        title: "外部中断配置",
        description: "掌握STM32外部中断的配置和使能方法"
      },
      {
        title: "中断服务程序设计",
        description: "学习HAL_GPIO_EXTI_Callback()中断回调函数的编写"
      },
      {
        title: "中断响应机制",
        description: "理解中断的触发条件和响应过程"
      },
      {
        title: "实时响应系统",
        description: "体验中断方式相比轮询方式的实时性优势"
      }
    ];
  }

  // 定时器基础实验 (04-1)
  if (name.includes('定时器基础') || projectName.includes('04-1')) {
    return [
      {
        title: "定时器工作原理",
        description: "深入理解STM32定时器的内部结构和计数原理"
      },
      {
        title: "定时器配置方法",
        description: "掌握定时器的预分频器和自动重装载值设置"
      },
      {
        title: "定时器中断处理",
        description: "学习定时器中断的配置和中断服务程序编写"
      },
      {
        title: "精确定时控制",
        description: "实现精确的时间间隔控制和周期性任务"
      }
    ];
  }

  // 定时器PWM实验 (05-1)
  if (name.includes('定时器pwm') || name.includes('timpwm') || projectName.includes('05-1')) {
    return [
      {
        title: "PWM波形生成原理",
        description: "理解PWM波形的生成机制和参数控制"
      },
      {
        title: "定时器PWM模式配置",
        description: "掌握定时器PWM模式的详细配置方法"
      },
      {
        title: "占空比动态调节",
        description: "学习通过__HAL_TIM_SET_COMPARE()动态调节占空比"
      },
      {
        title: "PWM实际应用",
        description: "理解PWM在电机控制、LED调光等方面的应用"
      }
    ];
  }

  // 串口通信实验 (06-1)
  if (name.includes('串口通信') && !name.includes('中断') || projectName.includes('06-1')) {
    return [
      {
        title: "UART通信原理",
        description: "理解UART串口通信的协议和数据传输格式"
      },
      {
        title: "串口参数配置",
        description: "掌握波特率、数据位、停止位等参数的设置"
      },
      {
        title: "数据收发控制",
        description: "学习HAL_UART_Transmit()和HAL_UART_Receive()的使用"
      },
      {
        title: "通信调试技术",
        description: "掌握使用串口调试助手进行通信测试的方法"
      }
    ];
  }

  // 串口中断收发实验 (06-2)
  if (name.includes('串口') && name.includes('中断') || projectName.includes('06-2')) {
    return [
      {
        title: "串口中断机制",
        description: "理解串口接收中断和发送中断的工作机制"
      },
      {
        title: "中断收发配置",
        description: "掌握HAL_UART_Receive_IT()等中断函数的使用"
      },
      {
        title: "数据缓冲管理",
        description: "学习接收缓冲区的设计和数据处理方法"
      },
      {
        title: "高效通信处理",
        description: "体验中断方式相比轮询方式的效率优势"
      }
    ];
  }

  // ADC模数转换实验 (07-1)
  if (name.includes('模数转换') && !name.includes('气体') || projectName.includes('07-1')) {
    return [
      {
        title: "ADC转换原理",
        description: "理解模数转换的基本原理和量化过程"
      },
      {
        title: "ADC配置方法",
        description: "掌握STM32 ADC的配置和校准方法"
      },
      {
        title: "模拟信号采集",
        description: "学习模拟电压信号的采集和数字化处理"
      },
      {
        title: "数据处理技术",
        description: "掌握ADC数据的滤波和转换计算方法"
      }
    ];
  }

  // 默认返回LED基础控制的目标
  return [
    {
      title: "掌握GPIO基础操作",
      description: "学习STM32 HAL库的GPIO配置和控制方法"
    },
    {
      title: "理解BSP架构设计",
      description: "掌握bsp_init()和bsp_loop()的标准架构模式"
    },
    {
      title: "LED硬件控制原理",
      description: "理解LED的驱动电路和GPIO输出控制原理"
    },
    {
      title: "HAL库函数应用",
      description: "熟练使用HAL_GPIO_WritePin()和HAL_GPIO_TogglePin()函数"
    }
  ];
};
