import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, Description, ChevronRight, ExpandMore } from '@mui/icons-material';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Collapse, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { formatFileSize } from '../utils';

// 文件图标映射
const getFileIcon = (fileName) => {
  if (!fileName) return <Description />;

  const ext = fileName.split('.').pop().toLowerCase();
  
  // 根据文件扩展名返回不同的图标
  switch (ext) {
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
      return <Description sx={{ color: '#1976d2' }} />;
    case 's':
    case 'asm':
      return <Description sx={{ color: '#9c27b0' }} />;
    case 'ld':
      return <Description sx={{ color: '#ff9800' }} />;
    case 'xml':
    case 'json':
      return <Description sx={{ color: '#4caf50' }} />;
    case 'md':
    case 'txt':
      return <Description sx={{ color: '#607d8b' }} />;
    default:
      return <Description />;
  }
};

// 工作区资源管理器组件
const WorkspaceExplorer = ({ 
  userId,
  projects = [], 
  projectFiles = [], 
  currentProject, 
  expandedDirs = {},
  isLoading = false,
  onProjectSelect,
  onFileSelect
}) => {
  // 本地状态
  const [expandedProjects, setExpandedProjects] = useState({});

  // 处理项目点击
  const handleProjectClick = (project) => {
    // 切换项目展开状态
    const newExpandedProjects = { ...expandedProjects };
    newExpandedProjects[project.name] = !newExpandedProjects[project.name];
    setExpandedProjects(newExpandedProjects);

    // 如果项目被展开，选择该项目
    if (!newExpandedProjects[project.name]) {
      onProjectSelect(project);
    }
  };

  // 处理文件点击
  const handleFileClick = (file) => {
    onFileSelect(file);
  };

  // 渲染项目列表
  const renderProjects = () => {
    if (projects.length === 0) {
      return (
        <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
          没有可用的项目
        </Typography>
      );
    }

    return (
      <List dense component="div" disablePadding>
        {projects.map((project) => (
          <React.Fragment key={project.name}>
            <ListItem 
              button 
              onClick={() => handleProjectClick(project)}
              selected={currentProject && currentProject.name === project.name}
              sx={{ pl: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                {expandedProjects[project.name] ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
              </ListItemIcon>
              <ListItemIcon sx={{ minWidth: 32 }}>
                {expandedProjects[project.name] ? <FolderOpen fontSize="small" /> : <Folder fontSize="small" />}
              </ListItemIcon>
              <ListItemText 
                primary={project.name} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  noWrap: true,
                  title: project.description || project.name
                }} 
              />
            </ListItem>
            
            {/* 项目文件列表 */}
            {currentProject && currentProject.name === project.name && (
              <Collapse in={expandedProjects[project.name]} timeout="auto" unmountOnExit>
                {renderFiles(projectFiles, '')}
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    );
  };

  // 渲染文件列表
  const renderFiles = (files, parentPath) => {
    // 过滤出当前目录下的文件和文件夹
    const currentDirFiles = files.filter(file => {
      if (!parentPath) {
        // 根目录下的文件和文件夹
        return !file.path.includes('/') && !file.path.includes('\\');
      } else {
        // 子目录下的文件和文件夹
        const relativePath = file.path.replace(parentPath + '/', '').replace(parentPath + '\\', '');
        return file.path.startsWith(parentPath + '/') && !relativePath.includes('/') && !relativePath.includes('\\');
      }
    });

    if (currentDirFiles.length === 0) {
      return (
        <Typography variant="body2" sx={{ pl: 4, py: 1, color: 'text.secondary' }}>
          没有文件
        </Typography>
      );
    }

    return (
      <List dense component="div" disablePadding>
        {currentDirFiles.map((file) => (
          <React.Fragment key={file.path}>
            <ListItem 
              button 
              onClick={() => handleFileClick(file)}
              sx={{ pl: parentPath ? 4 : 2 }}
            >
              {file.isDir && (
                <ListItemIcon sx={{ minWidth: 24 }}>
                  {expandedDirs[file.path] ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
                </ListItemIcon>
              )}
              <ListItemIcon sx={{ minWidth: 32 }}>
                {file.isDir 
                  ? (expandedDirs[file.path] ? <FolderOpen fontSize="small" /> : <Folder fontSize="small" />)
                  : getFileIcon(file.name)
                }
              </ListItemIcon>
              <ListItemText 
                primary={file.name} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  noWrap: true,
                  title: `${file.name} (${formatFileSize(file.size)})`
                }} 
              />
            </ListItem>
            
            {/* 子目录文件列表 */}
            {file.isDir && (
              <Collapse in={expandedDirs[file.path]} timeout="auto" unmountOnExit>
                {renderFiles(files, file.path)}
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" component="div">
          工作区
        </Typography>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        renderProjects()
      )}
    </Box>
  );
};

export default WorkspaceExplorer;
