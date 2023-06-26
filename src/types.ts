export interface Text {
  type: 'text',
  text: string,
  raw: string,
  mark?: boolean,
  italic?: boolean,
  bold?: boolean,
  underline?: boolean,
  strikethrough?: boolean,
  code?: boolean,
}

export interface Link {
  type: 'link',
  href: string,
  children: Text[],
  raw: string,
}

export type Inline = Text | Link;

export interface Paragraph {
  type: 'paragraph',
  children: Inline[],
  raw: string,
}

export interface Heading {
  type: 'heading',
  level: number,
  children: Text[],
  raw: string,
}

export interface Blockquote {
  type: 'blockquote',
  children: Paragraph[],
  raw: string,
}

export interface CodeBlock {
  type: 'codeblock',
  language: string,
  code: string,
  raw: string,
}

export interface ListItem {
  type: 'listItem',
  children: Paragraph[],
  raw: string,
}

export interface List {
  type: 'list',
  ordered: boolean,
  children: ListItem[],
  raw: string,
}

export interface Image {
  type: 'image',
  src: string,
  alt: string,
  raw: string,
}

export interface TableCell {
  type: 'tablecell',
  children: Paragraph[],
  raw: string,
}

export interface TableRow {
  type: 'tablerow',
  children: TableCell[],
  raw: string,
}

export interface Table {
  type: 'table',
  header: TableRow,
  body: TableRow[],
  raw: string,
}

export interface Hr {
  type: 'hr',
  raw: string,
}

export interface NewLine {
  type: 'newline',
  raw: string,
}

export type Block = 
  | Paragraph 
  | Heading 
  | Blockquote 
  | CodeBlock 
  | List 
  | Image 
  | Table 
  | Hr
  | NewLine;

