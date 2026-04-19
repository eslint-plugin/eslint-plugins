export type ESLintReport = {
  node: any;
  message: string;
};

export type ESLintSettings = {
  [key: string]: unknown;
  "jsx-a11y"?: {
    components?: { [key: string]: string };
    attributes?: { for?: string[] };
    polymorphicPropName?: string;
    polymorphicAllowList?: string[];
  };
};

export type ESLintContext = {
  options: Record<string, unknown>[];
  report: (report: ESLintReport) => void;
  settings: ESLintSettings;
};

export type ESLintConfig = {
  meta?: { [key: string]: unknown };
  create: (context: ESLintContext) => unknown;
};

export type ESLintVisitorSelectorConfig = {
  [key: string]: unknown;
};
