import apiClient from './config';

// Authentication API calls
const authApi = {
  // Register new user
  signup: async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const response = await apiClient.post('/api/auth/signup', data);
      return response.data;
    } catch (error: any) {
      // Extract error message from response
      if (error.response && error.response.data) {
        // Get the specific error message from backend
        const errorMessage = error.response.data.error || 'Registration failed';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  
  // Login user
  login: async (data: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/api/auth/login', data);
      return response.data;
    } catch (error: any) {
      // Extract error message from response
      if (error.response && error.response.data) {
        // Get the specific error message from backend
        const errorMessage = error.response.data.error || 'Invalid email or password';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  
  // Verify email with OTP
  verifyEmail: async (data: { email: string; otp: string }) => {
    try {
      const response = await apiClient.post('/api/auth/verify-email', data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || 'Verification failed';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  
  // Resend OTP
  resendOTP: async (email: string) => {
    try {
      const response = await apiClient.post('/api/auth/resend-otp', null, {
        params: { email }
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || 'Failed to resend OTP';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
};

export default authApi;