import { html, LitElement } from 'lit';
import { api } from '../lib/api';

export class RecipeDetailScreen extends LitElement {
  static properties = {
    recipeId: { type: String },
    selectedRecipe: { state: true },
    isLoading: { state: true },
    error: { state: true },
  };

  recipeId = '';
  selectedRecipe: any = null;
  isLoading = true;
  error = '';

  connectedCallback() {
    super.connectedCallback();
    this.loadRecipe();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async loadRecipe() {
    if (!this.recipeId) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.error = '';
    try {
      const data = await api.getRecipe(this.recipeId);
      this.selectedRecipe = data;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load recipe';
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    if (this.isLoading) {
      return html`<div>Loading recipe...</div>`;
    }
    if (this.error) {
      return html`<div>${this.error}</div>`;
    }
    if (!this.selectedRecipe) {
      return html`<div>Recipe not found.</div>`;
    }

    const { title, description, ingredients, instructions } = this.selectedRecipe;

    return html`
      <div>
        <a href="/">&larr; Back to recipes</a>
        <h2>${title}</h2>
        ${description ? html`<p>${description}</p>` : ''}

        <h3>Ingredients</h3>
        <ul>
          ${(ingredients || []).map(
            (ing: any) => html`<li>${ing.quantity} ${ing.unit} ${ing.name}</li>`
          )}
        </ul>

        <h3>Instructions</h3>
        <ol>
          ${(instructions || []).map((inst: any) => html`<li>${inst.text}</li>`)}
        </ol>
      </div>
    `;
  }
}

customElements.define('recipe-detail-screen', RecipeDetailScreen);
