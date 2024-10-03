import { Fragment, ReactNode, createElement, useCallback } from "react";
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

function newParser(lexer: Lexer) {
  let currToken = lexer.getNextToken();

  function curr() {
    return currToken;
  }

  function eat(tokenType: TokenType) {
    const token = currToken;
    if (token.token !== tokenType)
      throw new Error(`expected token ${tokenType}, got ${token.token}`);
    currToken = lexer.getNextToken();
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

const alphanumeric = /[0-9a-zA-Z]/;

function newLexer(value: string) {
  let pos = 0;

  function curr() {
    return value[pos];
  }

  function skipWhitespace() {
    while (curr() === " " || curr() === "\n") {
      pos += 1;
    }
  }

  function getTag() {
    if (curr() !== "<") throw new Error(`unexpected token ${curr()}`);
    let closed = false;
    let tag = "";
    let resetPos = pos;
    let end = false;

    pos += 1;

    if (curr() === "/") {
      end = true;
      pos += 1;
    }

    if (!alphanumeric.test(curr())) {
      console.log("didnot pass stupid test");
      pos = resetPos;
      return;
    }

    let tagfilled = false;
    while (curr() && curr() !== "/" && curr() !== ">") {
      const peeked = curr();
      console.log("peeked", peeked);
      if (!tagfilled && alphanumeric.test(peeked)) {
        tag = tag + peeked;
        pos += 1;
        continue;
      }
      tagfilled = true;
      pos += 1;
    }

    if (!end && curr() === "/") {
      closed = true;
      pos += 1;
    }

    if (curr() !== ">") {
      console.log("> issue", curr());
      // throw new Error(`missing tag end, got ${curr()}`);
      pos = resetPos;
      return;
    }

    pos += 1;

    return {
      token: end ? TokenType.TagEnd : TokenType.Tag,
      ...(!end && { closed }),
      tag,
    };
  }

  function getText() {
    let text = curr();
    pos += 1;
    while (curr() && curr() !== "<") {
      text = text + curr();
      pos += 1;
    }
    return { token: TokenType.Text, text: text.trim() };
  }

  function getNextToken() {
    if (pos > value.length - 1) {
      return { token: TokenType.EOF };
    }

    const current = curr();

    if (current === " " || current === "\n") {
      skipWhitespace();
      return getNextToken();
    }

    if (current === "<") {
      const token = getTag();
      if (token) return token;
    }

    return getText();
  }

  return { getNextToken };
}

type Lexer = ReturnType<typeof newLexer>;

export const JSXParser = ({ value }: JSXParserProps) => {
  const parse = useCallback(() => {
    try {
      const parser = newParser(newLexer(value));
      return parser.parse();
    } catch (e) {
      return [createElement("mark", {}, String(e))];
    }
  }, [value]);
  return createElement(Fragment, {}, ...parse());
};
