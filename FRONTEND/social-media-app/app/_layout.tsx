import { Stack } from 'expo-router';
import { AuthProvider } from '../src/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="home" 
          options={{ 
            title: 'Home',
            headerStyle: { backgroundColor: '#6200ee' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ 
            title: 'My Profile',
            headerStyle: { backgroundColor: '#6200ee' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="auth/login" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="auth/register" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="auth/verify" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </AuthProvider>
  );
}