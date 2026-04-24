import React, { useState } from 'react';

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  if (!content) return null;

  // Split into lines for heading/blockquote/codeblock processing
  const lines = content.split('\n');
  const renderedLines: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  lines.forEach((line, index) => {
    // Code Block Processing
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        renderedLines.push(
          <pre key={`cb-${index}`} style={{ 
            background: '#1e1f22', 
            padding: '0.5rem', 
            borderRadius: '4px', 
            fontSize: '0.75rem', 
            overflowX: 'auto',
            fontFamily: 'monospace',
            margin: '0.25rem 0'
          }}>
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Heading Processing
    if (line.startsWith('### ')) {
      renderedLines.push(<h3 key={index} style={{ fontSize: '0.7rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>{renderInline(line.substring(4))}</h3>);
      return;
    }
    if (line.startsWith('## ')) {
      renderedLines.push(<h2 key={index} style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0.6rem 0 0.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.1rem' }}>{renderInline(line.substring(3))}</h2>);
      return;
    }
    if (line.startsWith('# ')) {
      renderedLines.push(<h1 key={index} style={{ fontSize: '1rem', fontWeight: 700, margin: '0.8rem 0 0.4rem' }}>{renderInline(line.substring(2))}</h1>);
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      renderedLines.push(
        <blockquote key={index} style={{ borderLeft: '4px solid #4e5058', paddingLeft: '0.75rem', margin: '0.25rem 0', color: '#dbdee1' }}>
          {renderInline(line.substring(2))}
        </blockquote>
      );
      return;
    }

    // Lists
    if (line.trim().startsWith('- ')) {
      renderedLines.push(
        <div key={index} style={{ display: 'flex', gap: '0.5rem', paddingLeft: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <div>{renderInline(line.trim().substring(2))}</div>
        </div>
      );
      return;
    }

    // Regular line
    renderedLines.push(<div key={index}>{renderInline(line)}</div>);
  });

  return <div className="markdown-container" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>{renderedLines}</div>;
};

// Helper to render inline markdown
function renderInline(text: string): React.ReactNode {
  let parts: (string | React.ReactNode)[] = [text];

  // Specific Discord Links (before general URLs)
  parts = splitByRegex(parts, /https?:\/\/discord\.com\/channels\/\d+\/\d+(?:\/\d+)?/g, () => <span className="md-mention" style={{ color: '#c9cdfb' }}>#channel</span>);
  
  // General URLs
  parts = splitByRegex(parts, /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, (match) => (
    <a href={match} target="_blank" rel="noopener noreferrer" style={{ color: '#00a8fc', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>
      {match}
    </a>
  ));

  // Bold
  parts = splitByRegex(parts, /\*\*(.*?)\*\*/g, (match) => <strong>{match}</strong>);
  // Underline
  parts = splitByRegex(parts, /__(.*?)__/g, (match) => <span style={{ textDecoration: 'underline' }}>{match}</span>);
  // Italic
  parts = splitByRegex(parts, /\*(.*?)\*/g, (match) => <em>{match}</em>);
  parts = splitByRegex(parts, /_(.*?)_/g, (match) => <em>{match}</em>);
  // Strikethrough
  parts = splitByRegex(parts, /~~(.*?)~~/g, (match) => <del>{match}</del>);
  // Inline Code
  parts = splitByRegex(parts, /`(.*?)`/g, (match) => <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.25rem', borderRadius: '3px', fontFamily: 'monospace' }}>{match}</code>);
  // Spoilers
  parts = splitByRegex(parts, /\|\|(.*?)\|\|/g, (match) => <Spoiler text={match} />);
  // Mentions
  parts = splitByRegex(parts, /<@!?(\d+)>/g, () => <span className="md-mention">@mention</span>);
  parts = splitByRegex(parts, /<@&(\d+)>/g, () => <span className="md-mention">@role</span>);
  parts = splitByRegex(parts, /<#(\d+)>/g, () => <span className="md-mention" style={{ color: '#c9cdfb' }}>#channel</span>);

  return <>{parts}</>;
}

// Utility to split strings/nodes by regex
function splitByRegex(
  parts: (string | React.ReactNode)[],
  regex: RegExp,
  wrapper: (match: string) => React.ReactNode
): (string | React.ReactNode)[] {
  const result: (string | React.ReactNode)[] = [];

  parts.forEach(part => {
    if (typeof part !== 'string') {
      result.push(part);
      return;
    }

    let lastIndex = 0;
    let match;
    // Reset regex index for safety
    regex.lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        result.push(part.substring(lastIndex, match.index));
      }
      // Add wrapped match (usually capture group 1)
      result.push(wrapper(match[1] || match[0]));
      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < part.length) {
      result.push(part.substring(lastIndex));
    }
  });

  return result;
}

const Spoiler: React.FC<{ text: string }> = ({ text }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span 
      onClick={() => setRevealed(true)}
      style={{ 
        background: revealed ? 'rgba(255,255,255,0.1)' : '#1e1f22', 
        color: revealed ? 'inherit' : 'transparent',
        borderRadius: '3px',
        padding: '0 2px',
        cursor: revealed ? 'text' : 'pointer',
        transition: 'background 0.2s'
      }}
    >
      {text}
    </span>
  );
};

export default Markdown;
