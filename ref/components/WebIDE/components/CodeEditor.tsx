import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

interface File {
  name: string;
  path?: string;
  content?: string;
  active: boolean;
  size?: number;
  updated_at?: string;
}

interface CodeEditorProps {
  files: File[];
  activeFile: number | null;
  editorValue: string;
  onEditorChange: (value: string) => void;
  onEditorDidMount: (editor: any) => void;
  style?: React.CSSProperties;
}

/**
 * CodeEditor - 代码编辑器组件
 * 
 * 使用 Monaco Editor 实现的代码编辑器，支持语法高亮、自动完成等功能。
 * 
 * @param {CodeEditorProps} props - 组件属性
 * @returns {React.ReactElement} 代码编辑器组件
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFile,
  editorValue,
  onEditorChange,
  onEditorDidMount,
  style
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [activeFile]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    onEditorDidMount(editor);
  };

  const getLanguage = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'c':
        return 'c';
      case 'cpp':
        return 'cpp';
      case 'h':
        return 'c';
      case 'hpp':
        return 'cpp';
      case 's':
        return 'asm';
      case 'ld':
        return 'ld';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  const currentFile = activeFile !== null ? files[activeFile] : null;
  const language = currentFile ? getLanguage(currentFile.name) : 'plaintext';

  return (
    <div className="code-editor" style={style}>
      <Editor
        height="100%"
        language={language}
        value={editorValue}
        onChange={(value: string | undefined) => onEditorChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          contextmenu: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
      />
    </div>
  );
};

export default CodeEditor; 