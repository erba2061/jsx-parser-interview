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

export const JSXParser = ({ value }: JSXParserProps) => {
  // code here
  return createElement("pre", {}, value);
};
