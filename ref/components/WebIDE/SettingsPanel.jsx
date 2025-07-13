import React, { useState, useEffect } from 'react';
import './SettingsPanel.css';

const SettingsPanel = ({ visible, onClose, onSave }) => {
  const [cliPath, setCliPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (visible) {
      fetchCurrentSettings();
    }
  }, [visible]);

  const fetchCurrentSettings = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/stlink/default-cli-path');
      const data = await response.json();

      if (data.success && data.data.path) {
        setCliPath(data.data.path);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setErrorMessage('Failed to fetch current settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 导入配置
      const { getApiUrl } = await import('../../config');
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/stlink/set-cli-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: cliPath })
      });

      const data = await response.json();

      if (data.success) {
        onSave({ cliPath });
        onClose();
      } else {
        setErrorMessage(data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setErrorMessage('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseCli = () => {
    // In a real app, this would open a file browser
    // For now, we'll just allow manual input
    alert('Please enter the path to STM32CubeProgrammer CLI manually.');
  };

  return (
    <div className={`settings-panel ${visible ? 'visible' : ''}`}>
      <div className="settings-header">
        <h2>Settings</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="settings-content">
        {isLoading ? (
          <div className="loading">Loading settings...</div>
        ) : (
          <>
            <div className="setting-group">
              <h3>STM32CubeProgrammer CLI</h3>
              <div className="setting-row">
                <label>CLI Path:</label>
                <div className="path-input">
                  <input
                    type="text"
                    value={cliPath}
                    onChange={(e) => setCliPath(e.target.value)}
                    placeholder="Path to STM32_Programmer_CLI"
                  />
                  <button onClick={handleBrowseCli}>Browse</button>
                </div>
              </div>
              <p className="setting-note">
                Specify the path to the STM32_Programmer_CLI executable from STM32CubeProgrammer.
                <br />
                Example: C:/Program Files/STMicroelectronics/STM32Cube/STM32CubeProgrammer/bin/STM32_Programmer_CLI.exe
              </p>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <div className="settings-actions">
              <button onClick={onClose} className="cancel-button">Cancel</button>
              <button onClick={handleSave} className="save-button" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;