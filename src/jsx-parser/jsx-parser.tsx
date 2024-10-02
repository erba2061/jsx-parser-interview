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

const definitionRex = /<(\w+)(?:\s+)?(?:\/|>([\s\S]*?)<\/\1)>/;

function parseDefinition(value: string) {
  const sanitized = value.trim();

  const match = sanitized.match(definitionRex);
  if (!match) return { raw: sanitized };

  const [raw, symbol, children] = match;
  return { raw, symbol, children, index: match.index };
}

function parseJsx(value: string): ReactNode[] {
  const list: ReactNode[] = [];
  if (!value) return list;

  const bound = 10;

  let chunk = value.trim();

  let iter = 0;

  while (iter < bound) {
    iter += 1;

    const { raw, symbol, children, index } = parseDefinition(chunk);

    if (index) {
      list.push(chunk.slice(0, index));
      chunk = chunk.slice(index);
    }

    chunk = chunk.replace(raw, "");

    if (symbol) {
      const component = symbolStore[symbol as keyof typeof symbolStore];

      if (!component) throw new Error(`unknown symbol ${symbol}`);

      list.push(createElement(component, {}, ...parseJsx(children)));

      continue;
    }

    list.push(raw);

    return list;
  }

  throw new Error(`bound reached for chunk ${chunk}`);
}

export const JSXParser = ({ value }: JSXParserProps) => {
  return createElement(Fragment, {}, ...parseJsx(value));
};
