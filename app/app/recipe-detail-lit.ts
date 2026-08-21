import { html, LitElement } from "lit";
import { api } from "../src/lib/api";

export class RecipeDetailScreen extends LitElement {
  static properties = {
    recipeId: { type: String },
    selectedRecipe: { state: true },
    isLoading: { state: true },
    error: { state: true },
  };

  constructor() {
    super();
    this.recipeId = "";
    this.selectedRecipe = null;
    this.isLoading = true;
    this.error = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadRecipe();
  }

  async loadRecipe() {
    if (!this.recipeId) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.error = "";
    try {
      const data = await api.getRecipe(this.recipeId);
      this.selectedRecipe = data;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load recipe";
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    if (this.isLoading) {
      return html`<div class="loading">Loading recipe...</div>`;
    }
    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }
    if (!this.selectedRecipe) {
      return html`<div class="muted">Recipe not found.</div>`;
    }

    const { title, description, ingredients, instructions } = this.selectedRecipe;

    return html`
      <div class="recipe-detail-page">
        <a class="back-link" href="/">&larr; Back to recipes</a>
        <h2>${title}</h2>
        ${description ? html`<p>${description}</p>` : ""}

        <h3>Ingredients</h3>
        <ul class="recipe-list">
          ${(ingredients || []).map(
            (ing) => html`<li>${ing.quantity} ${ing.unit} ${ing.name}</li>`
          )}
        </ul>

        <h3>Instructions</h3>
        <ol>
          ${(instructions || []).map((inst) => html`<li>${inst.text}</li>`)}
        </ol>
      </div>
    `;
  }
}

customElements.define("recipe-detail-screen", RecipeDetailScreen);