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

// function token() {
//   let nextCh = peek();

//   if (nextCh === "<") {
//     const tagM = peekSlice().match(tagReg);
//     if (tagM) {
//       return { node: TokenType.Tag, tag: tagM[1], closed: !!tagM[2] };
//     }
//     const tagEndM = value.slice(pos).match(tagEndReg);
//     if (tagEndM) {
//       return { node: TokenType.TagEnd, tag: tagEndM[1] };
//     }
//     return { node: TokenType.Text, text: nextCh };
//   }

//   let text = nextCh;
//   while (nextCh !== "<") {
//     text = text + nextCh;
//     nextCh = peek();
//   }
//   return { node: TokenType.Text, text: text.trim() };
// }
function newParser(value: Token[]) {
  let pos = 0;

  function peek() {
    return value[pos + 1];
  }

  function eat(tokenType: TokenType) {
    const token = value[pos];
    if (token.token !== tokenType)
      throw new Error(`expected token ${tokenType}, got ${value[pos].token}`);
    pos += 1;
    return token;
  }

  function componentNode() {
    const tag = eat(TokenType.Tag);

    let { token } = peek();

    let children: ReactNode[] = [];
    if (token === TokenType.Tag || token === TokenType.Text) {
      children = listNode();
    }

    eat(TokenType.TagEnd);

    return createElement(symbolStore[tag.tag], {}, ...children);
  }

  function itemNode() {
    let item = peek();
    if (item.token === TokenType.Text) {
      console.log(item);
      eat(TokenType.Text);
      return item.text;
    }
    return componentNode();
  }

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
    return listNode();
  }
  return { parse };
}

export const JSXParser = ({ value }: JSXParserProps) => {
  return newParser([
    tag("AppContent", false),
    text("Hello"),
    tagEnd("AppContent"),
  ]).parse();
};
