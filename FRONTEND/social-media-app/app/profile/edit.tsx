// app/profile/edit.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/AuthContext';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import CustomAlert from '../../src/components/CustomAlert';
import profileApi from '../../src/api/profileApi';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ProfileDTO, ProfileUpdateRequest } from '../../src/types';

interface ImageFile {
  uri: string;
  type?: string;
  fileName?: string;
}

export default function ProfileEditScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  
  // Alert state
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<ProfileUpdateRequest>({
    bio: '',
    birthDate: null,
    gender: '',
    relationshipStatus: '',
    phoneNumber: '',
    website: '',
    alternativeEmail: '',
    currentCity: '',
    hometown: '',
  });

  // Image upload state
  const [avatar, setAvatar] = useState<ImageFile | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<ImageFile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async (): Promise<void> => {
    if (!user?.username) return;
    
    try {
      setLoading(true);
      const data = await profileApi.getProfile(user.username);
      setProfile(data);

      // Initialize form with existing data
      if (data) {
        setFormData({
          bio: data.bio || '',
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          gender: data.gender || '',
          relationshipStatus: data.relationshipStatus || '',
          phoneNumber: data.phoneNumber || '',
          website: data.website || '',
          alternativeEmail: data.alternativeEmail || '',
          currentCity: data.currentCity || '',
          hometown: data.hometown || '',
        });

        if (data.avatar) {
          setAvatar({ uri: data.avatar });
        }

        if (data.coverPhoto) {
          setCoverPhoto({ uri: data.coverPhoto });
        }
      }
    } catch (error) {
      showAlert('Error', (error as Error).message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: keyof ProfileUpdateRequest, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const pickImage = async (type: 'avatar' | 'cover'): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'avatar' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'avatar') {
          setAvatar(result.assets[0] as unknown as ImageFile);
        } else {
          setCoverPhoto(result.assets[0] as unknown as ImageFile);
        }
      }
    } catch (error) {
      showAlert('Error', 'Failed to pick image');
    }
  };

  const uploadImages = async (): Promise<{avatarUrl?: string, coverUrl?: string}> => {
    try {
      let avatarUrl = profile?.avatar;
      let coverUrl = profile?.coverPhoto;

      if (avatar && (!profile?.avatar || avatar.uri !== profile.avatar)) {
        avatarUrl = await profileApi.uploadAvatar(avatar);
      }

      if (coverPhoto && (!profile?.coverPhoto || coverPhoto.uri !== profile.coverPhoto)) {
        coverUrl = await profileApi.uploadCoverPhoto(coverPhoto);
      }

      return { avatarUrl, coverUrl };
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to upload images');
    }
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Upload images first if changed
      await uploadImages();
      
      // Update profile data
      await profileApi.updateProfile(formData);
      
      showAlert('Success', 'Profile updated successfully');
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      showAlert('Error', (error as Error).message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title: string, message: string): void => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const onDateChange = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('birthDate', selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      
      {/* Cover Photo */}
      <TouchableOpacity 
        style={styles.coverContainer} 
        onPress={() => pickImage('cover')}
      >
        {coverPhoto ? (
          <Image source={{ uri: coverPhoto.uri }} style={styles.coverPhoto} />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="image-outline" size={32} color="#888" />
            <Text style={styles.uploadText}>Tap to upload cover photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => pickImage('avatar')}
        >
          {avatar ? (
            <Image source={{ uri: avatar.uri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Text>
              <View style={styles.avatarOverlay}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <Input
          label="Bio"
          value={formData.bio}
          onChangeText={(value) => handleChange('bio', value)}
          placeholder="Tell us about yourself"
          multiline
          style={styles.textArea}
        />
        
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateLabel}>Birth Date</Text>
          <Text style={styles.dateValue}>
            {formData.birthDate 
              ? new Date(formData.birthDate).toLocaleDateString() 
              : 'Select your birth date'}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={formData.birthDate ? new Date(formData.birthDate) : new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
        
        <Input
          label="Gender"
          value={formData.gender}
          onChangeText={(value) => handleChange('gender', value)}
          placeholder="Enter your gender"
        />
        
        <Input
          label="Relationship Status"
          value={formData.relationshipStatus}
          onChangeText={(value) => handleChange('relationshipStatus', value)}
          placeholder="Enter your relationship status"
        />
        
        <Text style={[styles.sectionTitle, styles.contactSection]}>Contact Information</Text>
        
        <Input
          label="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        
        <Input
          label="Website"
          value={formData.website}
          onChangeText={(value) => handleChange('website', value)}
          placeholder="Enter your website"
          keyboardType="url"
          autoCapitalize="none"
        />
        
        <Input
          label="Alternative Email"
          value={formData.alternativeEmail}
          onChangeText={(value) => handleChange('alternativeEmail', value)}
          placeholder="Enter your alternative email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Text style={[styles.sectionTitle, styles.contactSection]}>Location</Text>
        
        <Input
          label="Current City"
          value={formData.currentCity}
          onChangeText={(value) => handleChange('currentCity', value)}
          placeholder="Where do you live now?"
        />
        
        <Input
          label="Hometown"
          value={formData.hometown}
          onChangeText={(value) => handleChange('hometown', value)}
          placeholder="Where are you from?"
        />
        
        <View style={styles.actions}>
          <Button
            title="Save Changes"
            onPress={handleSubmit}
            isLoading={loading}
            style={styles.saveButton}
          />
          
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  coverContainer: {
    height: 150,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  uploadText: {
    color: '#666',
    marginTop: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 20,
  },
  avatarContainer: {
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
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    marginTop: 10,
    color: '#6200ee',
    fontWeight: '500',
  },
  form: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  contactSection: {
    marginTop: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  datePickerButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 16,
    color: '#666',
  },
  actions: {
    marginTop: 20,
    marginBottom: 30,
  },
  saveButton: {
    marginBottom: 10,
  },
  cancelButton: {
    marginBottom: 10,
  },
});