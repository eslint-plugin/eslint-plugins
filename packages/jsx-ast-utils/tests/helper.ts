import babelParser from "@babel/parser";
import flowParser from "flow-parser";

import getProp from "../src/getProp";

type PluginName = "jsx" | "functionBind" | "estree" | "typescript";

const defaultPlugins = ["jsx", "functionBind", "estree"] as const;
let plugins: PluginName[] = [...defaultPlugins];

export type ParserName = "babel" | "flow";

let parserName: ParserName;
export function setParserName(name: ParserName): void {
  parserName = name;
}

export function changePlugins(
  pluginOrFn: PluginName[] | ((plugins: PluginName[]) => PluginName[]),
): void {
  if (Array.isArray(pluginOrFn)) {
    plugins = pluginOrFn;
  } else if (typeof pluginOrFn === "function") {
    plugins = pluginOrFn(plugins);
  } else {
    throw new Error(
      "changePlugins argument should be either an array or a function",
    );
  }
}

function parse(code: string, isESM = false) {
  if (parserName === undefined) {
    throw new Error("No parser specified");
  }
  if (parserName === "babel") {
    try {
      return babelParser.parse(code, {
        plugins,
        sourceFilename: "test.js",
        sourceType: isESM ? "module" : "script",
      });
    } catch {
      console.warn(`Failed to parse with Babel parser.`);
    }
  }
  if (parserName === "flow") {
    try {
      return flowParser.parse(code, { plugins });
    } catch {
      console.warn("Failed to parse with the Flow parser");
    }
  }
  throw new Error(`The parser ${parserName} is not yet supported for testing.`);
}

export function getOpeningElement(code: string, isESM = false) {
  const parsedCode = parse(code, isESM);
  let body;
  if (parsedCode.program) {
    // eslint-disable-next-line prefer-destructuring
    body = parsedCode.program.body;
  } else {
    // eslint-disable-next-line prefer-destructuring
    body = parsedCode.body;
  }
  if (Array.isArray(body) && body[0] != null) {
    const [{ expression }] = body;
    return expression.type === "JSXFragment"
      ? expression.openingFragment
      : expression.openingElement;
  }

  return null;
}

export function extractProp(
  code: string,
  prop = "foo",
  isESM: boolean = false,
) {
  const node = getOpeningElement(code, isESM);
  const { attributes: props } = node;
  return getProp(props, prop);
}
