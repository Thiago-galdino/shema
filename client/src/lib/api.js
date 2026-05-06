const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('shema_token');
};

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      // Try refresh
      const refreshToken = localStorage.getItem('shema_refresh');
      if (refreshToken) {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const { accessToken } = await refreshRes.json();
          localStorage.setItem('shema_token', accessToken);
          // Retry original request
          const retryHeaders = { ...headers, Authorization: `Bearer ${accessToken}` };
          const retryRes = await fetch(`${API_URL}${endpoint}`, { ...options, headers: retryHeaders });
          return retryRes.json();
        }
      }
      localStorage.removeItem('shema_token');
      localStorage.removeItem('shema_refresh');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Erro na requisição.');
  }

  return data;
};

export const api = {
  get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (endpoint, body) => apiFetch(endpoint, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
};

export default api;
