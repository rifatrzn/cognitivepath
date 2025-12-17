/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      if (authenticated) {
        // Get user profile
        const response = await authService.getProfile();
        if (response.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          await authService.logout();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await authService.logout();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Register user
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates) => {
    try {
      const response = await authService.updateProfile(updates);
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshAuth: checkAuth,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});




