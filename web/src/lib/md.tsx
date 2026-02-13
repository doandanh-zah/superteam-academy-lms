import React from 'react';

// Minimal markdown renderer (headings + paragraphs + lists + code blocks).
// Keeps deps light for the MVP.
export function renderMd(md: string) {
  const lines = md.split(/\r?\n/);
  const out: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(lines[i]);
        i++;
      }
      // consume closing ```
      i++;
      out.push(
        <pre key={`code-${out.length}`} className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4 overflow-x-auto text-xs">
          <code>{buf.join('\n')}</code>
        </pre>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      out.push(
        <h1 key={`h1-${out.length}`} className="text-2xl font-black tracking-tight">
          {line.slice(2)}
        </h1>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      out.push(
        <h2 key={`h2-${out.length}`} className="mt-6 text-lg font-extrabold">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      out.push(
        <ul key={`ul-${out.length}`} className="mt-3 list-disc pl-5 space-y-1 text-sm text-white/75">
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    // paragraph
    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith('#') && !lines[i].startsWith('- ') && !lines[i].startsWith('```')) {
      para.push(lines[i]);
      i++;
    }
    out.push(
      <p key={`p-${out.length}`} className="mt-3 text-sm leading-6 text-white/75">
        {para.join(' ')}
      </p>
    );
  }

  return out;
}
