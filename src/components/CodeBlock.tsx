import React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = () => {
    try {
      if (language.toLowerCase() === 'java') {
        return hljs.highlight(code, { language: 'java', ignoreIllegals: true }).value;
      } else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
        return hljs.highlight(code, { language: 'javascript', ignoreIllegals: true }).value;
      } else if (language.toLowerCase() === 'typescript' || language.toLowerCase() === 'ts') {
        return hljs.highlight(code, { language: 'typescript', ignoreIllegals: true }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch (error) {
      return code;
    }
  };

  return (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-4 border border-slate-700">
      <div className="flex justify-between items-center bg-slate-800 px-4 py-2 border-b border-slate-700">
        <span className="text-sm text-slate-300 font-medium">{language}</span>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-green-600 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-slate-950">
        <code 
          className="text-sm leading-relaxed hljs"
          dangerouslySetInnerHTML={{ __html: highlightCode() }}
        />
      </pre>
    </div>
  );
};
