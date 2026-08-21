import { render } from "lit";
import { useAuthStore } from "./authStore";

export const REDIRECT_KEY = "auth.redirectTo";

class AppRouter {
  constructor() {
    this.outlet = null;
    this.routes = [];
    this._ready = false;
    this._onPopState = () => this._resolve();
    this._onClick = (e) => this._handleClick(e);
  }

  init({ outlet, routes }) {
    this.outlet = outlet;
    this.routes = routes.map((route) => ({
      ...route,
      pattern: new URLPattern({ pathname: route.path }),
    }));
    this._ready = true;
    window.addEventListener("popstate", this._onPopState);
    document.addEventListener("click", this._onClick);
    return this._resolve();
  }

  destroy() {
    window.removeEventListener("popstate", this._onPopState);
    document.removeEventListener("click", this._onClick);
    this._ready = false;
  }

  navigate(path, { replace = false } = {}) {
    if (!this._ready) return;
    const url = new URL(path, window.location.origin);
    if (url.pathname + url.search === window.location.pathname + window.location.search)
      return;
    if (replace) history.replaceState(null, "", url.href);
    else history.pushState(null, "", url.href);
    return this._resolve();
  }

  _handleClick(e) {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    const link = e.target.closest("a[href]");
    if (!link) return;
    if (link.target && link.target !== "_self") return;
    const url = new URL(link.getAttribute("href"), window.location.origin);
    if (url.origin !== window.location.origin) return;
    if (url.pathname + url.search === window.location.pathname + window.location.search)
      return;
    e.preventDefault();
    this.navigate(url.pathname + url.search);
  }

  _match(pathname, search) {
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

  async _resolve() {
    if (!this._ready) return;
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
      const target = route.redirectTo || "/login";
      if (target === "/login") sessionStorage.setItem(REDIRECT_KEY, pathname + search);
      return this.navigate(target, { replace: true });
    }

    if (route.title) document.title = route.title;
    const template = await route.render({ params, query, pathname });
    this._commit(template);
  }

  _commit(template) {
    const apply = () => render(template, this.outlet);
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
    window.scrollTo(0, 0);
  }
}

export const router = new AppRouter();
