const API_URL = '/api/auth';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('codenest_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Register user
const signup = async (userData) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  if (data.token) {
    localStorage.setItem('codenest_token', data.token);
  }

  return data;
};

// Login user
const login = async (userData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  if (data.token) {
    localStorage.setItem('codenest_token', data.token);
  }

  return data;
};

// Get current user profile
const getMe = async () => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user profile');
  }

  return data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('codenest_token');
};

const authService = {
  signup,
  login,
  getMe,
  logout,
};

export default authService;
