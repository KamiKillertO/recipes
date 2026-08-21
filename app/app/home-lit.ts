import { html, LitElement } from "lit";
import { api } from "../src/lib/api";
import { useAuthStore } from "../src/lib/authStore";
import { router } from "../src/lib/router";

export class HomeScreen extends LitElement {
  static properties = {
    recipes: { state: true },
    isLoading: { state: true },
    error: { state: true },
  };

  constructor() {
    super();
    this.recipes = [];
    this.isLoading = true;
    this.error = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  async _load() {
    this.isLoading = true;
    this.error = "";
    try {
      const recipes = await api.getRecipes();
      this.recipes = recipes || [];
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load recipes";
    } finally {
      this.isLoading = false;
    }
  }

  _logout() {
    useAuthStore.getState().logout();
    router.navigate("/login", { replace: true });
  }

  render() {
    const { recipes, isLoading, error } = this;

    return html`
      <div class="home-page">
        <header class="home-header">
          <h1>My Recipes</h1>
          <div class="home-actions">
            <a href="/new-recipe" class="button">New Recipe</a>
            <a href="/import" class="button secondary">Scan Recipe</a>
            <button class="toggle-button" @click="${this._logout}">Logout</button>
          </div>
        </header>

        ${isLoading ? html`<p class="muted">Loading recipes...</p>` : ""}
        ${error ? html`<p class="error">${error}</p>` : ""}

        ${!isLoading && !error && recipes.length === 0
          ? html`<p class="muted">No recipes yet. Create your first one!</p>`
          : ""}

        <ul class="recipe-list">
          ${recipes.map(
            (r) => html`
              <li class="recipe-card">
                <a href="/recipe/${r.id}">
                  <h2>${r.title}</h2>
                  ${r.description ? html`<p>${r.description}</p>` : ""}
                </a>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }
}

customElements.define("home-screen", HomeScreen);