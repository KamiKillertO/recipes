import { html, LitElement } from "lit";
import { useAuthStore } from "./authStore";

export class AppRouter extends LitElement {
  private currentPage = "";

  connectedCallback() {
    super.connectedCallback();
    // Listen for anchor clicks to navigate
    document.addEventListener("click", this.handleClick);
    // Check auth on load
    useAuthStore.getState().checkAuth();
    this.updatePage();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleClick);
  }

  private handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLAnchorElement;
    if (target.href && target.host === location.host) {
      e.preventDefault();
      this.navigate(target.pathname);
    }
  };

  private navigate(url: string) {
    history.pushState(null, "", url);
    this.currentPage = url;
    this.updatePage();
  }

  private updatePage() {
    const { isAuthenticated } = useAuthStore.getState();
    const path = this.currentPage || "/";

    // Render based on route + auth status
    if (path === "/login" || path === "/register") {
      if (isAuthenticated) {
        this.navigate("/");
      }
    }

    // Render the appropriate page component
    this.renderPage(path, isAuthenticated);
  }

  protected render() {
    return html` <div id="app-root"></div> `;
  }

  protected renderPage(path: string, authenticated: boolean) {
    // This will be overridden by subclasses or we use innerHTML
    // For now, just show a message
    return html` <p>Page: ${path}</p> `;
  }
}

customElements.define("app-router", AppRouter);