import { html, LitElement } from "lit";
import { useAuthStore } from "../src/lib/authStore";

export class LoginScreen extends LitElement {
  constructor() {
    super();
    this.username = "";
    this.password = "";
    this.isRegistering = false;
    this.error = "";
  }

  state = {
    username: "",
    password: "",
    isRegistering: false,
    error: "",
  };

  async handleSubmit() {
    const store = useAuthStore.getState();
    try {
      if (this.state.isRegistering) {
        await store.register(this.state.username, this.state.password);
        this.state = { ...this.state, username: "", password: "", isRegistering: false };
      } else {
        await store.login(this.state.username, this.state.password);
        window.history.pushState({}, "", "/");
        this.requestUpdate();
      }
    } catch (err) {
      this.state = { ...this.state, error: err instanceof Error ? err.message : "An error occurred" };
    }
  }

  render() {
    const { username, password, isRegistering, error } = this.state;
    return html`
      <div class="login-page">
        <h2>${isRegistering ? "Register" : "Login"}</h2>

        ${error ? html`<p class="error">${error}</p>` : null}

        <input
          class="input-field"
          placeholder="Username"
          .value="${username}"
          @input="${(e: Event) => {
            const target = e.target as HTMLInputElement;
            this.state = { ...this.state, username: target.value };
          }}"
        />

        <input
          class="input-field"
          type="password"
          placeholder="Password"
          .value="${password}"
          @input="${(e: Event) => {
            const target = e.target as HTMLInputElement;
            this.state = { ...this.state, password: target.value };
          }}"
        />

        <button
          class="button"
          @click="${this.handleSubmit}"
          ?disabled="${!username || !password}"
        >
          ${isRegistering ? "Register" : "Login"}
        </button>

        <button
          class="toggle-button"
          @click="${() => {
            this.state = { ...this.state, isRegistering: !isRegistering };
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
