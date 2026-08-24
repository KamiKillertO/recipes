import { html, LitElement } from 'lit';
import { router } from '../lib/router';
import { authStore } from '../lib/authStore';

interface ImportState {
  image: string | null;
  dividerX: number;
  isProcessing: boolean;
  ingredients: string;
  instructions: string;
}

export class ImportScreen extends LitElement {
  static properties = {
    state: { state: true },
  };

  state: ImportState = {
    image: null,
    dividerX: 50,
    isProcessing: false,
    ingredients: '',
    instructions: '',
  };

  connectedCallback() {
    super.connectedCallback();
    this.unsub = authStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsub?.();
  }

  private unsub?: () => void;

  async handlePickImage() {
    const input = this.shadowRoot?.querySelector<HTMLInputElement>('input[type="file"]');
    if (input) input.click();
  }

  async handleProcessImage() {
    if (!this.state.image) return;
    this.state = { ...this.state, isProcessing: true };
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: this.state.image,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/api/ocr`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('OCR failed');
      const data = await response.json();
      this.state = {
        ...this.state,
        ingredients: data.ingredients || '',
        instructions: data.instructions || '',
      };
    } catch (error) {
      console.error('OCR failed:', error);
    } finally {
      this.state = { ...this.state, isProcessing: false };
    }
  }

  async handleSaveRecipe() {
    if (!this.state.ingredients.trim() && !this.state.instructions.trim()) {
      console.error('No recipe data to save');
      return;
    }
    const ingredientLines = this.state.ingredients
      .split('\n')
      .filter((l) => l.trim())
      .map((name) => ({ name: name.trim(), quantity: '', unit: '' }));
    const instructionLines = this.state.instructions
      .split('\n')
      .filter((l) => l.trim())
      .map((text, i) => ({
        step_number: i + 1,
        text: text.trim(),
      }));

    try {
      console.log('Saving recipe:', {
        title: 'Imported Recipe',
        ingredients: ingredientLines,
        instructions: instructionLines,
      });
      router.navigate('/');
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  }

  render() {
    const { image, isProcessing, ingredients, instructions } = this.state;

    const imageSection = !image
      ? html`
          <button class="pick-image-button" @click="${this.handlePickImage}">
            Take Photo
          </button>
        `
      : html`
          <div class="image-preview">
            <img
              src="${image}"
              style="width: 100%; height: 100%; object-fit: contain"
            />
            <div class="overlay-controls">
              <div class="divider-line"></div>
              <div class="flex-row justify-between padding-16">
                <span class="small-text">Left: Ingredients</span>
                <span class="small-text">Right: Instructions</span>
              </div>
              <div class="flex-row gap-12">
                <button class="button secondary" @click="${this.handlePickImage}">
                  Retake
                </button>
                <button
                  class="button ${isProcessing ? 'button-disabled' : ''}"
                  @click="${this.handleProcessImage}"
                  ?disabled="${isProcessing}"
                >
                  ${isProcessing ? 'Processing...' : 'Process'}
                </button>
              </div>
              <div class="flex-row gap-12 padding-16">
                <button class="button">Save Recipe</button>
              </div>
            </div>
          </div>
        `;

    const recipeSection = this.state.ingredients || this.state.instructions
      ? html`
          <div class="recipe-details">
            <div class="section-title">Ingredients (Left)</div>
            <textarea
              class="edit-box"
              .value="${ingredients}"
              @input="${(e: Event) => {
                const target = e.target as HTMLTextAreaElement;
                this.state = { ...this.state, ingredients: target.value };
              }}"
              multiline
              placeholder="Enter ingredients..."
            ></textarea>

            <div class="section-title">Instructions (Right)</div>
            <textarea
              class="edit-box"
              .value="${instructions}"
              @input="${(e: Event) => {
                const target = e.target as HTMLTextAreaElement;
                this.state = { ...this.state, instructions: target.value };
              }}"
              multiline
              placeholder="Enter instructions..."
            ></textarea>

            <button class="save-button">Save Recipe</button>
          </div>
        `
      : null;

    return html`
      <div class="import-page">
        ${imageSection}
        ${recipeSection}
      </div>
    `;
  }
}

customElements.define('import-screen', ImportScreen);
