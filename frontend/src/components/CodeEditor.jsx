import React from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ language, code, onChange }) {
  return (
    <Editor
      height="60vh"
      theme="vs-dark"
      language={language === 'python3' ? 'python' : (language === 'cpp' ? 'cpp' : language)}
      value={code}
      onChange={onChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true
      }}
    />
  );
}
