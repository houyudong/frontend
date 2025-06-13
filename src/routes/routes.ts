/**
 * 应用路由配置
 *
 * 集中管理所有路由配置，包括路径、组件、权限等信息
 */

import { lazy } from 'react';
import { ComponentType } from 'react';

// 懒加载页面组件 - 使用新的目录结构
// 主页
const HomePage = lazy(() => import('../pages/HomePage'));

// 认证页面
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));

// 课程页面
const TeacherDashboardPage = lazy(() => import('../pages/TeacherDashboardPage'));
const CoursesListPage = lazy(() => import('../pages/CoursesListPage'));
const CoursePage = lazy(() => import('../pages/CoursePage'));

// 实验页面
const ExperimentsPage = lazy(() => import('../pages/ExperimentsPage'));

// GPIO实验页面
const GpioExperimentPage = lazy(() => import('../pages/gpio/GpioExperimentPage'));
const GpioExperimentsListPage = lazy(() => import('../pages/gpio/GpioExperimentsListPage'));
const KeypadInterfacingExperimentPage = lazy(() => import('../pages/gpio/KeypadInterfacingExperimentPage'));
const ButtonLedExperimentPage = lazy(() => import('../pages/gpio/ButtonLedExperimentPage'));
const MultiLedControlExperimentPage = lazy(() => import('../pages/gpio/MultiLedControlExperimentPage'));
const ExternalInterruptExperimentPage = lazy(() => import('../pages/gpio/ExternalInterruptExperimentPage'));
const LcdInterfaceExperimentPage = lazy(() => import('../pages/gpio/LcdInterfaceExperimentPage'));

// ADC实验页面
const AdcExperimentPage = lazy(() => import('../pages/experiments/adc/AdcExperimentPage'));
const AdcExperimentsListPage = lazy(() => import('../pages/experiments/adc/AdcExperimentsListPage'));

// UART实验页面
const UartExperimentPage = lazy(() => import('../pages/experiments/uart/UartExperimentPage'));
const UartExperimentsListPage = lazy(() => import('../pages/experiments/uart/UartExperimentsListPage'));

// 定时器实验页面
const TimerInterruptExperimentPage = lazy(() => import('../pages/experiments/timer/TimerInterruptExperimentPage'));
const TimerInterruptExperimentsListPage = lazy(() => import('../pages/experiments/timer/TimerInterruptExperimentsListPage'));

// DAC实验页面
const DacExperimentsListPage = lazy(() => import('../pages/experiments/dac/DacExperimentsListPage'));

// DMA实验页面
const DmaExperimentsListPage = lazy(() => import('../pages/experiments/dma/DmaExperimentsListPage'));

// 工具页面
const CodeGeneratorPage = lazy(() => import('../pages/CodeGeneratorPage'));
const SerialDebuggerPage = lazy(() => import('../pages/SerialDebuggerPage'));
const ErrorDebuggerPage = lazy(() => import('../pages/ErrorDebuggerPage'));
const WebIDEPage = lazy(() => import('../pages/WebIDEPage'));
const FlowchartPage = lazy(() => import('../pages/FlowchartPage'));

// 用户页面
const ProfilePage = lazy(() => import('../pages/user/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/user/SettingsPage'));
const ChangePasswordPage = lazy(() => import('../pages/user/ChangePasswordPage'));

// 错误页面
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

/**
 * 路由配置类型定义
 */
export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  exact?: boolean;
  roles?: string[];
  auth?: boolean;
  title?: string;
  children?: RouteConfig[];
}

/**
 * 应用路由配置
 */
const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
    exact: true,
    auth: true,
    title: '首页'
  },
  {
    path: '/login',
    component: LoginPage,
    auth: false,
    title: '登录'
  },
  {
    path: '/dashboard',
    component: TeacherDashboardPage,
    auth: true,
    roles: ['teacher', 'admin'],
    title: '教师仪表板'
  },
  {
    path: '/courses',
    component: CoursesListPage,
    auth: true,
    title: '课程列表'
  },
  {
    path: '/courses/:courseId',
    component: CoursePage,
    auth: true,
    title: '课程详情'
  },
  {
    path: '/experiments',
    component: ExperimentsPage,
    auth: true,
    title: '实验列表',
    exact: true
  },
  {
    path: '/experiments/gpio',
    component: GpioExperimentsListPage,
    auth: true,
    title: 'GPIO实验列表',
    exact: true
  },
  {
    path: '/experiments/timer-interrupt',
    component: TimerInterruptExperimentsListPage,
    auth: true,
    title: '定时器中断实验列表',
    exact: true
  },
  {
    path: '/experiments/uart',
    component: UartExperimentsListPage,
    auth: true,
    title: '串口通信实验列表',
    exact: true
  },
  {
    path: '/experiments/adc',
    component: AdcExperimentsListPage,
    auth: true,
    title: 'ADC实验列表',
    exact: true
  },
  {
    path: '/experiments/dac',
    component: DacExperimentsListPage,
    auth: true,
    title: 'DAC实验列表',
    exact: true
  },
  {
    path: '/experiments/dma',
    component: DmaExperimentsListPage,
    auth: true,
    title: 'DMA实验列表',
    exact: true
  },
  {
    path: '/experiments/gpio/:experimentId',
    component: GpioExperimentPage,
    auth: true,
    title: 'GPIO实验'
  },
  {
    path: '/experiments/timer-interrupt/:experimentId',
    component: TimerInterruptExperimentPage,
    auth: true,
    title: '定时器中断实验'
  },
  {
    path: '/experiments/uart/:experimentId',
    component: UartExperimentPage,
    auth: true,
    title: '串口通信实验'
  },
  {
    path: '/experiments/adc/:experimentId',
    component: AdcExperimentPage,
    auth: true,
    title: 'ADC实验'
  },
  {
    path: '/experiments/gpio/keypad-interfacing',
    component: KeypadInterfacingExperimentPage,
    auth: true,
    title: '键盘接口实验'
  },
  {
    path: '/experiments/gpio/button-led',
    component: ButtonLedExperimentPage,
    auth: true,
    title: '按钮LED控制实验'
  },
  {
    path: '/experiments/gpio/multi-led-control',
    component: MultiLedControlExperimentPage,
    auth: true,
    title: '多LED控制实验'
  },
  {
    path: '/experiments/gpio/external-interrupt',
    component: ExternalInterruptExperimentPage,
    auth: true,
    title: '外部中断实验'
  },
  {
    path: '/experiments/gpio/lcd-interface',
    component: LcdInterfaceExperimentPage,
    auth: true,
    title: 'LCD接口实验'
  },
  {
    path: '/code-generator',
    component: CodeGeneratorPage,
    auth: true,
    title: '代码生成器'
  },
  {
    path: '/web-serial',
    component: SerialDebuggerPage,
    auth: true,
    title: '串口调试'
  },
  {
    path: '/error-debugger',
    component: ErrorDebuggerPage,
    auth: true,
    title: '错误调试'
  },
  {
    path: '/webide',
    component: WebIDEPage,
    auth: true,
    title: 'Web IDE'
  },
  {
    path: '/profile',
    component: ProfilePage,
    auth: true,
    title: '个人资料'
  },
  {
    path: '/settings',
    component: SettingsPage,
    auth: true,
    title: '设置'
  },
  {
    path: '/change-password',
    component: ChangePasswordPage,
    auth: true,
    title: '修改密码'
  },
  {
    path: '*',
    component: NotFoundPage,
    auth: false,
    title: '页面未找到'
  }
];

export default routes; 