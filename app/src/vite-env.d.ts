/// <reference types="vite/client" />

interface URLPatternInit {
  pathname?: string;
}

interface URLPatternGroupsResult {
  groups: Record<string, string | undefined>;
}

interface URLPatternResult {
  pathname: URLPatternGroupsResult;
  search: URLPatternGroupsResult;
}

interface URLPattern {
  exec(input: { pathname: string; search: string }): URLPatternResult | null;
}

declare const URLPattern: {
  new (init: URLPatternInit): URLPattern;
};