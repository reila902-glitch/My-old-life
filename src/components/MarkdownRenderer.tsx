import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Parse paragraphs, headings, blockquotes, lists, and bold text
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={key} className="space-y-2 my-4 pl-2 list-none">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (text: string) => {
    // Process bold **text** and quotes
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-stone-900 bg-amber-100/70 px-1 py-0.5 rounded">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList(`list-${idx}`);
      return;
    }

    // Heading 1
    if (trimmed.startsWith('# ')) {
      flushList(`list-${idx}`);
      elements.push(
        <div key={idx} className="mt-8 mb-4 pt-4 border-t border-stone-200/80">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-batang flex items-center gap-2">
            {formatInline(trimmed.slice(2))}
          </h2>
        </div>
      );
      return;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      flushList(`list-${idx}`);
      elements.push(
        <h3 key={idx} className="text-lg sm:text-xl font-bold text-amber-950 font-batang mt-6 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 inline-block"></span>
          {formatInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      flushList(`list-${idx}`);
      elements.push(
        <h4 key={idx} className="text-base sm:text-lg font-semibold text-stone-800 mt-4 mb-2">
          {formatInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      flushList(`list-${idx}`);
      elements.push(
        <blockquote
          key={idx}
          className="my-3 pl-4 pr-3 py-2 border-l-4 border-amber-600 bg-amber-50/60 text-stone-700 italic rounded-r-md text-sm sm:text-base leading-relaxed"
        >
          {formatInline(trimmed.replace(/^>\s?/, ''))}
        </blockquote>
      );
      return;
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      inList = true;
      const bulletText = trimmed.replace(/^[-*•]\s+/, '');
      listItems.push(
        <li key={`li-${idx}`} className="flex items-start gap-2 text-stone-700 leading-relaxed text-sm sm:text-base">
          <span className="text-amber-600 mt-1.5 flex-shrink-0 text-xs">◆</span>
          <span className="flex-1">{formatInline(bulletText)}</span>
        </li>
      );
      return;
    }

    // Regular paragraph
    flushList(`list-${idx}`);
    elements.push(
      <p key={idx} className="my-2.5 text-stone-700 leading-relaxed text-sm sm:text-base">
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList(`list-final`);

  return <div className="prose-senior max-w-none">{elements}</div>;
};
