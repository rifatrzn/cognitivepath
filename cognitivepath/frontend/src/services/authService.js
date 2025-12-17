/**
 * Authentication Service
 * Handles user authentication and token management
 */

import apiClient from '../config/api';

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const { email, password, name, role } = userData;
    
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name,
      role: role || 'patient',
    });

    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
      // Store refresh token
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
    }

    return response;
  }

  /**
   * Login user
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
      // Store refresh token
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout() {
    await apiClient.clearToken();
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.removeItem('refresh_token');
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    return apiClient.get('/auth/profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(updates) {
    return apiClient.put('/auth/profile', updates);
  }

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    return apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  /**
   * Refresh access token
   */
  async refreshToken() {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const refreshToken = await AsyncStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh-token', {
      refreshToken,
    });

    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
    }

    return response;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const token = await apiClient.getToken();
    return !!token;
  }
}

export default new AuthService();




