import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'expo-router';
import authApi from './api/authApi';
import { saveToken, saveUser, getUser, getToken, clearStorage } from './utils';
import { AuthContextType, User } from './types';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();
        const userData = await getUser();
        
        if (token && userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });

      console.log('User verification status:', response.user.isVerified);
      console.log('User verification type:', typeof response.user.isVerified);
      
      await saveToken(response.token);
      await saveUser(response.user);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      if (!response.user.isVerified) {
        router.push('/auth/verify');
      } else {
        router.push('/home');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup(data);
      
      await saveToken(response.token);
      await saveUser(response.user);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      router.push('/auth/verify');
    } catch (error: any) {
        console.error('Signup failed:', error.message);
        throw error;
  } 
  };

  // Verify email function
  const verifyEmail = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      await authApi.verifyEmail({ email, otp });
      
      // Update user's verified status
      if (user) {
        const updatedUser = { ...user, isVerified: true };
        await saveUser(updatedUser);
        setUser(updatedUser);
      }
      
      router.push('/home');
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP function
  const resendOTP = async (email: string) => {
    setIsLoading(true);
    try {
      await authApi.resendOTP(email);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await clearStorage();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    verifyEmail,
    resendOTP,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};