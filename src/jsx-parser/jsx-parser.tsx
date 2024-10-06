import { createElement } from "react";
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

type Token =
  | { token: "tag"; single: boolean; end: boolean; name: string }
  | { token: "text"; content: string };

const newTextToken = (content: string) => ({ token: "text", content });
const newTagToken = () => ({
  token: "tag",
  single: false,
  end: false,
  name: "",
});

let alphanumeric = /[a-zA-Z0-9]/;

const newScope = (scope) => {
  return { scope, data: [], parent: null };
};
export const parseTokens = (value: string): string[] => {
  const root = newScope("global");
  const stack = [root];

  let curr: any = { text: "" };

  for (let pos = 0; pos < value.length; pos += 1) {
    const char = value[pos];
    const parent = stack.at(-1);
    const tokens = parent.data;

    if (char === "/") {
      if (curr.tag) {
        if (curr.text.length) {
          curr.selfend = true;
        } else {
          curr.end = true;
        }
      } else {
        curr.text = curr.text + char;
      }
      continue;
    }

    if (char === ">") {
      if (curr.tag) {
        if (curr.end) {
          stack.pop();
          curr = { text: "" };
        } else if (curr.selfend) {
          tokens.push(curr);
          curr = { text: "" };
        } else {
          const scope = {
            parent,
            scope: curr.text.split(/\s/)[0],
            data: [],
          };
          parent.data.push(scope);
          stack.push(scope);
          curr = { text: "" };
        }
      }
      continue;
    }

    if (char === "<") {
      if (curr.text) tokens.push(curr);
      curr = { text: "", tag: true };
      continue;
    }

    if (char === " ") {
      if (!curr.text) continue;
    }

    curr.text = curr.text + char;
  }

  return root;
};

export const JSXParser = ({ value }: JSXParserProps) => {
  console.log(parseTokens(value));
  return createElement("pre", {}, value);
};
