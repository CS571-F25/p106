const isProduction = window.location.hostname !== 'localhost';
const API_URL = isProduction 
  ? 'https://braindump-api-production.up.railway.app' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000');

function getAuthHeader() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function clearAuthAndRedirect() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/#/login';
}

async function tryRefreshToken() {
  const refreshTokenValue = localStorage.getItem('refresh_token');
  if (!refreshTokenValue) {
    return false;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh?refresh_token=${encodeURIComponent(refreshTokenValue)}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return true;
  } catch (e) {
    console.error('Token refresh error:', e);
    return false;
  }
}

async function apiRequest(url, options = {}, isRetry = false) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  
  // If unauthorized and not already a retry, try to refresh token
  if (response.status === 401 && !isRetry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry with new token
      return apiRequest(url, options, true);
    } else {
      // Refresh failed - clear auth and redirect
      clearAuthAndRedirect();
      throw new Error('Session expired. Please sign in again.');
    }
  }
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'API request failed');
  }
  return data;
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

  upload: async (formData, isRetry = false) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/api/papers/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    
    // If unauthorized and not already a retry, try to refresh token
    if (response.status === 401 && !isRetry) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return papersApi.upload(formData, true);
      } else {
        clearAuthAndRedirect();
        throw new Error('Session expired. Please sign in again.');
      }
    }
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Upload failed');
    }
    return data;
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
