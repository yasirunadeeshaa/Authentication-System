// src/api/profileApi.ts
import apiClient from './config';
import { Platform } from 'react-native';
import { 
  ProfileDTO, 
  EducationDTO, 
  WorkExperienceDTO, 
  PrivacySettingsDTO,
  ProfileUpdateRequest
} from '../types';

// Define a type for error handling
interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  request?: any;
  message?: string;
}

const profileApi = {
  // Get user profile
  getProfile: async (username: string): Promise<ProfileDTO> => {
    try {
      const response = await apiClient.get<ProfileDTO>(`/api/profiles/${username}`);
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to fetch profile');
    }
  },

  // Update profile
  updateProfile: async (data: ProfileUpdateRequest): Promise<ProfileDTO> => {
    try {
      console.log("Sending profile update with data:", data); // Debug log
      const response = await apiClient.patch<ProfileDTO>('/api/profiles', data);
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to update profile');
    }
  },
  
  // Upload avatar
// Upload avatar
uploadAvatar: async (file: any): Promise<string> => {
    try {
      console.log('Uploading avatar:', file);
      const formData = new FormData();
      
      // Check if we're running on web
      if (Platform.OS === 'web') {
        // For web: Convert data URI to blob
        if (file.uri.startsWith('data:')) {
          // Extract the mime type and base64 data
          const match = file.uri.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            const type = match[1];
            const base64Data = match[2];
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            
            for (let i = 0; i < byteCharacters.length; i += 512) {
              const slice = byteCharacters.slice(i, i + 512);
              const byteNumbers = new Array(slice.length);
              
              for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
              }
              
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            
            // Create a blob from the byte arrays
            const blob = new Blob(byteArrays, { type });
            
            // Create a file from the blob
            const fileFromBlob = new File([blob], file.name || 'avatar.jpg', { type });
            
            // Append the file to formData
            formData.append('file', fileFromBlob);
            console.log('Converted base64 to blob and appended to form data');
          } else {
            throw new Error('Invalid data URI format');
          }
        } else {
          // For web with file objects
          formData.append('file', file);
        }
      } else {
        // For React Native mobile
        formData.append('file', {
          uri: file.uri,
          name: file.fileName || 'avatar.jpg',
          type: file.type || 'image/jpeg'
        } as any);
      }
      
      const response = await apiClient.post('/api/profiles/avatar', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to upload avatar');
    }
  },
  
  // Upload cover photo
uploadCoverPhoto: async (file: any): Promise<string> => {
  try {
    console.log('Uploading cover photo:', file);
    const formData = new FormData();
    
    // Check if we're running on web
    if (Platform.OS === 'web') {
      // For web: Convert data URI to blob
      if (file.uri.startsWith('data:')) {
        // Extract the mime type and base64 data
        const match = file.uri.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          const type = match[1];
          const base64Data = match[2];
          const byteCharacters = atob(base64Data);
          const byteArrays = [];
          
          for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512);
            const byteNumbers = new Array(slice.length);
            
            for (let j = 0; j < slice.length; j++) {
              byteNumbers[j] = slice.charCodeAt(j);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          
          // Create a blob from the byte arrays
          const blob = new Blob(byteArrays, { type });
          
          // Create a file from the blob
          const fileFromBlob = new File([blob], file.name || 'cover.jpg', { type });
          
          // Append the file to formData
          formData.append('file', fileFromBlob);
          console.log('Converted base64 to blob and appended to form data for cover');
        } else {
          throw new Error('Invalid data URI format');
        }
      } else {
        // For web with file objects
        formData.append('file', file);
      }
    } else {
      // For React Native mobile
      formData.append('file', {
        uri: file.uri,
        name: file.fileName || 'cover.jpg',
        type: file.type || 'image/jpeg'
      } as any);
    }
    
    const response = await apiClient.post('/api/profiles/cover', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to upload cover photo');
  }
},

  // Education APIs
  addEducation: async (educationData: Omit<EducationDTO, 'id'>): Promise<EducationDTO> => {
    try {
      const response = await apiClient.post<EducationDTO>('/api/profiles/education', educationData);
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to add education');
    }
  },

  updateEducation: async (id: string, educationData: Omit<EducationDTO, 'id'>): Promise<EducationDTO> => {
    try {
      const response = await apiClient.put<EducationDTO>(`/api/profiles/education/${id}`, educationData);
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to update education');
    }
  },

  deleteEducation: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/profiles/education/${id}`);
      return true;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to delete education');
    }
  },

  // Work Experience APIs
  addWorkExperience: async (workData: Omit<WorkExperienceDTO, 'id'>): Promise<WorkExperienceDTO> => {
    try {
      const response = await apiClient.post<WorkExperienceDTO>('/api/profiles/work', workData);
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to add work experience');
    }
  },

  updateWorkExperience: async (id: string, workData: Omit<WorkExperienceDTO, 'id'>): Promise<WorkExperienceDTO> => {
    try {
      const response = await apiClient.put<WorkExperienceDTO>(`/api/profiles/work/${id}`, workData);
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to update work experience');
    }
  },

  deleteWorkExperience: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/profiles/work/${id}`);
      return true;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to delete work experience');
    }
  },

  // Privacy APIs
  getPrivacySettings: async (): Promise<PrivacySettingsDTO> => {
    try {
      const response = await apiClient.get<PrivacySettingsDTO>('/api/privacy');
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to fetch privacy settings');
    }
  },

  updatePrivacySettings: async (privacyData: Partial<PrivacySettingsDTO>): Promise<PrivacySettingsDTO> => {
    try {
      const response = await apiClient.put<PrivacySettingsDTO>('/api/privacy', privacyData);
      return response.data;
    } catch (error: unknown) {
      return handleApiError(error, 'Failed to update privacy settings');
    }
  }
};

// Helper function to handle API errors with proper type narrowing
const handleApiError = (error: unknown, defaultMessage: string): never => {
  // Log the error for debugging
  console.error(`API Error (${defaultMessage}):`, error);
  
  // Type narrowing to check if error is an object
  if (error && typeof error === 'object') {
    // Check if it's an axios error with response
    if ('response' in error && error.response && typeof error.response === 'object') {
      if ('data' in error.response && error.response.data && typeof error.response.data === 'object') {
        if ('error' in error.response.data && typeof error.response.data.error === 'string') {
          throw new Error(error.response.data.error);
        }
      }
      // If we have a response but couldn't extract a specific error message
      throw new Error(`${defaultMessage} (Status: ${(error.response as any).status || 'unknown'})`);
    }
    
    // Check if it's a network error (request made but no response received)
    if ('request' in error) {
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    }
    
    // Check if it's a standard Error object
    if (error instanceof Error) {
      throw new Error(`${defaultMessage}: ${error.message}`);
    }
  }
  
  // Fallback for other types of errors
  throw new Error(defaultMessage);
};

export default profileApi;