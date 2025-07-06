import { Redirect } from 'expo-router';
import { useAuth } from '../src/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // If authenticated and verified, go to home
  if (isAuthenticated && user?.isVerified) {
    return <Redirect href="/home" />;
  }
  
  // If authenticated but not verified, go to verification
  if (isAuthenticated && !user?.isVerified) {
    return <Redirect href="/auth/verify" />;
  }
  
  // If not authenticated, go to login
  return <Redirect href="/auth/login" />;
}