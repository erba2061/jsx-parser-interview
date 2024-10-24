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
  const parsedArray = value.match(/<[^>]+>|[^<]+/g);

  const fa = parsedArray
    ?.map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  console.log(fa);

  if (!fa?.length) {
    return null;
  }

  // string[]
  // { type: 'text' | 'opening' | 'closing' | 'selfclosing', value: string }[]
  const a = fa.map((item) => {
    const matchOpening = item.match(/^<([^\/<]*)(?!\/)>$/);
    const matchClosing = item.match(/^<\/([^<]*)>$/);
    const matchSelfClosing = item.match(/^<([^<]*)\/>$/);

    if (matchOpening) {
      return { type: "opening", value: matchOpening[1] };
    }
    if (matchClosing) {
      return { type: "closing", value: matchClosing[1] };
    }
    if (matchSelfClosing) {
      return { type: "selfclosing", value: matchSelfClosing[1] };
    }
    return { type: "text", value: item };
  });

  console.log(a);

  return createElement("pre", {}, value);
};
