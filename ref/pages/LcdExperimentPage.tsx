/**
 * LCD显示实验页面
 *
 * 专门针对STM32F103 FSMC接口LCD显示实验设计
 * 参考其他实验页面的实现方式，遵循奥卡姆法则
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FullScreenLayout } from '../../../pages';
import STMIDEWrapper from '../../stmIde/STMIDEWrapper';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useExperiments } from '../stores/experimentStore';
import { experimentService } from '../services/experimentService';
import {
  getDifficultyInfo,
  getStatusInfo,
  getExperimentConfig,
  getDifficultyColorClass,
  getStatusColorClass
} from '../utils/experimentUtils';

// LCD显示实验ID
const LCD_EXPERIMENT_ID = '16';

const LcdExperimentPage: React.FC = () => {
  const { experimentName } = useParams<{ experimentName: string }>();
  const { user } = useAuth();
  const { userExperiments, startExperiment, deleteExperiment, loadUserExperiments } = useExperiments();

  const [experiment, setExperiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSTMIDE, setShowSTMIDE] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // 加载实验详情
  useEffect(() => {
    const loadExperiment = async () => {
      if (!experimentName) return;

      setLoading(true);
      setError(null);

      try {
        const template = await experimentService.getExperimentTemplateByUrl(experimentName);
        if (template && template.id === LCD_EXPERIMENT_ID) {
          setExperiment(template);
        } else {
          setError('LCD实验未找到');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载实验失败');
      } finally {
        setLoading(false);
      }
    };

    loadExperiment();
  }, [experimentName]);

  // 加载用户实验数据
  useEffect(() => {
    if (user?.id) {
      loadUserExperiments(user.id);
    }
  }, [user?.id, loadUserExperiments]);

  // 获取当前实验的用户数据
  const userExperiment = experiment ? userExperiments.find(ue => ue.experiment_id === experiment.id) : null;
  const config = experiment ? getExperimentConfig(experiment.id) : null;
  const difficulty = experiment ? getDifficultyInfo(experiment.difficulty || 1) : null;
  const status = userExperiment ? getStatusInfo(userExperiment.status) : null;

  // 处理开始实验
  const handleStartExperiment = async () => {
    if (!experiment || !user?.id) return;

    setIsStarting(true);
    try {
      await startExperiment(user.id, experiment.id);
      setShowSTMIDE(true);
    } catch (error) {
      console.error('开始实验失败:', error);
      alert('开始实验失败，请重试');
    } finally {
      setIsStarting(false);
    }
  };

  // 处理删除实验
  const handleDeleteExperiment = async () => {
    if (!userExperiment || !user?.id) return;

    if (confirm('确定要删除这个实验吗？')) {
      try {
        await deleteExperiment(user.id, userExperiment.id);
      } catch (error) {
        console.error('删除实验失败:', error);
        alert('删除实验失败，请重试');
      }
    }
  };

  // 加载状态
  if (loading) {
    return (
      <MainLayout showSidebar={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </MainLayout>
    );
  }

  // 错误状态
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">实验未找到</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              to="/student/experiments"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              返回实验中心
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 如果显示STMIDE
  if (showSTMIDE) {
    return (
      <MainLayout>
        <div className="h-screen flex flex-col">
          {/* 顶部工具栏 */}
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSTMIDE(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                title="返回实验详情"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">STM32 IDE</h1>
                <p className="text-sm text-gray-600">{experiment.name}</p>
              </div>
            </div>
          </div>

          {/* STMIDE内容 */}
          <div className="flex-1 overflow-hidden">
            <STMIDEWrapper hideTitle={true} />
          </div>
        </div>
      </MainLayout>
    );
  }

  // 主要实验详情页面
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* 头部导航 */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  to="/student/experiments"
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="返回实验中心"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🖥️</span>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">{experiment.name}</h1>
                    <p className="text-sm text-gray-600">FSMC接口LCD显示实验</p>
                  </div>
                </div>
              </div>

              {/* 实验状态和难度 */}
              <div className="flex items-center space-x-3">
                {difficulty && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${difficulty.color}-100 text-${difficulty.color}-800`}>
                    {difficulty.name}
                  </span>
                )}
                {status && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${status.color}-100 text-${status.color}-800`}>
                    {status.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧内容 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 实验概述 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  实验概述
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    本实验将学习STM32F103的FSMC（Flexible Static Memory Controller）接口，
                    通过控制ILI9341控制器驱动TFT LCD显示屏，实现图形绘制和字符显示功能。
                  </p>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">技能要求</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-900 font-medium">基础要求</span>
                        <p className="text-blue-800 text-sm mt-1">C语言、数字电路、存储器接口</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <span className="text-green-900 font-medium">工具使用</span>
                        <p className="text-green-800 text-sm mt-1">STM32CubeMX、Keil MDK</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 学习目标 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📚</span>
                  学习目标
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    掌握STM32F103的FSMC接口配置和使用方法
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    理解TFT LCD的工作原理和控制时序
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    学会ILI9341控制器的初始化和操作
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    熟悉图形绘制和字符显示编程技术
                  </li>
                </ul>
              </div>

              {/* 实验原理 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">⚙️</span>
                  实验原理
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">FSMC工作原理</h3>
                    <p className="text-gray-700 leading-relaxed">
                      STM32F103的FSMC（Flexible Static Memory Controller）是一个灵活的静态存储器控制器，
                      可以与多种外部存储器接口。通过配置FSMC的时序参数和控制信号，可以实现与LCD控制器的高速通信。
                      FSMC将LCD控制器映射到STM32的存储器空间，使得操作LCD如同操作内存一样简单。
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">ILI9341控制器</h3>
                    <p className="text-gray-700 leading-relaxed">
                      ILI9341是一款高性能的TFT LCD控制器，支持240×320分辨率，16位RGB565颜色格式。
                      控制器内置GRAM（图形RAM），通过寄存器配置可以控制显示方向、颜色格式、扫描方式等参数。
                      与STM32通过16位并行接口通信，支持高速数据传输。
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">关键寄存器</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li><code className="bg-gray-200 px-1 rounded">FSMC_BCR4</code> - Bank4控制寄存器</li>
                      <li><code className="bg-gray-200 px-1 rounded">FSMC_BTR4</code> - Bank4时序寄存器</li>
                      <li><code className="bg-gray-200 px-1 rounded">ILI9341_CMD</code> - 命令寄存器地址</li>
                      <li><code className="bg-gray-200 px-1 rounded">ILI9341_DATA</code> - 数据寄存器地址</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 硬件连接 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🔧</span>
                  硬件连接
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">器件清单</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">STM32F103开发板</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">2.4寸TFT LCD屏</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">ILI9341控制器</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">16位数据线</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">FSMC连接说明</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li><strong>FSMC_D[15:0]</strong> → LCD数据线D[15:0]</li>
                        <li><strong>FSMC_NOE</strong> → LCD_RD（读信号）</li>
                        <li><strong>FSMC_NWE</strong> → LCD_WR（写信号）</li>
                        <li><strong>FSMC_NE4</strong> → LCD_CS（片选信号）</li>
                        <li><strong>FSMC_A16</strong> → LCD_RS（寄存器选择）</li>
                        <li><strong>PC5</strong> → LCD_RST（复位信号）</li>
                        <li><strong>PB0</strong> → LCD_BL（背光控制）</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 软件设计 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💻</span>
                  软件设计
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">程序流程</h3>
                    <ol className="text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                        初始化系统时钟和FSMC时钟
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                        配置FSMC Bank4为SRAM模式
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                        初始化LCD控制引脚（RST、BL）
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                        复位LCD并读取设备ID
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
                        执行ILI9341寄存器初始化序列
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">6</span>
                        设置显示方向和清屏
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">关键代码</h3>
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
                      <pre>{`// FSMC初始化
hsram1.Instance = FSMC_NORSRAM_DEVICE;
hsram1.Init.NSBank = FSMC_NORSRAM_BANK4;
hsram1.Init.MemoryType = FSMC_MEMORY_TYPE_SRAM;
hsram1.Init.MemoryDataWidth = FSMC_NORSRAM_MEM_BUS_WIDTH_16;
Timing.AddressSetupTime = 15;
Timing.DataSetupTime = 255;
HAL_SRAM_Init(&hsram1, &Timing, NULL);

// LCD写数据
void lcd_wr_data(uint16_t data) {
    LCD->LCD_RAM = data;
}

// 画点函数
void lcd_draw_point(uint16_t x, uint16_t y, uint32_t color) {
    lcd_set_cursor(x, y);
    lcd_write_ram_prepare();
    LCD->LCD_RAM = color;
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧侧边栏 */}
            <div className="space-y-6">
              {/* 实验信息卡片 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">实验信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">实验类型:</span>
                    <span className="font-medium text-blue-600">显示接口</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">实验编号:</span>
                    <span className="font-medium">{experiment.id}</span>
                  </div>

                  {difficulty && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">难度等级:</span>
                      <span className={`px-2 py-1 bg-${difficulty.color}-100 text-${difficulty.color}-800 rounded text-sm`}>
                        {difficulty.name}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">预计时间:</span>
                    <span className="font-medium">90分钟</span>
                  </div>

                  {status && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">状态:</span>
                      <span className={`px-2 py-1 bg-${status.color}-100 text-${status.color}-800 rounded text-sm flex items-center`}>
                        <span className="mr-1">{status.icon}</span>
                        {status.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 实验操作卡片 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">实验操作</h3>

                {!userExperiment ? (
                  <button
                    onClick={handleStartExperiment}
                    disabled={isStarting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg flex items-center justify-center"
                  >
                    {isStarting ? (
                      <>
                        <LoadingSpinner size="small" className="mr-2" />
                        创建中...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀</span>
                        开始实验
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowSTMIDE(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center"
                    >
                      <span className="mr-2">💻</span>
                      {userExperiment.status === 'completed' ? '重新学习' : '继续实验'}
                    </button>
                    <button
                      onClick={handleDeleteExperiment}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center"
                    >
                      <span className="mr-2">🗑️</span>
                      删除实验
                    </button>
                  </div>
                )}
              </div>

              {/* 硬件需求卡片 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">硬件需求</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">STM32F103开发板</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">2.4寸TFT LCD屏</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">ILI9341控制器</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">FSMC接口连线</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LcdExperimentPage;