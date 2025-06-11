import React, { useState } from 'react';
import './ProjectDialog.css';

// 项目对话框组件
const ProjectDialog = ({
  show,
  onClose,
  onCreateProject,
  onOpenProject,
  projects = [],
  isCreating = false
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [chipFamily, setChipFamily] = useState('stm32f1');
  const [selectedProject, setSelectedProject] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  // 处理创建项目
  const handleCreateProject = () => {
    if (!projectName.trim()) {
      alert('请输入项目名称');
      return;
    }

    onCreateProject({
      name: projectName,
      description: projectDescription,
      chip_family: chipFamily,
      project_path: `projects/${projectName.replace(/\s+/g, '_').toLowerCase()}`
    });
  };

  // 处理打开项目
  const handleOpenProject = () => {
    if (!selectedProject) {
      alert('请选择一个项目');
      return;
    }

    onOpenProject(selectedProject);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-content project-dialog">
        <div className="dialog-header">
          <h3>项目管理</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="dialog-tabs">
          <button
            className={`dialog-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            创建项目
          </button>
          <button
            className={`dialog-tab ${activeTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveTab('open')}
          >
            打开项目
          </button>
        </div>

        <div className="dialog-body">
          {activeTab === 'create' ? (
            <div className="create-project-form">
              <div className="form-group">
                <label htmlFor="projectName">项目名称</label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="输入项目名称"
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectDescription">项目描述</label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="输入项目描述（可选）"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="chipFamily">芯片系列</label>
                <select
                  id="chipFamily"
                  value={chipFamily}
                  onChange={(e) => setChipFamily(e.target.value)}
                >
                  <option value="stm32f1">STM32F1系列</option>
                  <option value="stm32f4">STM32F4系列</option>
                  <option value="stm32h7">STM32H7系列</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="open-project-form">
              {projects.length > 0 ? (
                <div className="form-group">
                  <label htmlFor="projectSelect">选择项目</label>
                  <select
                    id="projectSelect"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value="">-- 选择项目 --</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} ({project.chip_family})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="no-projects-message">
                  <p>没有可用的项目。请先创建一个项目。</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button className="dialog-button cancel-button" onClick={onClose}>
            取消
          </button>

          {activeTab === 'create' ? (
            <button
              className="dialog-button primary-button"
              onClick={handleCreateProject}
              disabled={isCreating}
            >
              {isCreating ? '创建中...' : '创建项目'}
            </button>
          ) : (
            <button
              className="dialog-button primary-button"
              onClick={handleOpenProject}
              disabled={!selectedProject}
            >
              打开项目
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDialog;
