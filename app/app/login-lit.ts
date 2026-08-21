import { html, LitElement } from "lit";
import { useAuthStore } from "../src/lib/authStore";
import { router, REDIRECT_KEY } from "../src/lib/router";

export class LoginScreen extends LitElement {
  static properties = {
    username: { state: true },
    password: { state: true },
    isRegistering: { state: true },
    error: { state: true },
    isSubmitting: { state: true },
  };

  constructor() {
    super();
    this.username = "";
    this.password = "";
    this.isRegistering = false;
    this.error = "";
    this.isSubmitting = false;
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (this.isSubmitting) return;

    const store = useAuthStore.getState();
    this.isSubmitting = true;
    this.error = "";
    try {
      if (this.isRegistering) {
        await store.register(this.username, this.password);
      } else {
        await store.login(this.username, this.password);
      }
      const redirectTo = sessionStorage.getItem(REDIRECT_KEY) || "/";
      sessionStorage.removeItem(REDIRECT_KEY);
      router.navigate(redirectTo);
    } catch (err) {
      this.error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      this.isSubmitting = false;
    }
  }

  render() {
    const { username, password, isRegistering, error, isSubmitting } = this;

    return html`
      <div class="login-page">
        <h2>${isRegistering ? "Register" : "Login"}</h2>

        ${error ? html`<p class="error">${error}</p>` : null}

        <form @submit="${this.handleSubmit}">
          <input
            class="input-field"
            placeholder="Username"
            autocomplete="username"
            .value="${username}"
            @input="${(e) => {
              this.username = e.target.value;
            }}"
          />

          <input
            class="input-field"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            .value="${password}"
            @input="${(e) => {
              this.password = e.target.value;
            }}"
          />

          <button
            class="button"
            type="submit"
            ?disabled="${isSubmitting || !username || !password}"
          >
            ${isSubmitting ? "Please wait..." : isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <button
          class="toggle-button"
          @click="${() => {
            this.isRegistering = !isRegistering;
            this.error = "";
          }}"
        >
          ${isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>
    `;
  }
}

customElements.define("login-screen", LoginScreen);