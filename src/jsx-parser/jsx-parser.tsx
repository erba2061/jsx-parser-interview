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

type Token = {
  t: "tag" | "tagEnd" | "text";
};

type Node = {
  t: "component" | "text";
};

function newParser(value: string) {
  let pos = 0;

  function peek() {}

  function eat() {}

  function list() {}

  function parse() {
    const list: ReactNode = [];
    return listNode();
  }
}

export const JSXParser = ({ value }: JSXParserProps) => {
  return createElement("pre", {}, value);
};
