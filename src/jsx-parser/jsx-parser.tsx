import { Fragment, ReactNode, createElement, memo } from "react";
import { AppShell, AppMenu, MenuItem, AppContent } from "./symbols";

const symbolStore = {
  AppShell,
  AppMenu,
  MenuItem,
  AppContent,
};

interface JSXParserProps {
  value: string;
}

type Frag = { name: string; data: (Frag | string)[]; parent: Frag | null };
const newFragment = (name: string): Frag => {
  return { name, data: [], parent: null };
};

type Token = { text: string; tag: boolean; end: boolean; selfend: boolean };
const newToken = (): Token => ({
  text: "",
  tag: false,
  end: false,
  selfend: false,
});

export const parse = (value: string): Frag[] | string => {
  const root = newFragment("fragment");
  const stack = [root];

  let nextToken = newToken();

  for (let pos = 0; pos < value.length; pos += 1) {
    const char = value[pos];
    const parent = stack[stack.length - 1];

    if (char === ">") {
      if (nextToken.tag) {
        const name = nextToken.text.split(/\s/)[0];
        if (nextToken.end) {
          if (parent.name !== name) return value;
          stack.pop();
          nextToken = newToken();
        } else if (nextToken.selfend) {
          const fragment = newFragment(name);
          parent.data.push(fragment);
          nextToken = newToken();
        } else {
          const fragment = newFragment(name);
          parent.data.push(fragment);
          stack.push(fragment);
          nextToken = newToken();
        }
      }
      continue;
    }

    if (char === "/") {
      if (nextToken.tag) {
        if (nextToken.text.length) {
          nextToken.selfend = true;
        } else {
          nextToken.end = true;
        }
      } else {
        nextToken.text = nextToken.text + char;
      }
      continue;
    }

    if (char === "<") {
      nextToken.text = nextToken.text.trim();
      if (nextToken.text) parent.data.push(nextToken.text);

      nextToken = newToken();
      nextToken.tag = true;
      continue;
    }

    nextToken.text = nextToken.text + char;
  }

  return root.data;
};

const children = (list: (Frag | string)[]): ReactNode[] => {
  return list.map((item) => {
    if (typeof item === "string") {
      return item;
    }
    return createElement(
      symbolStore[item.name as keyof typeof symbolStore],
      {},
      ...children(item.data)
    );
  });
};

export const JSXParser = memo(({ value }: JSXParserProps) => {
  const root = parse(value);

  if (typeof root === "string") return root;

  return createElement(Fragment, {}, ...children(root));
});
