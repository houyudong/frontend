/**
 * 页面组件导出
 * 
 * 按照功能分类导出所有页面组件，方便导入使用
 */

// 主页
export { default as HomePage } from './HomePage';

// 认证页面
export { default as LoginPage } from './auth/LoginPage';

// 课程页面
export { default as CoursesListPage } from './CoursesListPage';
export { default as CoursePage } from './CoursePage';
export { default as TeacherDashboardPage } from './TeacherDashboardPage';

// 实验页面
export { default as ExperimentsPage } from './ExperimentsPage';

// GPIO实验页面
export { default as GpioExperimentPage } from './gpio/GpioExperimentPage';
export { default as GpioExperimentsListPage } from './gpio/GpioExperimentsListPage';
export { default as ButtonLedExperimentPage } from './gpio/ButtonLedExperimentPage';
export { default as ExternalInterruptExperimentPage } from './gpio/ExternalInterruptExperimentPage';
export { default as KeypadInterfacingExperimentPage } from './gpio/KeypadInterfacingExperimentPage';
export { default as LcdInterfaceExperimentPage } from './gpio/LcdInterfaceExperimentPage';
export { default as MultiLedControlExperimentPage } from './gpio/MultiLedControlExperimentPage';

// ADC实验页面
export { default as AdcExperimentPage } from './experiments/adc/AdcExperimentPage';
export { default as AdcExperimentsListPage } from './experiments/adc/AdcExperimentsListPage';

// UART实验页面
export { default as UartExperimentPage } from './experiments/uart/UartExperimentPage';
export { default as UartExperimentsListPage } from './experiments/uart/UartExperimentsListPage';

// 定时器实验页面
export { default as TimerInterruptExperimentPage } from './experiments/timer/TimerInterruptExperimentPage';
export { default as TimerInterruptExperimentsListPage } from './experiments/timer/TimerInterruptExperimentsListPage';

// DAC实验页面
export { default as DacExperimentsListPage } from './experiments/dac/DacExperimentsListPage';

// DMA实验页面
export { default as DmaExperimentsListPage } from './experiments/dma/DmaExperimentsListPage';

// 工具页面
export { default as WebIDEPage } from './WebIDEPage';
export { default as SerialDebuggerPage } from './SerialDebuggerPage';
export { default as ErrorDebuggerPage } from './ErrorDebuggerPage';
export { default as CodeGeneratorPage } from './CodeGeneratorPage';
export { default as FlowchartPage } from './FlowchartPage';

// 用户页面
export { default as ProfilePage } from './user/ProfilePage';
export { default as SettingsPage } from './user/SettingsPage';
export { default as ChangePasswordPage } from './user/ChangePasswordPage';

// 错误页面
export { default as NotFoundPage } from './NotFoundPage';
