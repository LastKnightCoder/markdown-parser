import { Block } from './types';
import rules from './rules';
import * as fs from 'node:fs/promises';

const parseMarkdown = (markdown: string) => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let currentLine = 0;
  
  while (currentLine < lines.length) {
    const line = lines[currentLine];
    if (rules.newline.test(line)) {
      const newline = {
        type: 'newline' as const,
        raw: line,
      };
      blocks.push(newline);
      currentLine++;
      continue;
    }
    if (rules.heading.test(line)) {
      const heading = {
        type: 'heading' as const,
        level: RegExp.$1.length,
        children: [{
          type: 'text' as const,
          text: RegExp.$2,
          raw: RegExp.$2,
        }],
        raw: line,
      };
      blocks.push(heading);
      currentLine++;
      continue;
    }
    if (rules.code.exec(line)) {
      const codeLines: string[] = [];
      while (currentLine < lines.length && rules.code.exec(lines[currentLine])) {
        codeLines.push(RegExp.$1);
        currentLine++;
      }
      const codeblock = {
        type: 'codeblock' as const,
        language: '',
        code: codeLines.join('\n'),
        raw: codeLines.join('\n'),
      };
      blocks.push(codeblock);
      continue;
    }
    if (rules.fences.exec(line)) {
      console.log('fences', RegExp.$1);
      const codeLines: string[] = [];
      const rawLines: string[] = [];
      const recordLine = currentLine;
      const language = RegExp.$1;
      rawLines.push(line);
      currentLine++;
      while (currentLine < lines.length && !rules.fences.test(lines[currentLine])) {
        rawLines.push(lines[currentLine]);
        codeLines.push(lines[currentLine]);
        currentLine++;
        console.log('currentLine', lines[currentLine], rules.fences.test(lines[currentLine]));
      }
      if (currentLine >= lines.length) {
        console.log('currentLine >= lines.length');
        currentLine = recordLine;
        const paragraph = {
          type: 'paragraph' as const,
          children: [{
            type: 'text' as const,
            text: line,
            raw: line,
          }],
          raw: line,
        };
        blocks.push(paragraph);
        currentLine++;
        continue;
      }
      rawLines.push(lines[currentLine]);
      currentLine++;
      const codeblock = {
        type: 'codeblock' as const,
        language,
        code: codeLines.join('\n'),
        raw: rawLines.join('\n'),
      };
      blocks.push(codeblock);
      continue;
    }
    if (rules.bulletedList.exec(line)) {
      const bulletedList = {
        type: 'list' as const,
        ordered: false,
        children: [{
          type: 'listItem' as const,
          children: [{
            type: 'paragraph' as const,
            children: [{
              type: 'text' as const,
              text: RegExp.$1,
              raw: RegExp.$1,
            }],
            raw: RegExp.$1,
          }],
          raw: RegExp.$1,
        }],
        raw: line,
      }
      blocks.push(bulletedList);
      currentLine++;
      continue;
    }
    if (rules.hr.test(line)) {
      const hr = {
        type: 'hr' as const,
        raw: line,
      };
      blocks.push(hr);
      currentLine++;
      continue;
    }
    if (rules.blockquote.test(line)) {
      const blockQuoteLines: string[] = [];
      const rawLines: string[] = [];
      while (currentLine < lines.length && rules.blockquote.exec(lines[currentLine])) {
        rawLines.push(lines[currentLine]);
        blockQuoteLines.push(RegExp.$1);
        currentLine++;
      }
      const blockquote = {
        type: 'blockquote' as const,
        children: blockQuoteLines.map((line, index) => ({
          type: 'paragraph' as const,
          children: [{
            type: 'text' as const,
            text: line,
            raw: line,
          }],
          raw: line,
        })),
        raw: rawLines.join('\n'),
      };
      blocks.push(blockquote);
      continue;
    }
    const paragraph = {
      type: 'paragraph' as const,
      children: [{
        type: 'text' as const,
        text: line,
        raw: line,
      }],
      raw: line,
    };
    blocks.push(paragraph);
    currentLine++;
  }
  return blocks;
}

(async function main() {
  const md = await fs.readFile('src/demo.md', 'utf-8');
  const blocks = parseMarkdown(md);
  await fs.writeFile('src/demo.json', JSON.stringify(blocks, null, 2));
})();
