// Base URL for the external backend API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'yo_auth_token';

const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiUser {
  address: string;
  preferredVault: { address: string; network: string; name: string } | null;
  recurringDeposit: RecurringDeposit;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringDeposit {
  enabled: boolean;
  amount: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextExecution: string | null;
}

export interface ApiTransaction {
  _id?: string;
  txHash: string;
  type: 'deposit' | 'withdraw' | 'redeem';
  amount: string;
  asset: string;
  vaultAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

export interface PaginatedResponse<T> {
  transactions: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

// ─── API Client ───────────────────────────────────────────────────────────────

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, signal } = options;
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) {
    clearToken();
    throw new ApiError('Session expired. Please sign in again.', 401);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(err.error || `API error: ${res.status}`, res.status);
  }

  return res.json();
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  getNonce: (address: string) =>
    apiRequest<{ nonce: string }>(`/auth/nonce/${address.toLowerCase()}`),

  verify: (message: string, signature: string) =>
    apiRequest<{ token: string; user: ApiUser }>('/auth/verify', {
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

// ─── User API ─────────────────────────────────────────────────────────────────

export const userApi = {
  getProfile: () => apiRequest<ApiUser>('/user/profile'),

  updatePreferredVault: (vaultAddress: string, network: string, name: string) =>
    apiRequest<{ preferredVault: ApiUser['preferredVault'] }>('/user/vault', {
      method: 'POST',
      body: { vaultAddress, network, name },
    }),
};

// ─── Recurring API ────────────────────────────────────────────────────────────

export const recurringApi = {
  getSettings: () => apiRequest<RecurringDeposit>('/recurring'),

  updateSettings: (enabled: boolean, amount: string, frequency: string) =>
    apiRequest<RecurringDeposit>('/recurring', {
      method: 'POST',
      body: { enabled, amount, frequency },
    }),
};

// ─── Transactions API ─────────────────────────────────────────────────────────

export const transactionsApi = {
  getAll: (page = 1, limit = 20) =>
    apiRequest<PaginatedResponse<ApiTransaction>>(`/transactions?page=${page}&limit=${limit}`),

  add: (txHash: string, type: string, amount: string, asset: string, vaultAddress: string) =>
    apiRequest<ApiTransaction>('/transactions', {
      method: 'POST',
      body: { txHash, type, amount, asset, vaultAddress },
    }),
};

// ─── Notifications API ───────────────────────────────────────────────────────

export const notificationsApi = {
  registerToken: (token: string, platform: 'ios' | 'android' | 'web') =>
    apiRequest<{ success: boolean }>('/notifications/register', {
      method: 'POST',
      body: { token, platform },
    }),

  unregisterToken: (token: string) =>
    apiRequest<{ success: boolean }>('/notifications/unregister', {
      method: 'POST',
      body: { token },
    }),
};

export { getToken, setToken, clearToken, ApiError };
