import { signal, computed } from '@preact/signals';
import { api } from './api';

interface AuthUser {
  id: string;
  username: string;
  created_at: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
const userSignal = signal<AuthUser | null>(null);

(() => {
  const raw = localStorage.getItem(USER_KEY);
  if (raw) {
    try {
      userSignal.value = JSON.parse(raw);
    } catch {
      userSignal.value = null;
    }
  }
})();

const isAuthenticatedSignal = computed(() => !!tokenSignal.value && !!userSignal.value);

function persistToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
  tokenSignal.value = token;
}

function persistUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
  userSignal.value = user;
}

api.setToken(tokenSignal.value);

export const authStore = {
  get token() { return tokenSignal.value; },
  get user() { return userSignal.value; },
  get isAuthenticated() { return isAuthenticatedSignal.value; },

  subscribe(callback: () => void) {
    const unsubs = [
      tokenSignal.subscribe(callback),
      userSignal.subscribe(callback),
      isAuthenticatedSignal.subscribe(callback),
    ];
    return () => unsubs.forEach(u => u());
  },

  async login(username: string, password: string) {
    const response = await api.login(username, password);
    persistToken(response.token);
    persistUser(response.user);
  },

  async register(username: string, password: string) {
    const response = await api.register(username, password);
    persistToken(response.token);
    persistUser(response.user);
  },

  logout() {
    api.logout();
    persistToken(null);
    persistUser(null);
  },

  restoreSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    let user: AuthUser | null = null;
    if (userRaw) {
      try { user = JSON.parse(userRaw); } catch { user = null; }
    }
    if (token) {
      api.setToken(token);
    }
    persistToken(token);
    persistUser(user);
  },
};