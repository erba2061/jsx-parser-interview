import { ReactNode, createElement } from "react";
import { AppShell, AppMenu, MenuItem, AppContent } from "./symbols";

const symbolStore = {
  AppShell,
  AppMenu,
  MenuItem,
  AppContent,
};

console.log(symbolStore);

interface JSXParserProps {
  value: string;
}

const tagReg = /<(\w+)(\/?)>/;

const tagEndReg = /<\/(\w+)(?:\s+)?>/;

enum NodeType {
  Tag,
  TagEnd,
  Text,
}

type TagNode = { node: NodeType.Tag; tag: string; closed: boolean };

type TagEndNode = { node: NodeType.TagEnd; tag: string };

type TextNode = { node: NodeType.Text; text: string };

function newParser(value: string) {
  let pos = 0;

  function peek() {
    return value[pos + 1];
  }

  function peekSlice() {
    return value.slice(pos);
  }

  function digest(part: string) {
    if (value.slice(pos, part.length) !== part)
      throw new Error(`digest issue ${part}`);
    pos += part.length;
  }

  function skipWhitespace() {
    let maybe = peek();
    while (maybe === " " || maybe === "\n") {
      digest(maybe);
      maybe = peek();
    }
  }

  function singularNode(): TagNode | TagEndNode | TextNode {
    const nextCh = peek();

    if (nextCh === '<') {
      const match = peekSlice().match(tagReg);
      if (match) {
      digest(match[0]);
      return { node: NodeType.Tag, tag: match[1], closed: !!match[2] };
    }
    }
    if (node === NodeType.TagEnd) {
      const match = value.slice(pos).match(tagEndReg);
      if (!match) throw new Error(`expected tagEnd, got ${peek()}`);
      digest(match[0]);
      return { node: NodeType.TagEnd, tag: match[1] };
    }
    if (node === NodeType.Text) {
      let char = peek();
      let text = "";
      while (!["<"].includes(char)) {
        text = text + char;
        digest(char);
        char = peek();
        if (char)
      }
    }
  }

  function itemNode() {}

  function listNode() {
    const store: ReactNode[] = [];
    let node = itemNode();
    while (node) {
      store.push(node);
      node = itemNode();
    }
    return store;
  }

  function parse() {
    const list: ReactNode = [];
    return listNode();
  }
}

export const JSXParser = ({ value }: JSXParserProps) => {
  return createElement("pre", {}, value);
};
