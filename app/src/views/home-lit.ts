import { html, LitElement } from 'lit';
import { api } from '../lib/api';
import { authStore } from '../lib/authStore';
import { router } from '../lib/router';

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
  	this.error = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsub = authStore.subscribe(() => this.requestUpdate());
    this._load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsub?.();
  }

  private unsub?: () => void;

  async _load() {
    this.isLoading = true;
    this.error = '';
    try {
      const recipes = await api.getRecipes();
      this.recipes = recipes || [];
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load recipes';
    } finally {
      this.isLoading = false;
    }
  }

  _logout() {
    authStore.logout();
    router.navigate('/login', { replace: true });
  }

  render() {
    const { recipes, isLoading, error } = this;

    return html`
      <div>
        <header>
          <h1>My Recipes</h1>
          <div>
            <a href="/new-recipe">New Recipe</a>
            <a href="/import">Scan Recipe</a>
            <button @click="${this._logout}">Logout</button>
          </div>
        </header>

        ${isLoading ? html`<p>Loading recipes...</p>` : ''}
        ${error ? html`<p>${error}</p>` : ''}

        ${!isLoading && !error && recipes.length === 0
          ? html`<p>No recipes yet. Create your first one!</p>`
          : ''}

        <ul>
          ${recipes.map(
            (r: any) => html`
              <li>
                <a href="/recipe/${r.id}">
                  <h2>${r.title}</h2>
                  ${r.description ? html`<p>${r.description}</p>` : ''}
                </a>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }
}

customElements.define('home-screen', HomeScreen);
