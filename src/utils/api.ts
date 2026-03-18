// Base URL for the external backend API
// Update this to your deployed backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = (): string | null => {
  return localStorage.getItem('yo_auth_token');
};

const setToken = (token: string): void => {
  localStorage.setItem('yo_auth_token', token);
};

const clearToken = (): void => {
  localStorage.removeItem('yo_auth_token');
};

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function apiRequest<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  return res.json();
}

// Auth API
export const authApi = {
  getNonce: (address: string) =>
    apiRequest<{ nonce: string }>(`/auth/nonce/${address.toLowerCase()}`),

  verify: (message: string, signature: string) =>
    apiRequest<{ token: string; user: any }>('/auth/verify', {
      method: 'POST',
      body: { message, signature },
    }).then((data) => {
      setToken(data.token);
      return data;
    }),

  logout: () => {
    clearToken();
  },

  isAuthenticated: () => !!getToken(),
};

// User API
export const userApi = {
  getProfile: () => apiRequest<any>('/user/profile'),

  updatePreferredVault: (vaultAddress: string, network: string, name: string) =>
    apiRequest<any>('/user/vault', {
      method: 'POST',
      body: { vaultAddress, network, name },
    }),
};

// Recurring API
export const recurringApi = {
  getSettings: () => apiRequest<any>('/recurring'),

  updateSettings: (enabled: boolean, amount: string, frequency: string) =>
    apiRequest<any>('/recurring', {
      method: 'POST',
      body: { enabled, amount, frequency },
    }),
};

// Transactions API
export const transactionsApi = {
  getAll: () => apiRequest<any[]>('/transactions'),

  add: (txHash: string, type: string, amount: string, asset: string, vaultAddress: string) =>
    apiRequest<any>('/transactions', {
      method: 'POST',
      body: { txHash, type, amount, asset, vaultAddress },
    }),
};

export { getToken, setToken, clearToken };
