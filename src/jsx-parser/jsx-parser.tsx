import { Fragment, createElement } from "react";
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

const children = (element) => {
  const a = [];
  for (const child of element.childNodes) {
    if (child.nodeType === 1 && symbolStore[child.tagName])
      a.push(createElement(symbolStore[child.tagName], {}, ...children(child)));
    else a.push(child.textContent);
  }
  return a;
};

export const JSXParser = ({ value }: JSXParserProps) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(value, "text/xml");

  return createElement(Fragment, {}, ...children(xmlDoc));
};
