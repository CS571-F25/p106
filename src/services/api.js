const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getAuthHeader() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token');
  }
  
  const response = await fetch(`${API_URL}/api/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error('Token refresh failed');
  }
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  return data.access_token;
}

async function handleResponse(response) {
  // If unauthorized, try to refresh token
  if (response.status === 401) {
    try {
      await refreshToken();
      // Token refreshed - caller should retry the request
      throw new Error('TOKEN_REFRESHED');
    } catch (e) {
      // Refresh failed - clear auth and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/#/login';
      throw new Error('Session expired. Please sign in again.');
    }
  }
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'API request failed');
  }
  return data;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeader()
    }
  });
  
  try {
    return await handleResponse(response);
  } catch (e) {
    if (e.message === 'TOKEN_REFRESHED') {
      // Retry the request with new token
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...getAuthHeader()
        }
      });
      return await handleResponse(retryResponse);
    }
    throw e;
  }
}

// Projects API
export const projectsApi = {
  list: async () => {
    return apiRequest(`${API_URL}/api/projects`);
  },

  create: async (name, description = '') => {
    return apiRequest(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
  },

  get: async (projectId) => {
    return apiRequest(`${API_URL}/api/projects/${projectId}`);
  },

  update: async (projectId, data) => {
    return apiRequest(`${API_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  delete: async (projectId) => {
    return apiRequest(`${API_URL}/api/projects/${projectId}`, {
      method: 'DELETE'
    });
  }
};

// Papers API
export const papersApi = {
  list: async (projectId) => {
    return apiRequest(`${API_URL}/api/papers/${projectId}`);
  },

  upload: async (formData) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/api/papers/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    
    try {
      return await handleResponse(response);
    } catch (e) {
      if (e.message === 'TOKEN_REFRESHED') {
        const newToken = localStorage.getItem('access_token');
        const retryResponse = await fetch(`${API_URL}/api/papers/upload`, {
          method: 'POST',
          headers: newToken ? { Authorization: `Bearer ${newToken}` } : {},
          body: formData
        });
        return await handleResponse(retryResponse);
      }
      throw e;
    }
  },

  delete: async (paperId) => {
    return apiRequest(`${API_URL}/api/papers/${paperId}`, {
      method: 'DELETE'
    });
  }
};

// Clustering API
export const clusteringApi = {
  cluster: async (projectId) => {
    return apiRequest(`${API_URL}/api/cluster/${projectId}`, {
      method: 'POST'
    });
  },

  getGraph: async (projectId) => {
    return apiRequest(`${API_URL}/api/graph/${projectId}`);
  }
};
