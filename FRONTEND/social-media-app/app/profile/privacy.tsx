// app/profile/privacy.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/AuthContext';
import Button from '../../src/components/Button';
import CustomAlert from '../../src/components/CustomAlert';
import profileApi from '../../src/api/profileApi';
import { Ionicons } from '@expo/vector-icons';
import { PrivacySettingsDTO } from '../../src/types';

interface VisibilityOption {
  label: string;
  value: string;
}

export default function PrivacySettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsDTO | null>(null);
  
  // Alert state
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await profileApi.getPrivacySettings();
      setPrivacySettings(data);
    } catch (error) {
      showAlert('Error', (error as Error).message || 'Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: keyof PrivacySettingsDTO, value: any): void => {
    if (!privacySettings) return;
    
    setPrivacySettings({
      ...privacySettings,
      [name]: value
    });
  };

  const handleSectionVisibilityChange = (section: string, value: string): void => {
    if (!privacySettings) return;
    
    setPrivacySettings({
      ...privacySettings,
      sectionVisibility: {
        ...privacySettings.sectionVisibility,
        [section]: value
      }
    });
  };

  const handleSave = async (): Promise<void> => {
    if (!privacySettings) return;
    
    try {
      setLoading(true);
      await profileApi.updatePrivacySettings(privacySettings);
      showAlert('Success', 'Privacy settings updated successfully');
    } catch (error) {
      showAlert('Error', (error as Error).message || 'Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title: string, message: string): void => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const visibilityOptions: VisibilityOption[] = [
    { label: 'Public', value: 'PUBLIC' },
    { label: 'Friends Only', value: 'FRIENDS' },
    { label: 'Only Me', value: 'ONLY_ME' },
  ];

  if (!privacySettings) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading privacy settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Privacy Settings</Text>
          <Text style={styles.headerSubtitle}>
            Control who can see your information
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Visibility</Text>
          
          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>Who can see your profile?</Text>
            
            <View style={styles.radioGroup}>
              {visibilityOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() => handleChange('profileVisibility', option.value)}
                >
                  <View style={styles.radioButton}>
                    {privacySettings.profileVisibility === option.value && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>Who can see your friend list?</Text>
            
            <View style={styles.radioGroup}>
              {visibilityOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() => handleChange('friendListVisibility', option.value)}
                >
                  <View style={styles.radioButton}>
                    {privacySettings.friendListVisibility === option.value && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Section Visibility</Text>
          
          <View style={styles.sectionVisibilityGroup}>
            <Text style={styles.sectionVisibilityTitle}>Basic Information</Text>
            <TouchableOpacity
              style={styles.visibilitySelector}
              onPress={() => {
                const currentValue = privacySettings.sectionVisibility.BASIC_INFO || 'PUBLIC';
                const nextIndex = visibilityOptions.findIndex(o => o.value === currentValue) + 1;
                const nextValue = visibilityOptions[nextIndex % 3].value;
                handleSectionVisibilityChange('BASIC_INFO', nextValue);
              }}
            >
              <Text style={styles.visibilitySelectorText}>
                {visibilityOptions.find(o => o.value === (privacySettings.sectionVisibility.BASIC_INFO || 'PUBLIC'))?.label}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sectionVisibilityGroup}>
            <Text style={styles.sectionVisibilityTitle}>Work Experience</Text>
            <TouchableOpacity
              style={styles.visibilitySelector}
              onPress={() => {
                const currentValue = privacySettings.sectionVisibility.WORK_EXPERIENCE || 'FRIENDS';
                const nextIndex = visibilityOptions.findIndex(o => o.value === currentValue) + 1;
                const nextValue = visibilityOptions[nextIndex % 3].value;
                handleSectionVisibilityChange('WORK_EXPERIENCE', nextValue);
              }}
            >
              <Text style={styles.visibilitySelectorText}>
                {visibilityOptions.find(o => o.value === (privacySettings.sectionVisibility.WORK_EXPERIENCE || 'FRIENDS'))?.label}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sectionVisibilityGroup}>
            <Text style={styles.sectionVisibilityTitle}>Education</Text>
            <TouchableOpacity
              style={styles.visibilitySelector}
              onPress={() => {
                const currentValue = privacySettings.sectionVisibility.EDUCATION || 'FRIENDS';
                const nextIndex = visibilityOptions.findIndex(o => o.value === currentValue) + 1;
                const nextValue = visibilityOptions[nextIndex % 3].value;
                handleSectionVisibilityChange('EDUCATION', nextValue);
              }}
            >
              <Text style={styles.visibilitySelectorText}>
                {visibilityOptions.find(o => o.value === (privacySettings.sectionVisibility.EDUCATION || 'FRIENDS'))?.label}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sectionVisibilityGroup}>
            <Text style={styles.sectionVisibilityTitle}>Contact Information</Text>
            <TouchableOpacity
              style={styles.visibilitySelector}
              onPress={() => {
                const currentValue = privacySettings.sectionVisibility.CONTACT_INFO || 'ONLY_ME';
                const nextIndex = visibilityOptions.findIndex(o => o.value === currentValue) + 1;
                const nextValue = visibilityOptions[nextIndex % 3].value;
                handleSectionVisibilityChange('CONTACT_INFO', nextValue);
              }}
            >
              <Text style={styles.visibilitySelectorText}>
                {visibilityOptions.find(o => o.value === (privacySettings.sectionVisibility.CONTACT_INFO || 'ONLY_ME'))?.label}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Options</Text>
          
          <View style={styles.toggleGroup}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleLabel}>
                <Text style={styles.toggleTitle}>Allow search engines</Text>
                <Text style={styles.toggleDescription}>
                  Search engines can index your profile
                </Text>
              </View>
              <Switch
                value={privacySettings.allowSearchEngines}
                onValueChange={(value) => handleChange('allowSearchEngines', value)}
                trackColor={{ false: '#d1d1d1', true: '#b794f6' }}
                thumbColor={privacySettings.allowSearchEngines ? '#6200ee' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.toggleItem}>
              <View style={styles.toggleLabel}>
                <Text style={styles.toggleTitle}>Show in friend suggestions</Text>
                <Text style={styles.toggleDescription}>
                  Your profile can be suggested to others
                </Text>
              </View>
              <Switch
                value={privacySettings.showInFriendSuggestions}
                onValueChange={(value) => handleChange('showInFriendSuggestions', value)}
                trackColor={{ false: '#d1d1d1', true: '#b794f6' }}
                thumbColor={privacySettings.showInFriendSuggestions ? '#6200ee' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.toggleItem}>
              <View style={styles.toggleLabel}>
                <Text style={styles.toggleTitle}>Allow friend requests</Text>
                <Text style={styles.toggleDescription}>
                  Others can send you friend requests
                </Text>
              </View>
              <Switch
                value={privacySettings.allowFriendRequests}
                onValueChange={(value) => handleChange('allowFriendRequests', value)}
                trackColor={{ false: '#d1d1d1', true: '#b794f6' }}
                thumbColor={privacySettings.allowFriendRequests ? '#6200ee' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            isLoading={loading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    margin: 12,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  optionGroup: {
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  radioGroup: {
    marginLeft: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  sectionVisibilityGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionVisibilityTitle: {
    fontSize: 16,
  },
  visibilitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  visibilitySelectorText: {
    marginRight: 5,
    fontSize: 14,
    color: '#333',
  },
  toggleGroup: {
    marginTop: 5,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleLabel: {
    flex: 1,
    marginRight: 10,
  },
  toggleTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    padding: 16,
    marginBottom: 30,
  },
  saveButton: {
    marginBottom: 10,
  },
});