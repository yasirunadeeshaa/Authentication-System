import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Key for storing auth token
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Check if running on web
const isWeb = Platform.OS === 'web';

// Store authentication token
export const saveToken = async (token: string): Promise<void> => {
  if (isWeb) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

// Get authentication token
export const getToken = async (): Promise<string | null> => {
  try {
    if (isWeb) {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Remove authentication token
export const removeToken = async (): Promise<void> => {
  if (isWeb) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

// Store user data
export const saveUser = async (user: any): Promise<void> => {
  const userData = JSON.stringify(user);
  if (isWeb) {
    localStorage.setItem(USER_KEY, userData);
  } else {
    await SecureStore.setItemAsync(USER_KEY, userData);
  }
};

// Get user data
export const getUser = async (): Promise<any> => {
  try {
    let data;
    if (isWeb) {
      data = localStorage.getItem(USER_KEY);
    } else {
      data = await SecureStore.getItemAsync(USER_KEY);
    }
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Remove user data
export const removeUser = async (): Promise<void> => {
  if (isWeb) {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
};

// Clear all data (logout)
export const clearStorage = async (): Promise<void> => {
  await Promise.all([removeToken(), removeUser()]);
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};