"use client";

import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={value}
      onChange={(value) => onChange(value || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
      }}
    />
  );
}