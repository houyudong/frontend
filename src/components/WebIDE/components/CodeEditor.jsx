import React from 'react';
import { Editor } from '@monaco-editor/react';
import { getLanguageByExtension } from '../constants';
import './CodeEditor.css';

const CodeEditor = ({
  files,
  activeFile,
  editorValue,
  onEditorChange,
  onEditorDidMount
}) => {
  // 获取当前文件的语言类型
  const getLanguage = () => {
    if (files.length === 0 || activeFile < 0 || activeFile >= files.length) {
      return 'c';
    }
    return getLanguageByExtension(files[activeFile].name);
  };

  // 如果没有活动文件，显示欢迎页面
  if (files.length === 0 || activeFile === null || activeFile === undefined) {
    return (
      <div className="editor-container">
        <div className="welcome-page">
          <h2>欢迎使用 STM32 WebIDE</h2>
          <p>这是一个基于Web的STM32嵌入式开发环境</p>
          <div className="welcome-actions">
            <div className="welcome-action">
              <h3>开始使用</h3>
              <ul>
                <li>打开项目</li>
                <li>创建新项目</li>
                <li>加载LED示例</li>
              </ul>
            </div>
            <div className="welcome-action">
              <h3>最近使用</h3>
              <p>暂无最近使用的项目</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container" style={{ margin: 0, padding: 0, border: 'none' }}>
      <Editor
        height="100%"
        width="100%"
        language={getLanguage()}
        value={editorValue}
        onChange={onEditorChange}
        onMount={onEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "'Consolas', 'Courier New', monospace",
          fontLigatures: true,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          lineNumbers: 'on',
          glyphMargin: true,
          folding: true,
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          smoothScrolling: true,
          contextmenu: true,
          colorDecorators: true,
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          }
        }}
      />
    </div>
  );
};

export default CodeEditor;
