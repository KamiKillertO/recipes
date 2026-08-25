import { html, LitElement } from 'lit';
import { authStore } from '../lib/authStore';
import { router, REDIRECT_KEY } from '../lib/router';

export class LoginScreen extends LitElement {
  static properties = {
    username: { state: true },
    password: { state: true },
    isRegistering: { state: true },
    error: { state: true },
    isSubmitting: { state: true },
  };

  consturctor() {
	  super();
  	this.username = '';
  	this.password = '';
  	this.isRegistering = false;
  	this.error = '';
  	this.isSubmitting = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsub = authStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsub?.();
  }

  private unsub?: () => void;

  async handleSubmit(e: Event) {
    e.preventDefault();
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = '';
    try {
      if (this.isRegistering) {
        await authStore.register(this.username, this.password);
      } else {
        await authStore.login(this.username, this.password);
      }
      const redirectTo = sessionStorage.getItem(REDIRECT_KEY) || '/';
      sessionStorage.removeItem(REDIRECT_KEY);
      router.navigate(redirectTo);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      this.isSubmitting = false;
    }
  }

  render() {
    const { username, password, isRegistering, error, isSubmitting } = this;

    return html`
      <div>
        <h2>${isRegistering ? 'Register' : 'Login'}</h2>

        ${error ? html`<p>${error}</p>` : null}

        <form @submit="${this.handleSubmit}">
          <input
            placeholder="Username"
            autocomplete="username"
            .value="${username}"
            @input="${(e: Event) => {
              this.username = (e.target as HTMLInputElement).value;
            }}"
          />

          <input
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            .value="${password}"
            @input="${(e: Event) => {
              this.password = (e.target as HTMLInputElement).value;
            }}"
          />

          <button
            type="submit"
            ?disabled="${isSubmitting || !username || !password}"
          >
            ${isSubmitting ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <button
          @click="${() => {
            this.isRegistering = !isRegistering;
            this.error = '';
          }}"
        >
          ${isRegistering
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </button>
      </div>
    `;
  }
}

customElements.define('login-screen', LoginScreen);
