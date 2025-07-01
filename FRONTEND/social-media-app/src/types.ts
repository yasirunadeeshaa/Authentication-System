
// User model
export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    isVerified: boolean;
    createdAt: string;
  }
  
  // Authentication response
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  // Context type
  export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => Promise<void>;
    verifyEmail: (email: string, otp: string) => Promise<void>;
    resendOTP: (email: string) => Promise<void>;
    logout: () => Promise<void>;
  }

  // src/types/profile.ts
export interface ProfileUpdateRequest {
  bio?: string;
  birthDate?: string | Date | null;
  gender?: string;
  relationshipStatus?: string;
  phoneNumber?: string;
  website?: string;
  alternativeEmail?: string;
  currentCity?: string;
  hometown?: string;
  placesLived?: string[];
  interests?: string[];
  music?: string[];
  movies?: string[];
  books?: string[];
  sports?: string[];
}

export interface EducationDTO {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string | Date;
  endDate?: string | Date;
  current: boolean;
  description?: string;
}

export interface WorkExperienceDTO {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string | Date;
  endDate?: string | Date;
  current: boolean;
  description?: string;
}

export interface LifeEvent {
  id: string;
  title: string;
  description?: string;
  date: string | Date;
  category?: string;
  visibility?: string;
}

export interface PrivacySettingsDTO {
  id: string;
  defaultPostVisibility: string;
  profileVisibility: string;
  friendListVisibility: string;
  sectionVisibility: Record<string, string>;
  allowSearchEngines: boolean;
  showInFriendSuggestions: boolean;
  allowFriendRequests: boolean;
  allowDataForRecommendations: boolean;
}

export interface ProfileDTO {
  id: string;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  birthDate?: string | Date;
  gender?: string;
  relationshipStatus?: string;
  phoneNumber?: string;
  website?: string;
  alternativeEmail?: string;
  currentCity?: string;
  hometown?: string;
  placesLived?: string[];
  interests?: string[];
  music?: string[];
  movies?: string[];
  books?: string[];
  sports?: string[];
  lifeEvents?: LifeEvent[];
  education?: EducationDTO[];
  workExperience?: WorkExperienceDTO[];
  followerCount: number;
  followingCount: number;
  isVerified: boolean;
  createdAt: string | Date;
}