import React, { useState } from 'react';
import './ProjectDialog.css';

interface ProjectFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: ProjectFile[];
}

interface ProjectDialogProps {
  show: boolean;
  onClose: () => void;
  onCreateProject: () => Promise<void>;
  onOpenProject: () => Promise<void>;
  projects?: ProjectFile[];
  isCreating?: boolean;
}

/**
 * ProjectDialog - 项目对话框组件
 * 
 * 用于创建新项目或打开现有项目的对话框。
 * 
 * @param {ProjectDialogProps} props - 组件属性
 * @returns {React.ReactElement | null} 项目对话框组件
 */
const ProjectDialog: React.FC<ProjectDialogProps> = ({
  show,
  onClose,
  onCreateProject,
  onOpenProject,
  projects = [],
  isCreating = false
}) => {
  const [projectName, setProjectName] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  if (!show) {
    return null;
  }

  const handleCreateProject = async (): Promise<void> => {
    if (projectName.trim()) {
      await onCreateProject();
      setProjectName('');
    }
  };

  const handleOpenProject = async (): Promise<void> => {
    if (selectedProject) {
      await onOpenProject();
      setSelectedProject('');
    }
  };

  return (
    <div className="project-dialog-overlay">
      <div className="project-dialog">
        <div className="dialog-header">
          <h2>{isCreating ? '创建新项目' : '打开项目'}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="dialog-content">
          {isCreating ? (
            <div className="create-project">
              <input
                type="text"
                placeholder="输入项目名称"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <button
                className="create-button"
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
              >
                创建
              </button>
            </div>
          ) : (
            <div className="open-project">
              <div className="project-list">
                {projects.map((project) => (
                  <div
                    key={project.path}
                    className={`project-item ${
                      selectedProject === project.path ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedProject(project.path)}
                  >
                    {project.name}
                  </div>
                ))}
              </div>
              <button
                className="open-button"
                onClick={handleOpenProject}
                disabled={!selectedProject}
              >
                打开
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDialog; 