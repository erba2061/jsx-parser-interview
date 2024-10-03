import { Fragment, ReactNode, createElement } from "react";
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

enum TokenType {
  Tag = "Tag",
  TagEnd = "TagEnd",
  Text = "Text",
  EOF = "EOF",
}

interface Token {
  token: TokenType;
}

interface TagToken extends Token {
  token: TokenType.Tag;
  tag: string;
  closed: boolean;
}

interface TagEndToken extends Token {
  token: TokenType.TagEnd;
  tag: string;
}

interface TextToken extends Token {
  token: TokenType.Text;
  text: string;
}

interface EOFToken extends Token {
  token: TokenType.EOF;
}

const tag = (tag: string, closed: boolean) => ({
  token: TokenType.Tag,
  tag,
  closed,
});
const tagEnd = (tag: string) => ({ token: TokenType.TagEnd, tag });
const text = (text: string) => ({ token: TokenType.Text, text });
const EOF = () => ({ token: TokenType.EOF });

function newParser(value: Token[]) {
  let pos = 0;

  function curr() {
    return value[pos];
  }

  function eat(tokenType: TokenType) {
    const token = value[pos];
    if (token.token !== tokenType)
      throw new Error(`expected token ${tokenType}, got ${token.token}`);
    pos += 1;
    return token;
  }

  function componentNode() {
    const tag = eat(TokenType.Tag);

    if (!tag.closed) {
      const children = listNode();

      eat(TokenType.TagEnd);

      return createElement(symbolStore[tag.tag], {}, ...children);
    }

    return createElement(symbolStore[tag.tag], {});
  }

  function listNode() {
    const store: ReactNode[] = [];
    while (curr()) {
      const currToken = curr();
      if (currToken.token === TokenType.Text) {
        eat(TokenType.Text);
        store.push(currToken.text);
      }
      if (currToken.token === TokenType.Tag) {
        store.push(componentNode());
      }
      if (currToken.token === TokenType.EOF) {
        eat(TokenType.EOF);
        return store;
      }
      if (currToken.token === TokenType.TagEnd) {
        return store;
      }
    }
    return store;
  }

  function parse() {
    return listNode();
  }
  return { parse };
}

export const JSXParser = ({ value }: JSXParserProps) => {
  const parser = newParser([
    tag("AppContent", false),
    tag("AppMenu", true),
    text("Hello"),
    tag("AppContent", false),
    text("Hello"),
    tagEnd("AppContent"),
    tagEnd("AppContent"),
    EOF(),
  ]);
  return createElement(Fragment, {}, ...parser.parse());
};
