/**
 * API Configuration
 * Centralized API client configuration
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * API Client
 * Handles all API requests with authentication
 */
class ApiClient {
  constructor() {
    this.baseURL = API_URL;
    this.token = null;
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    // Store in AsyncStorage for persistence
    if (token) {
      require('@react-native-async-storage/async-storage').default.setItem('auth_token', token);
    }
  }

  /**
   * Get authentication token
   */
  async getToken() {
    if (!this.token) {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  /**
   * Clear authentication token
   */
  async clearToken() {
    this.token = null;
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.removeItem('auth_token');
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const token = await this.getToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized - token expired
        if (response.status === 401) {
          await this.clearToken();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export default new ApiClient();





