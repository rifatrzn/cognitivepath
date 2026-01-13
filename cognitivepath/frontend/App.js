/**
 * CognitivePath App
 * Main application entry point
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import PatientListScreen from './src/screens/PatientListScreen';
import PatientDetailScreen from './src/screens/PatientDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

/**
 * Main Navigator
 * Handles navigation based on authentication state
 */
function AppNavigator() {
  const { isAuthenticated, user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ title: 'Login' }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Register' }}
            />
          </>
        ) : (
          // Authenticated screens
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'CognitivePath' }}
            />
            <Stack.Screen 
              name="Patients" 
              component={PatientListScreen}
              options={{ title: 'Patients' }}
            />
            <Stack.Screen 
              name="PatientDetail" 
              component={PatientDetailScreen}
              options={{ title: 'Patient Details' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * App Component
 * Wraps app with AuthProvider
 */
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}





