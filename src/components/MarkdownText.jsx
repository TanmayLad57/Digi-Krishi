import React from 'react';

// Renders the limited markdown emitted by advisory responses without injecting HTML.
export default function MarkdownText({ children, className = '' }) {
  const text = String(children || '').replace(/\\n/g, '\n');
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span className={`whitespace-pre-line ${className}`}>
      {parts.map((part, index) => (
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={index}>{part.slice(2, -2)}</strong>
          : <React.Fragment key={index}>{part}</React.Fragment>
      ))}
    </span>
  );
}
