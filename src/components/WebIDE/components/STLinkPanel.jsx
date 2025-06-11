import React from 'react';
import './STLinkPanel.css';

const STLinkPanel = ({ deviceInfo }) => {
  if (!deviceInfo) return null;

  return (
    <div className="stlink-info-panel">
      <div className="stlink-info">
        <h3>ST-Link 信息</h3>
        <table>
          <tbody>
            <tr>
              <td>接口类型:</td>
              <td>{deviceInfo.interface}</td>
            </tr>
            <tr>
              <td>接口速度:</td>
              <td>{deviceInfo.speed}</td>
            </tr>
            <tr>
              <td>序列号:</td>
              <td>{deviceInfo.serialNumber}</td>
            </tr>
            <tr>
              <td>固件版本:</td>
              <td>{deviceInfo.firmwareVersion}</td>
            </tr>
            <tr>
              <td>目标设备:</td>
              <td>{deviceInfo.type}</td>
            </tr>
            {deviceInfo.targetVoltage && (
              <tr>
                <td>目标电压:</td>
                <td>{deviceInfo.targetVoltage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default STLinkPanel;
