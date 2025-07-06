// app/profile.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  RefreshControl 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../src/AuthContext';
import Button from '../src/components/Button';
import profileApi from '../src/api/profileApi';
import { Ionicons } from '@expo/vector-icons';
import { ProfileDTO } from '../src/types';
import { API_BASE_URL } from '../src/api/config';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Build correct URL for images
  const buildImageUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;
  
  const pathParts = path.split('/');
  if (pathParts.length !== 2) return `${API_BASE_URL}/${path}`;
  
  const [directory, filename] = pathParts;
  return `${API_BASE_URL}/api/files/${directory}/${filename}`;
};
  // Initial load
  useEffect(() => {
    loadProfile();
  }, []);

  // Reload profile when screen comes back into focus (after editing)
  useFocusEffect(
    useCallback(() => {
      loadProfile();
      return () => {
        // Optional cleanup if needed
      };
    }, [user?.username])
  );

  const loadProfile = async (): Promise<void> => {
    if (!user?.username) return;
    
    try {
      setLoading(true);
      const data = await profileApi.getProfile(user.username);
      setProfile(data);
      console.log("Profile loaded:", data);
      
      if (data?.avatar) {
        const imageUrl = buildImageUrl(data.avatar);
        console.log("Avatar path:", data.avatar);
        console.log("Full avatar URL:", imageUrl);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  // Construct full URLs for images
  const avatarSource = profile?.avatar 
  ? { uri: buildImageUrl(profile.avatar) } 
  : undefined;

const coverSource = profile?.coverPhoto 
  ? { uri: buildImageUrl(profile.coverPhoto) } 
  : undefined;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.coverContainer}>
        {coverSource ? (
          <Image 
            source={coverSource} 
            style={styles.coverPhoto} 
            onError={(e) => console.error('Cover photo loading error:', e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {avatarSource ? (
            <Image 
              source={avatarSource} 
              style={styles.avatar} 
              onError={(e) => console.error('Avatar loading error:', e.nativeEvent.error)}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
        
        {profile?.bio && (
          <Text style={styles.bio}>{profile.bio}</Text>
        )}

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/profile/edit')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Rest of your component remains the same */}
      {/* Basic Info Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        
        {profile?.phoneNumber && (
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{profile.phoneNumber}</Text>
          </View>
        )}
        
        {profile?.website && (
          <View style={styles.infoItem}>
            <Ionicons name="globe-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Website:</Text>
            <Text style={styles.infoValue}>{profile.website}</Text>
          </View>
        )}
        
        {profile?.currentCity && (
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Lives in:</Text>
            <Text style={styles.infoValue}>{profile.currentCity}</Text>
          </View>
        )}
        
        {profile?.birthDate && (
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Birthday:</Text>
            <Text style={styles.infoValue}>
              {new Date(profile.birthDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {/* Education Section */}
      {profile?.education && profile.education.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Education</Text>
            <TouchableOpacity onPress={() => router.push('/profile/education')}>
              <Text style={styles.sectionLink}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          {profile.education.map(edu => (
            <View key={edu.id} style={styles.card}>
              <Text style={styles.cardTitle}>{edu.institution}</Text>
              <Text style={styles.cardSubtitle}>
                {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
              </Text>
              <Text style={styles.cardDate}>
                {new Date(edu.startDate).getFullYear()} - 
                {edu.current ? 'Present' : new Date(edu.endDate as Date).getFullYear()}
              </Text>
              {edu.description && (
                <Text style={styles.cardDescription}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Work Experience Section */}
      {profile?.workExperience && profile.workExperience.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <TouchableOpacity onPress={() => router.push('/profile/work')}>
              <Text style={styles.sectionLink}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          {profile.workExperience.map(work => (
            <View key={work.id} style={styles.card}>
              <Text style={styles.cardTitle}>{work.position}</Text>
              <Text style={styles.cardSubtitle}>{work.company}</Text>
              {work.location && (
                <Text style={styles.cardLocation}>{work.location}</Text>
              )}
              <Text style={styles.cardDate}>
                {new Date(work.startDate).getFullYear()} - 
                {work.current ? 'Present' : new Date(work.endDate as Date).getFullYear()}
              </Text>
              {work.description && (
                <Text style={styles.cardDescription}>{work.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Links to other profile sections */}
      <View style={styles.actions}>
        <Button
          title="Privacy Settings"
          onPress={() => router.push('/profile/privacy')}
          variant="outline"
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Styles remain the same
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  coverContainer: {
    height: 150,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginTop: -50,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 55,
    overflow: 'hidden',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  editButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#6200ee',
    fontWeight: '500',
  },
  section: {
    margin: 12,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionLink: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: '500',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginLeft: 10,
    width: 60,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  card: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#555',
    marginTop: 2,
  },
  cardLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    lineHeight: 20,
  },
  actions: {
    padding: 15,
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 10,
  }
});