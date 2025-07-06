import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../src/AuthContext';
import Button from '../src/components/Button';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.firstName}!</Text>
        <Text style={styles.subtitle}>You're now logged in to the social media app</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Profile</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{user?.username}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user?.firstName} {user?.lastName}</Text>
        </View>
        
        <Link href="/profile" asChild>
          <TouchableOpacity style={styles.profileLink}>
            <Text style={styles.profileLinkText}>View Full Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.actions}>
        <Button
          title="Logout"
          onPress={logout}
          variant="outline"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    width: 100,
    color: '#666',
  },
  value: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  profileLink: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  profileLinkText: {
    color: '#6200ee',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    padding: 20,
    marginTop: 10,
  },
});