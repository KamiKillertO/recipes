import { html, LitElement } from "lit";
import { useAuthStore } from "../src/lib/authStore";

export class RecipeDetailScreen extends LitElement {
  constructor() {
    super();
    this.id = "";
  }

  state = {
    id: "",
    selectedRecipe: null,
    isLoading: true,
  };

  async connectedCallback() {
    super.connectedCallback();
    const urlParams = new URLSearchParams(window.location.search);
    this.state = { ...this.state, id: urlParams.get("id") || "" };
    this.loadRecipe();
  }

  async loadRecipe() {
    const { id } = this.state;
    if (!id) {
      this.state = { ...this.state, isLoading: false };
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/recipes/${id}`
      );
      const data = await response.json();
      this.state = { ...this.state, selectedRecipe: data, isLoading: false };
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      this.state = { ...this.state, isLoading: false };
    }
  }

  render() {
    const { id, selectedRecipe, isLoading } = this.state;

    if (isLoading || !selectedRecipe) {
      return html` <div class="loading">Loading recipe...</div> `;
    }

    const { title, description, ingredients, instructions } = selectedRecipe;

    return html`
      <div class="recipe-detail-page">
        <h2>${title}</h2>
        <p>${description}</p>

        <h3>Ingredients</h3>
        ${ingredients.map(
          (ing: any) => html` <div class="ingredient-item">
            ${ing.quantity} ${ing.unit} ${ing.name}
          </div> `
        )}

        <h3>Instructions</h3>
        ${instructions.map(
          (inst: any) => html` <div class="instruction-item">
            ${inst.step_number}. ${inst.text}
          </div> `
        )}
      </div>
    `;
  }
}

customElements.define("recipe-detail-screen", RecipeDetailScreen);
