/**
 * 实验原理生成工具函数
 * 
 * 从ExperimentDetailPage.tsx中拆分出来，遵循DRY原则
 * 根据实验名称和项目代码生成对应的实验原理
 */

export interface ExperimentPrinciple {
  title: string;
  content: string;
}

/**
 * 基于真实实验和网络资料的原理生成函数
 */
export const getExperimentPrinciples = (experiment: any): ExperimentPrinciple[] => {
  const name = experiment.name?.toLowerCase() || '';
  const projectName = experiment.project_name?.toLowerCase() || '';

  // LED基础控制实验原理
  if (name.includes('led基础') || projectName.includes('03-1')) {
    return [
      {
        title: "GPIO工作原理",
        content: "GPIO（General Purpose Input/Output）是STM32的通用输入输出端口。STM32F103的GPIO具有8种工作模式：输入浮空、输入上拉、输入下拉、模拟输入、开漏输出、推挽输出、复用开漏、复用推挽。每个GPIO端口都有配置寄存器（CRL/CRH）、数据寄存器（IDR/ODR）和位设置/复位寄存器（BSRR）。"
      },
      {
        title: "LED驱动电路原理",
        content: "LED（发光二极管）具有单向导电性，只有在正向偏置且电流达到一定值时才会发光。STM32的GPIO输出电流能力有限（最大25mA），因此需要合理设计驱动电路。常见的驱动方式有：1）GPIO直接驱动（适用于小功率LED）；2）通过三极管放大驱动（适用于大功率LED）。"
      },
      {
        title: "电流限制与保护",
        content: "为保护LED和MCU，必须使用限流电阻。电阻值计算公式：R = (VCC - VF) / IF，其中VCC为供电电压（3.3V），VF为LED正向压降（约2V），IF为LED工作电流（通常5-20mA）。因此限流电阻通常选择220Ω-1kΩ。"
      }
    ];
  }

  // LED闪烁控制实验原理 (03-2)
  if (name.includes('led闪烁') || name.includes('闪烁') || projectName.includes('03-2')) {
    return [
      {
        title: "延时控制原理",
        content: "HAL_Delay()函数是STM32 HAL库提供的毫秒级延时函数，基于SysTick系统定时器实现。SysTick是ARM Cortex-M内核的24位递减计数器，通常配置为1ms中断一次，为系统提供时基。HAL_Delay()通过监控系统时基计数器实现精确的毫秒延时。"
      },
      {
        title: "GPIO状态切换机制",
        content: "LED闪烁通过周期性地改变GPIO输出状态实现。使用HAL_GPIO_WritePin()函数可以直接设置GPIO输出高电平或低电平。GPIO_PIN_SET表示输出高电平(3.3V)，GPIO_PIN_RESET表示输出低电平(0V)。通过交替设置这两种状态并加入适当延时，可以实现LED的闪烁效果。"
      },
      {
        title: "主循环程序结构",
        content: "嵌入式系统通常采用超级循环(Super Loop)架构，即在main函数中包含一个无限循环while(1)。在这个循环中依次执行各种任务，包括GPIO控制、延时等。这种结构简单直观，适合于简单的控制任务，但不适合复杂的实时系统。"
      }
    ];
  }

  // LED跑马灯实验原理 (03-3)
  if (name.includes('跑马灯') || name.includes('banner') || projectName.includes('03-3')) {
    return [
      {
        title: "多GPIO协调控制原理",
        content: "跑马灯效果需要控制多个LED，这要求同时管理多个GPIO端口。STM32的GPIO可以按端口批量配置，使用GPIO_InitStruct.Pin可以同时配置多个引脚。通过位或运算(|)可以将多个引脚组合在一起，实现批量初始化，提高代码效率。"
      },
      {
        title: "数组与循环算法",
        content: "使用数组存储LED对应的GPIO引脚号，可以简化代码结构。通过for循环遍历数组，依次控制每个LED的亮灭。这种方法具有良好的可扩展性，增加或减少LED数量只需修改数组内容和循环次数，无需改变核心算法。"
      },
      {
        title: "时序控制与视觉效果",
        content: "跑马灯的视觉效果取决于LED切换的时序。延时时间过短会导致闪烁过快，人眼难以分辨；延时时间过长则效果不够流畅。通常选择100-500ms的延时时间可以获得较好的视觉效果。可以通过调整HAL_Delay()的参数来优化显示效果。"
      }
    ];
  }

  // LED呼吸灯实验原理 (03-4)
  if (name.includes('呼吸灯') || projectName.includes('03-4')) {
    return [
      {
        title: "PWM脉宽调制原理",
        content: "PWM（Pulse Width Modulation）是一种通过改变脉冲宽度来控制输出功率的技术。PWM信号的关键参数包括：频率（周期的倒数）和占空比（高电平时间占整个周期的比例）。通过改变占空比，可以控制输出的平均电压，从而实现LED亮度的连续调节。"
      },
      {
        title: "STM32定时器PWM工作机制",
        content: "STM32F103的定时器可以产生PWM信号。定时器计数器从0开始递增，当计数值小于比较值（CCR）时输出高电平，当计数值大于等于比较值时输出低电平。占空比 = CCR / (ARR + 1)，其中ARR为自动重装载值。通过动态修改CCR值，可以实时改变占空比。"
      },
      {
        title: "人眼视觉暂留效应",
        content: "人眼具有视觉暂留特性，当PWM频率高于50Hz时，人眼无法分辨LED的闪烁，而是感受到连续的亮度变化。通过周期性地改变PWM占空比（从0%到100%再到0%），可以实现LED亮度的渐变效果，形成呼吸灯效果。"
      }
    ];
  }

  // 按键扫描实验原理 (03-5)
  if (name.includes('按键扫描') || name.includes('keyscan') || projectName.includes('03-5')) {
    return [
      {
        title: "GPIO输入模式原理",
        content: "STM32的GPIO可以配置为输入模式，用于读取外部信号状态。输入模式包括浮空输入、上拉输入和下拉输入三种。按键通常使用上拉输入模式，即GPIO内部连接上拉电阻到VCC，按键按下时GPIO读取到低电平，松开时读取到高电平。"
      },
      {
        title: "按键扫描算法",
        content: "按键扫描是通过软件周期性地读取GPIO状态来检测按键动作的方法。主循环中使用HAL_GPIO_ReadPin()函数读取按键状态，通过比较前后两次读取的结果来判断按键是否被按下或释放。这种方法简单可靠，适合按键数量较少的应用。"
      },
      {
        title: "软件消抖技术",
        content: "机械按键在按下和释放瞬间会产生机械抖动，导致GPIO状态在短时间内多次变化。软件消抖通过延时确认的方法解决这个问题：检测到按键状态变化后，延时10-50ms再次检测，如果状态保持不变则确认为有效按键动作。"
      }
    ];
  }

  // 按键中断实验原理 (03-6)
  if (name.includes('按键中断') || projectName.includes('03-6')) {
    return [
      {
        title: "外部中断EXTI系统",
        content: "STM32F103的外部中断系统由EXTI（External Interrupt）控制器管理。EXTI支持19个外部中断/事件请求，包括16个GPIO中断线（EXTI0-EXTI15）和3个内部中断线。每个GPIO引脚都可以配置为中断源，但同一时刻每条EXTI线只能连接一个GPIO端口的对应引脚。"
      },
      {
        title: "中断触发机制",
        content: "外部中断可以配置为上升沿触发、下降沿触发或双边沿触发。当检测到指定的边沿变化时，EXTI会产生中断请求。中断请求首先到达EXTI的挂起寄存器（EXTI_PR），然后通过NVIC（嵌套向量中断控制器）进行优先级管理和中断响应。"
      },
      {
        title: "按键消抖原理",
        content: "机械按键在按下和释放过程中会产生抖动，导致多次触发中断。消抖方法包括：1）硬件消抖：使用RC滤波电路或施密特触发器；2）软件消抖：在中断服务程序中加入延时判断，或使用状态机进行按键状态管理。软件消抖通常在检测到按键变化后延时10-50ms再次检测。"
      }
    ];
  }

  // 串口中断收发实验原理 (06-2)
  if (name.includes('串口') && name.includes('中断') || projectName.includes('06-2')) {
    return [
      {
        title: "串口中断机制",
        content: "STM32的UART支持多种中断：接收中断(RXNE)、发送中断(TXE)、传输完成中断(TC)、空闲中断(IDLE)等。接收中断在接收数据寄存器非空时触发，发送中断在发送数据寄存器空时触发。通过UART_CR1寄存器的相应位使能中断，通过NVIC配置中断优先级。"
      },
      {
        title: "中断收发缓冲机制",
        content: "中断方式需要设计接收和发送缓冲区来管理数据流。接收缓冲区存储从中断中接收的数据，发送缓冲区存储待发送的数据。使用环形缓冲区可以有效管理数据，避免数据丢失。缓冲区需要考虑读写指针、满空判断、数据同步等问题。"
      },
      {
        title: "中断优先级与实时性",
        content: "串口中断通常设置较高优先级以保证数据不丢失。UART数据寄存器只能存储一个字符，必须在下一个字符到达前读取，否则会发生溢出错误。中断服务程序应尽量简短，只进行必要的数据读写操作，复杂处理放在主循环中进行。"
      }
    ];
  }

  // 串口通信实验原理 (06-1)
  if (name.includes('串口通信') && !name.includes('中断') || projectName.includes('06-1')) {
    return [
      {
        title: "UART异步通信原理",
        content: "UART（Universal Asynchronous Receiver/Transmitter）是一种异步串行通信协议。异步通信不需要时钟信号同步，通信双方约定相同的波特率、数据位数、停止位数和校验方式。数据传输以字符帧为单位，每帧包含起始位（0）、数据位（5-8位）、可选校验位和停止位（1-2位）。"
      },
      {
        title: "波特率与时序",
        content: "波特率表示每秒传输的位数（bps）。常用波特率有9600、38400、115200等。传输1位数据的时间 = 1/波特率。例如115200bps时，传输1位需要约8.68μs。STM32的UART波特率由波特率寄存器（BRR）控制，计算公式：BRR = PCLK / (16 × 波特率)。"
      },
      {
        title: "数据帧格式与校验",
        content: "标准UART帧格式：起始位（1位，逻辑0）+ 数据位（5-8位，LSB先传）+ 校验位（可选，奇偶校验）+ 停止位（1-2位，逻辑1）。校验位用于检测传输错误：奇校验时数据位和校验位中1的个数为奇数，偶校验时为偶数。无校验时省略校验位。"
      }
    ];
  }

  // 定时器PWM实验原理 (05-1)
  if (name.includes('定时器pwm') || name.includes('timpwm') || projectName.includes('05-1')) {
    return [
      {
        title: "PWM波形生成原理",
        content: "PWM（Pulse Width Modulation）是一种通过改变脉冲宽度来控制输出功率的技术。STM32定时器的PWM模式通过比较计数器值与比较寄存器值来生成PWM波形。当计数器值小于比较值时输出有效电平，大于比较值时输出无效电平。占空比 = 比较值 / (自动重装载值 + 1)。"
      },
      {
        title: "定时器PWM模式配置",
        content: "STM32定时器支持PWM模式1和PWM模式2。PWM模式1：当计数器<比较值时输出有效电平；PWM模式2：当计数器>比较值时输出有效电平。通过配置TIMx_CCMR寄存器的OCxM位选择PWM模式，通过TIMx_CCER寄存器的CCxP位设置输出极性。"
      },
      {
        title: "PWM频率与分辨率",
        content: "PWM频率 = 定时器时钟频率 / ((预分频值+1) × (自动重装载值+1))。PWM分辨率 = log2(自动重装载值+1)位。例如：72MHz时钟，预分频71，重装载999，PWM频率 = 72MHz/(72×1000) = 1kHz，分辨率 = log2(1000) ≈ 10位。频率与分辨率成反比关系。"
      }
    ];
  }

  // 定时器基础实验原理 (04-1)
  if (name.includes('定时器基础') || projectName.includes('04-1')) {
    return [
      {
        title: "定时器工作原理",
        content: "STM32F103的定时器是基于计数器的时基单元，包括预分频器、计数器和自动重装载寄存器。预分频器将输入时钟分频，计数器在每个时钟周期递增或递减，当计数值达到自动重装载值时产生更新事件。定时器可以工作在多种模式：基本定时、输入捕获、输出比较、PWM等。"
      },
      {
        title: "定时器中断机制",
        content: "定时器可以产生多种中断：更新中断（计数器溢出）、比较中断、捕获中断等。更新中断是最常用的，当计数器从自动重装载值溢出到0时触发。中断频率 = 定时器时钟频率 / ((预分频值+1) × (自动重装载值+1))。通过NVIC可以设置中断优先级和使能。"
      },
      {
        title: "精确定时计算",
        content: "定时时间 = (预分频值+1) × (自动重装载值+1) / 定时器时钟频率。例如：72MHz时钟，预分频7199，重装载9999，定时时间 = 7200 × 10000 / 72000000 = 1秒。合理设置这两个参数可以实现从微秒到秒级的精确定时。"
      }
    ];
  }

  // ADC模数转换实验原理 (07-1)
  if (name.includes('模数转换') && !name.includes('气体') || name.includes('adc') && !name.includes('mq2') || projectName.includes('07-1')) {
    return [
      {
        title: "ADC转换原理",
        content: "ADC（Analog-to-Digital Converter）将连续的模拟信号转换为离散的数字信号。STM32F103的ADC采用逐次逼近型（SAR）结构，具有12位分辨率。转换过程：采样保持→逐次比较→数字输出。转换精度取决于参考电压和分辨率：LSB = VREF / 2^n，其中n为分辨率位数。"
      },
      {
        title: "ADC配置与校准",
        content: "STM32 ADC需要配置转换模式（单次/连续）、触发源（软件/硬件）、采样时间等参数。采样时间影响转换精度和速度：时间越长精度越高但速度越慢。ADC校准可以消除内部电容和电阻的影响，提高转换精度。校准在ADC使能后、开始转换前进行。"
      },
      {
        title: "多通道与DMA传输",
        content: "STM32 ADC支持多达16个外部通道和2个内部通道（温度传感器、内部参考电压）。可以配置规则组和注入组进行多通道转换。结合DMA可以实现无CPU干预的连续采集，DMA将转换结果直接传输到内存，提高系统效率。"
      }
    ];
  }

  // ADC气体传感器实验原理 (07-2)
  if (name.includes('气体传感器') || name.includes('adcmq2') || projectName.includes('07-2')) {
    return [
      {
        title: "MQ2气体传感器原理",
        content: "MQ2是半导体气体传感器，基于SnO2材料在高温下遇到气体时电导率发生变化的原理。传感器内部有加热丝和敏感元件，加热丝提供工作温度（约300°C），敏感元件检测气体浓度。当检测气体浓度增加时，传感器电阻下降，输出电压上升。"
      },
      {
        title: "传感器信号调理",
        content: "MQ2传感器输出为模拟电压信号，需要通过分压电路转换为适合ADC的电压范围（0-3.3V）。典型电路：传感器与负载电阻串联分压，输出电压 = VCC × RL / (RS + RL)，其中RS为传感器电阻，RL为负载电阻。选择合适的RL值可以获得最佳的线性度和灵敏度。"
      },
      {
        title: "浓度计算与标定",
        content: "传感器输出电压与气体浓度呈对数关系：RS/R0 = A × (ppm)^B，其中R0为清洁空气中的电阻值，A和B为标定常数。实际应用中需要进行多点标定，建立电压-浓度对应关系。还需考虑温湿度补偿、老化补偿等因素。"
      }
    ];
  }

  // DAC电压输出实验原理 (08-1)
  if (name.includes('dac电压输出') || projectName.includes('08-1')) {
    return [
      {
        title: "DAC转换原理",
        content: "DAC（Digital-to-Analog Converter）将数字信号转换为模拟信号。STM32F103的DAC采用R-2R电阻网络结构，具有12位分辨率。输出电压 = (数字值 / 4095) × VREF，其中VREF通常为3.3V。DAC输出需要经过输出缓冲器，可以直接驱动负载。"
      },
      {
        title: "DAC配置模式",
        content: "STM32 DAC支持多种触发模式：软件触发、定时器触发、外部触发等。输出缓冲器可以使能或禁用：使能时输出阻抗低但功耗大，禁用时功耗低但输出阻抗高。DAC还支持噪声生成和三角波生成功能，可用于测试和信号生成。"
      },
      {
        title: "输出特性与应用",
        content: "DAC输出电压范围为0到VREF，输出阻抗约15kΩ（缓冲器禁用）或1Ω（缓冲器使能）。建立时间约3μs，适合中低频信号生成。应用包括：电压基准、音频信号生成、波形发生器、模拟控制信号等。输出端通常需要加滤波电路以减少数字噪声。"
      }
    ];
  }

  // DAC波形生成实验原理 (08-2)
  if (name.includes('dac波形') || name.includes('dacwave') || projectName.includes('08-2')) {
    return [
      {
        title: "数字波形生成算法",
        content: "波形生成基于数学函数的数字化实现。正弦波：y = A × sin(2πft + φ) + offset；三角波：通过线性递增递减实现；方波：在高低电平间切换。采样频率必须满足奈奎斯特定理：fs ≥ 2fmax。波形数据可以预先计算存储在查找表中，或实时计算生成。"
      },
      {
        title: "DMA连续输出",
        content: "使用DMA可以实现连续的波形输出而无需CPU干预。配置定时器作为DAC触发源，DMA将波形数据从内存传输到DAC数据寄存器。DMA支持循环模式，可以连续输出周期性波形。输出频率 = 定时器频率 / 波形采样点数。"
      },
      {
        title: "波形参数控制",
        content: "波形的幅度通过调整数据值范围控制，频率通过改变定时器触发频率或采样点数控制，相位通过调整起始采样点控制。多通道DAC可以生成相位差波形。波形质量取决于采样率、分辨率和滤波电路设计。"
      }
    ];
  }

  // LCD显示实验原理 (13-1)
  if (name.includes('lcd显示') || name.includes('lcd') || projectName.includes('13-1')) {
    return [
      {
        title: "LCD液晶显示原理",
        content: "LCD（Liquid Crystal Display）基于液晶分子在电场作用下改变排列方向的原理。字符型LCD通常使用HD44780控制器，支持5×8点阵字符显示。LCD需要多条控制线：数据线（D0-D7）、使能信号（E）、读写选择（R/W）、寄存器选择（RS）。通过时序控制可以实现字符和自定义图形的显示。"
      },
      {
        title: "LCD接口时序控制",
        content: "LCD操作需要严格的时序控制。写操作时序：设置RS和R/W→设置数据→拉高E信号→保持一定时间→拉低E信号。读操作类似但需要在E信号高电平期间读取数据。不同操作有不同的执行时间：清屏需要1.64ms，回到首行需要1.64ms，写字符需要43μs。"
      },
      {
        title: "字符编码与自定义字符",
        content: "LCD支持ASCII字符集和自定义字符。字符代码0x20-0x7F对应标准ASCII字符，0x00-0x07为用户自定义字符。自定义字符通过CGRAM（Character Generator RAM）实现，每个字符占用8字节，定义5×8点阵图案。可以创建特殊符号、汉字、图标等。"
      }
    ];
  }

  // 智能环境监测系统实验原理 (09-1)
  if (name.includes('智能环境监测') || name.includes('smartecowatch') || projectName.includes('09-1')) {
    return [
      {
        title: "多传感器系统集成",
        content: "智能环境监测系统集成多种传感器：BH1750光照传感器（I2C接口）、HDC1080温湿度传感器（I2C接口）、MQ2气体传感器（模拟接口）。系统需要协调不同接口类型的传感器，统一数据采集时序，实现多参数同步监测。传感器选择考虑精度、功耗、接口兼容性等因素。"
      },
      {
        title: "I2C总线通信协议",
        content: "I2C（Inter-Integrated Circuit）是两线制串行总线，包含时钟线SCL和数据线SDA。通信过程：起始条件→设备地址→读写位→应答→数据传输→停止条件。支持多主机、多从机架构，通过设备地址区分不同传感器。STM32作为主机控制总线时序，传感器作为从机响应命令。"
      },
      {
        title: "环境数据处理算法",
        content: "环境数据需要进行滤波、校准、融合处理。滤波算法：移动平均、卡尔曼滤波等，消除噪声和异常值。校准算法：多点线性校准、温度补偿等，提高测量精度。数据融合：将多传感器数据综合分析，提供环境质量评估。还需考虑数据存储、传输、显示等功能。"
      }
    ];
  }

  // 默认返回GPIO基础原理
  return [
    {
      title: "GPIO工作原理",
      content: "GPIO（General Purpose Input/Output）是STM32的通用输入输出端口。每个GPIO端口都有相应的控制寄存器，通过配置这些寄存器可以设置端口的工作模式、输出类型、速度等参数。"
    },
    {
      title: "数字信号控制",
      content: "数字信号只有高电平（逻辑1）和低电平（逻辑0）两种状态。STM32的GPIO可以输出0V（低电平）或3.3V（高电平），通过控制这些电平状态来驱动外部器件。"
    }
  ];
};
