import { html, LitElement } from "lit";
import { router } from "../src/lib/router";

export class NewRecipeScreen extends LitElement {
  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.servings = "4";
    this.prepTime = "15";
    this.cookTime = "30";
    this.ingredients = "";
    this.instructions = "";
  }

  state = {
    title: "",
    description: "",
    servings: "4",
    prepTime: "15",
    cookTime: "30",
    ingredients: "",
    instructions: "",
  };

  async handleSave() {
    if (!this.state.title.trim()) {
      console.error("Please enter a recipe title");
      return;
    }

    const ingredientLines = this.state.ingredients
      .split("\n")
      .filter((l: string) => l.trim())
      .map((i: string) => ({ name: i.trim(), quantity: "", unit: "" }));
    const instructionLines = this.state.instructions
      .split("\n")
      .filter((l: string) => l.trim())
      .map((i: string, idx: number) => ({
        step_number: idx + 1,
        text: i.trim(),
      }));

    try {
      console.log("Creating recipe:", {
        title: this.state.title,
        description: this.state.description,
        servings: parseInt(this.state.servings) || 4,
        prep_time: parseInt(this.state.prepTime) || 0,
        cook_time: parseInt(this.state.cookTime) || 0,
        source_type: "manual",
        ingredients: ingredientLines,
        instructions: instructionLines,
      });

      router.navigate("/");
    } catch (error) {
      console.error("Failed to create recipe:", error);
    }
  }

  render() {
    const { title, description, servings, prepTime, cookTime, ingredients, instructions } = this.state;

    return html`
      <div class="new-recipe-page">
        <div class="form-group">
          <label>Title *</label>
          <input
            class="input-field"
            .value="${title}"
            @input="${(e: Event) => {
              const target = e.target as HTMLInputElement;
              this.state = { ...this.state, title: target.value };
            }}"
            placeholder="Recipe name"
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <input
            class="input-field"
            .value="${description}"
            @input="${(e: Event) => {
              const target = e.target as HTMLInputElement;
              this.state = { ...this.state, description: target.value };
            }}"
            placeholder="Short description"
            multiline
            numberOfLines={4}
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Servings</label>
            <input
              class="input-field"
              type="number"
              .value="${servings}"
              @input="${(e: Event) => {
                const target = e.target as HTMLInputElement;
                this.state = { ...this.state, servings: target.value };
              }}"
              keyboardType="numeric"
            />
          </div>
          <div class="form-group">
            <label>Prep (min)</label>
            <input
              class="input-field"
              type="number"
              .value="${prepTime}"
              @input="${(e: Event) => {
                const target = e.target as HTMLInputElement;
                this.state = { ...this.state, prepTime: target.value };
              }}"
              keyboardType="numeric"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Cook (min)</label>
          <input
            class="input-field"
            type="number"
            .value="${cookTime}"
            @input="${(e: Event) => {
              const target = e.target as HTMLInputElement;
              this.state = { ...this.state, cookTime: target.value };
            }}"
            keyboardType="numeric"
          />
          </div>
        </div>

        <div class="form-group">
          <label>Ingredients (one per line)</label>
          <textarea
            class="textarea-field"
            .value="${ingredients}"
            @input="${(e: Event) => {
              const target = e.target as HTMLTextAreaElement;
              this.state = { ...this.state, ingredients: target.value };
            }}"
            placeholder="1 cup flour&#10;2 eggs&#10;1 tsp salt"
            numberOfLines={5}
          ></textarea>
        </div>

        <div class="form-group">
          <label>Instructions (one per line)</label>
          <textarea
            class="textarea-field"
            .value="${instructions}"
            @input="${(e: Event) => {
              const target = e.target as HTMLTextAreaElement;
              this.state = { ...this.state, instructions: target.value };
            }}"
            placeholder="Mix ingredients&#10;Bake at 350F"
            numberOfLines={5}
          ></textarea>
        </div>

        <button class="save-button" @click="${this.handleSave}">
          ${this.state.isSaving ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    `;
  }
}

customElements.define("new-recipe-screen", NewRecipeScreen);
