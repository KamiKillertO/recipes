import { render, type TemplateResult } from "lit";
import { useAuthStore } from "./authStore";

export const REDIRECT_KEY = "auth.redirectTo";

export interface RouteContext {
  params: Record<string, string>;
  query: Record<string, string>;
  pathname: string;
}

export interface Route {
  path: string;
  title?: string;
  guard?: () => boolean | Promise<boolean>;
  redirectTo?: string;
  render: (ctx: RouteContext) => TemplateResult;
}

interface MatchedRoute extends Route {
  pattern: URLPattern;
}

export class AppRouter {
  private outlet: HTMLElement | null = null;
  private routes: MatchedRoute[] = [];
  private ready = false;
  private onPopState = () => this._resolve();
  private onClick = (e: MouseEvent) => this._handleClick(e);

  init({ outlet, routes }: { outlet: HTMLElement; routes: Route[] }): Promise<void> {
    this.outlet = outlet;
    this.routes = routes.map((route) => ({
      ...route,
      pattern: new URLPattern({ pathname: route.path }),
    }));
    this.ready = true;
    window.addEventListener("popstate", this.onPopState);
    document.addEventListener("click", this.onClick);
    return this._resolve();
  }

  destroy(): void {
    window.removeEventListener("popstate", this.onPopState);
    document.removeEventListener("click", this.onClick);
    this.ready = false;
  }

  navigate(path: string, { replace = false }: { replace?: boolean } = {}): Promise<void> | void {
    if (!this.ready) return;
    const url = new URL(path, window.location.origin);
    if (url.pathname + url.search === window.location.pathname + window.location.search) return;
    if (replace) history.replaceState(null, "", url.href);
    else history.pushState(null, "", url.href);
    return this._resolve();
  }

  private _handleClick(e: MouseEvent): void {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    const link = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
    if (!link) return;
    if (link.target && link.target !== "_self") return;
    const url = new URL(link.getAttribute("href") ?? "", window.location.origin);
    if (url.origin !== window.location.origin) return;
    if (url.pathname + url.search === window.location.pathname + window.location.search) return;
    e.preventDefault();
    this.navigate(url.pathname + url.search);
  }

  private _match(pathname: string, search: string) {
    for (const route of this.routes) {
      const result = route.pattern.exec({ pathname, search });
      if (result) {
        return {
          route,
          params: { ...result.pathname.groups, ...result.search.groups },
          query: Object.fromEntries(new URLSearchParams(search)),
        };
      }
    }
    return null;
  }

  private async _resolve(): Promise<void> {
    if (!this.ready || !this.outlet) return;
    const { pathname, search } = window.location;
    const matched = this._match(pathname, search);

    if (!matched) {
      return this.navigate(
        useAuthStore.getState().isAuthenticated ? "/" : "/login",
        { replace: true }
      );
    }

    const { route, params, query } = matched;

    if (route.guard && !(await route.guard())) {
      const target = route.redirectTo ?? "/login";
      if (target === "/login") sessionStorage.setItem(REDIRECT_KEY, pathname + search);
      return this.navigate(target, { replace: true });
    }

    if (route.title) document.title = route.title;
    const template = await route.render({ params, query, pathname });
    this._commit(template);
  }

  private _commit(template: TemplateResult): void {
    const apply = () => render(template, this.outlet!);
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
    window.scrollTo(0, 0);
  }
}

export const router = new AppRouter();