const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

const request = async (path, { method = 'GET', body, headers } = {}) => {
  const token = getToken();

  // Handle FormData differently
  const isFormData = body instanceof FormData;
  
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined)
  });

  const text = await res.text();
  const data = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch (_) {
          return text;
        }
      })()
    : null;

  if (!res.ok) {
    const message = data && typeof data === 'object' && data.message ? data.message : 'Request failed';
    throw new Error(message);
  }

  return data;
};

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' })
};
