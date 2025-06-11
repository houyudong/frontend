import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStop, FaPlus, FaTrash, FaCog, FaDownload } from 'react-icons/fa';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import './DebugPanel.css';

/**
 * DebugPanel - 调试面板组件
 *
 * 提供变量监控、波形绘制和调试控制功能
 *
 * @component
 * @example
 * ```jsx
 * <DebugPanel
 *   sessionId="session123"
 *   appendToDebugOutput={(msg) => console.log(msg)}
 * />
 * ```
 */
const DebugPanel = ({ sessionId, appendToDebugOutput }) => {
  // WebSocket连接状态
  const [wsConnected, setWsConnected] = useState(false);
  const [ws, setWs] = useState(null);

  // 变量相关状态
  const [variables, setVariables] = useState([]);
  const [variableName, setVariableName] = useState('');
  const [isWatching, setIsWatching] = useState(false);

  // 波形图相关状态
  const [timeRange, setTimeRange] = useState(5000);
  const [verticalRange, setVerticalRange] = useState(100);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // 图表相关
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // 配置相关
  const [sampleRate, setSampleRate] = useState(100);
  const [bufferSize, setBufferSize] = useState(1000);

  // 连接WebSocket
  useEffect(() => {
    if (!sessionId) return;

    const wsUrl = `ws://localhost:8080/ws`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      setWsConnected(true);
      appendToDebugOutput('✅ WebSocket连接成功');
    };

    websocket.onclose = () => {
      setWsConnected(false);
      appendToDebugOutput('❌ WebSocket连接已关闭');
    };

    websocket.onerror = (error) => {
      setWsConnected(false);
      appendToDebugOutput(`❌ WebSocket连接错误: ${error}`);
    };

    websocket.onmessage = (event) => {
      handleWebSocketMessage(event.data);
    };

    setWs(websocket);

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [sessionId]);

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 如果已经有图表实例，先销毁
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // 创建新的图表实例
    const ctx = chartRef.current.getContext('2d');

    // 注册必要的组件
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

    // 创建图表
    chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: []
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              min: 0,
              max: timeRange,
              title: {
                display: true,
                text: '时间 (ms)'
              }
            },
            y: {
              type: 'linear',
              min: -verticalRange / 2 + verticalOffset,
              max: verticalRange / 2 + verticalOffset,
              title: {
                display: true,
                text: '值'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: '变量波形图'
            }
          }
        }
      });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [timeRange, verticalRange, verticalOffset]);

  // 处理WebSocket消息
  const handleWebSocketMessage = (data) => {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'variable.sample':
          handleVariableSampleMessage(message.payload);
          break;
        case 'variable.watch':
          handleVariableWatchMessage(message.payload);
          break;
        case 'variable.stop_watch':
          handleVariableStopWatchMessage(message.payload);
          break;
        case 'variable.info':
          handleVariableInfoMessage(message.payload);
          break;
        case 'variable.set':
          handleVariableSetMessage(message.payload);
          break;
        case 'waveform.config':
          handleWaveformConfigMessage(message.payload);
          break;
        case 'error':
          appendToDebugOutput(`❌ 错误: ${message.payload.message}`);
          break;
        default:
          // 忽略其他消息类型
          break;
      }
    } catch (error) {
      appendToDebugOutput(`❌ 解析消息失败: ${error.message}`);
    }
  };

  // 处理变量采样消息
  const handleVariableSampleMessage = (payload) => {
    if (!payload.samples || payload.samples.length === 0) return;

    // 更新变量值
    const updatedVariables = [...variables];

    payload.samples.forEach(sample => {
      const varIndex = updatedVariables.findIndex(v => v.name === sample.variable);
      if (varIndex !== -1 && sample.samples.length > 0) {
        updatedVariables[varIndex].value = sample.samples[sample.samples.length - 1].value;

        // 更新图表数据
        if (chartInstanceRef.current) {
          const dataset = chartInstanceRef.current.data.datasets.find(ds => ds.label === sample.variable);

          if (dataset) {
            // 添加新的数据点
            sample.samples.forEach(point => {
              dataset.data.push({
                x: point.timestamp / 1000, // 转换为毫秒
                y: point.value
              });
            });

            // 如果启用了自动滚动，调整X轴范围
            if (autoScroll && dataset.data.length > 0) {
              const lastPoint = dataset.data[dataset.data.length - 1];
              chartInstanceRef.current.options.scales.x.min = Math.max(0, lastPoint.x - timeRange);
              chartInstanceRef.current.options.scales.x.max = lastPoint.x;
            }

            // 限制数据点数量
            if (dataset.data.length > bufferSize) {
              dataset.data = dataset.data.slice(-bufferSize);
            }

            // 更新图表
            chartInstanceRef.current.update();
          }
        }
      }
    });

    setVariables(updatedVariables);
  };

  // 处理变量监控消息
  const handleVariableWatchMessage = (payload) => {
    appendToDebugOutput(`✅ 变量监控已启动，会话ID: ${payload.session_id}`);
    setIsWatching(true);
  };

  // 处理停止变量监控消息
  const handleVariableStopWatchMessage = (payload) => {
    appendToDebugOutput(`✅ 变量监控已停止，会话ID: ${payload.session_id}`);
    setIsWatching(false);
  };

  // 处理变量信息消息
  const handleVariableInfoMessage = (payload) => {
    appendToDebugOutput(`✅ 收到变量信息: ${JSON.stringify(payload.variable)}`);
  };

  // 处理变量设置消息
  const handleVariableSetMessage = (payload) => {
    appendToDebugOutput(`✅ 变量 ${payload.variable} 设置为 ${payload.value} 成功`);

    // 更新变量列表
    const updatedVariables = [...variables];
    const varIndex = updatedVariables.findIndex(v => v.name === payload.variable);

    if (varIndex !== -1) {
      updatedVariables[varIndex].value = payload.value;
      setVariables(updatedVariables);
    }
  };

  // 处理波形配置消息
  const handleWaveformConfigMessage = (payload) => {
    appendToDebugOutput(`✅ 波形配置成功，会话ID: ${payload.session_id}`);
  };

  // 添加变量
  const handleAddVariable = () => {
    if (!variableName.trim()) {
      appendToDebugOutput('❌ 请输入变量名');
      return;
    }

    // 检查变量是否已存在
    if (variables.some(v => v.name === variableName)) {
      appendToDebugOutput(`❌ 变量 ${variableName} 已存在`);
      return;
    }

    // 添加变量
    const newVariables = [...variables, {
      name: variableName,
      value: null,
      color: generateRandomColor()
    }];

    setVariables(newVariables);
    setVariableName('');

    // 如果图表已初始化，添加新的数据集
    if (chartInstanceRef.current) {
      const color = newVariables[newVariables.length - 1].color;

      chartInstanceRef.current.data.datasets.push({
        label: variableName,
        data: [],
        borderColor: color,
        backgroundColor: color + '33', // 添加透明度
        tension: 0.2,
        pointRadius: 0
      });

      chartInstanceRef.current.update();
    }

    appendToDebugOutput(`✅ 添加变量: ${variableName}`);
  };

  // 删除变量
  const handleRemoveVariable = (index) => {
    const varName = variables[index].name;

    // 更新变量列表
    const newVariables = [...variables];
    newVariables.splice(index, 1);
    setVariables(newVariables);

    // 更新图表
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.datasets.splice(index, 1);
      chartInstanceRef.current.update();
    }

    appendToDebugOutput(`✅ 删除变量: ${varName}`);
  };

  // 开始监控
  const handleStartWatch = () => {
    if (!sessionId) {
      appendToDebugOutput('❌ 没有活动的会话');
      return;
    }

    if (variables.length === 0) {
      appendToDebugOutput('❌ 请先添加变量');
      return;
    }

    if (ws && wsConnected) {
      const message = {
        type: 'variable.watch',
        payload: {
          session_id: sessionId,
          config: {
            variables: variables.map(v => v.name),
            sample_rate: sampleRate,
            buffer_size: bufferSize,
            auto_scroll: autoScroll
          }
        }
      };

      ws.send(JSON.stringify(message));
      appendToDebugOutput('📤 已发送开始变量监控请求');
    } else {
      appendToDebugOutput('❌ WebSocket未连接');
    }
  };

  // 停止监控
  const handleStopWatch = () => {
    if (!sessionId) {
      appendToDebugOutput('❌ 没有活动的会话');
      return;
    }

    if (ws && wsConnected) {
      const message = {
        type: 'variable.stop_watch',
        payload: {
          session_id: sessionId
        }
      };

      ws.send(JSON.stringify(message));
      appendToDebugOutput('📤 已发送停止变量监控请求');
    } else {
      appendToDebugOutput('❌ WebSocket未连接');
    }
  };

  // 配置波形
  const handleConfigWaveform = () => {
    if (!sessionId) {
      appendToDebugOutput('❌ 没有活动的会话');
      return;
    }

    if (variables.length === 0) {
      appendToDebugOutput('❌ 请先添加变量');
      return;
    }

    if (ws && wsConnected) {
      const message = {
        type: 'waveform.config',
        payload: {
          session_id: sessionId,
          variables: variables.map(v => v.name),
          time_range: timeRange,
          vertical_range: verticalRange,
          vertical_offset: verticalOffset,
          auto_scale: autoScroll,
          colors: variables.map(v => v.color)
        }
      };

      ws.send(JSON.stringify(message));
      appendToDebugOutput('📤 已发送波形配置请求');
    } else {
      appendToDebugOutput('❌ WebSocket未连接');
    }
  };

  // 生成随机颜色
  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  // 导出数据
  const handleExportData = () => {
    if (!chartInstanceRef.current) {
      appendToDebugOutput('❌ 没有可导出的数据');
      return;
    }

    // 准备CSV数据
    let csvContent = 'timestamp,';

    // 添加变量名作为列标题
    variables.forEach((variable, index) => {
      csvContent += variable.name;
      if (index < variables.length - 1) {
        csvContent += ',';
      }
    });
    csvContent += '\n';

    // 获取所有时间戳
    const timestamps = new Set();
    chartInstanceRef.current.data.datasets.forEach(dataset => {
      dataset.data.forEach(point => {
        timestamps.add(point.x);
      });
    });

    // 按时间戳排序
    const sortedTimestamps = Array.from(timestamps).sort((a, b) => a - b);

    // 为每个时间戳添加一行数据
    sortedTimestamps.forEach(timestamp => {
      csvContent += `${timestamp},`;

      // 为每个变量添加值
      variables.forEach((variable, varIndex) => {
        const dataset = chartInstanceRef.current.data.datasets.find(ds => ds.label === variable.name);
        if (dataset) {
          const point = dataset.data.find(p => p.x === timestamp);
          csvContent += point ? point.y : '';
        } else {
          csvContent += '';
        }

        if (varIndex < variables.length - 1) {
          csvContent += ',';
        }
      });

      csvContent += '\n';
    });

    // 创建并下载CSV文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `variable_data_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    appendToDebugOutput('✅ 数据导出成功');
  };

  return (
    <div className="debug-panel">
      <div className="debug-panel-header">
        <h3>变量监控</h3>
        <div className="connection-status">
          <span className={`status-indicator ${wsConnected ? 'connected' : 'disconnected'}`}></span>
          <span>{wsConnected ? '已连接' : '未连接'}</span>
        </div>
      </div>

      <div className="debug-panel-content">
        <div className="debug-panel-top-section">
          <div className="variable-section">
            <div className="variable-controls">
              <div className="variable-input">
                <input
                  type="text"
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value)}
                  placeholder="输入变量名"
                  disabled={!wsConnected}
                />
                <button
                  onClick={handleAddVariable}
                  disabled={!wsConnected || !variableName.trim()}
                  title="添加变量"
                >
                  <FaPlus />
                </button>
              </div>

              <div className="watch-controls">
                <button
                  onClick={handleStartWatch}
                  disabled={!wsConnected || isWatching || variables.length === 0}
                  className="start-button"
                  title="开始监控"
                >
                  <FaPlay />
                </button>
                <button
                  onClick={handleStopWatch}
                  disabled={!wsConnected || !isWatching}
                  className="stop-button"
                  title="停止监控"
                >
                  <FaStop />
                </button>
                <button
                  onClick={handleConfigWaveform}
                  disabled={!wsConnected || variables.length === 0}
                  className="config-button"
                  title="配置波形"
                >
                  <FaCog />
                </button>
                <button
                  onClick={handleExportData}
                  disabled={!chartInstanceRef.current || !chartInstanceRef.current.data.datasets.some(ds => ds.data.length > 0)}
                  className="export-button"
                  title="导出数据"
                >
                  <FaDownload />
                </button>
              </div>
            </div>

            <div className="variable-list">
              {variables.length === 0 ? (
                <div className="no-variables">没有变量，请添加变量</div>
              ) : (
                variables.map((variable, index) => (
                  <div key={index} className="variable-item">
                    <div className="variable-color" style={{ backgroundColor: variable.color }}></div>
                    <div className="variable-name">{variable.name}</div>
                    <div className="variable-value">{variable.value !== null ? variable.value : '未知'}</div>
                    <button
                      onClick={() => handleRemoveVariable(index)}
                      className="remove-button"
                      title="删除变量"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="controls-section">
            <div className="waveform-controls">
              <div className="control-group">
                <label>采样率(ms):</label>
                <input
                  type="number"
                  value={sampleRate}
                  onChange={(e) => setSampleRate(parseInt(e.target.value))}
                  min="10"
                  max="1000"
                  disabled={isWatching}
                />
              </div>
              <div className="control-group">
                <label>时间范围(ms):</label>
                <input
                  type="number"
                  value={timeRange}
                  onChange={(e) => setTimeRange(parseInt(e.target.value))}
                  min="1000"
                  max="60000"
                />
              </div>
              <div className="control-group">
                <label>垂直范围:</label>
                <input
                  type="number"
                  value={verticalRange}
                  onChange={(e) => setVerticalRange(parseFloat(e.target.value))}
                  min="1"
                  max="1000"
                />
              </div>
              <div className="control-group">
                <label>垂直偏移:</label>
                <input
                  type="number"
                  value={verticalOffset}
                  onChange={(e) => setVerticalOffset(parseFloat(e.target.value))}
                  min="-500"
                  max="500"
                />
              </div>
              <div className="control-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                  />
                  自动滚动
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="waveform-section">
          <div className="waveform-container">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
