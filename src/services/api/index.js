/**
 * HTTP/API client boundary.
 * Components must not call fetch directly — go through `posApi`.
 *
 * Base URL: same-origin `/api` (Vite proxies it to the backend in dev),
 * or `VITE_API_URL` when the API lives elsewhere (e.g. production).
 */

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') || '/api';

export class ApiError extends Error {
  constructor(status, message) {
    super(message || `Request failed with status ${status}`);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    throw new ApiError(0, 'Backend unreachable — is the API server running?');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error || `Request failed (${res.status})`);
  return data;
}

const resource = (path) => ({
  list: (query = '') => request(`${path}${query}`),
  get: (id) => request(`${path}/${encodeURIComponent(id)}`),
  create: (payload) => request(path, { method: 'POST', body: payload }),
  update: (id, payload) => request(`${path}/${encodeURIComponent(id)}`, { method: 'PATCH', body: payload }),
  remove: (id) => request(`${path}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
});

export const posApi = {
  health: () => request('/health'),
  products: resource('/products'),
  customers: resource('/customers'),
  sales: resource('/sales'),
  heldSales: resource('/held-sales'),
  returns: resource('/returns'),
  cashMovements: resource('/cash-movements'),
  shifts: {
    ...resource('/shifts'),
    current: () => request('/shifts/current'),
    close: (id, payload) => request(`/shifts/${encodeURIComponent(id)}/close`, { method: 'POST', body: payload }),
  },
  get baseUrl() {
    return API_BASE;
  },
};

export const apiService = { posApi, ApiError };
