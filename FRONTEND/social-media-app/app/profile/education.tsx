// app/profile/education.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/AuthContext';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import CustomAlert from '../../src/components/CustomAlert';
import profileApi from '../../src/api/profileApi';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EducationDTO } from '../../src/types';

interface EducationFormData {
  id: string | null;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date;
  current: boolean;
  description: string;
}

export default function EducationScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [education, setEducation] = useState<EducationDTO[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentEducation, setCurrentEducation] = useState<EducationDTO | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  
  // Alert state
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<EducationFormData>({
    id: null,
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: new Date(),
    endDate: new Date(),
    current: false,
    description: '',
  });

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async (): Promise<void> => {
    if (!user?.username) return;
    
    try {
      setLoading(true);
      const data = await profileApi.getProfile(user.username);
      if (data && data.education) {
        setEducation(data.education);
      }
    } catch (error) {
      showAlert('Error', (error as Error).message || 'Failed to load education data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: keyof EducationFormData, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = (): void => {
    setFormData({
      id: null,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: new Date(),
      endDate: new Date(),
      current: false,
      description: '',
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (item: EducationDTO): void => {
    setFormData({
      id: item.id,
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy || '',
      startDate: new Date(item.startDate),
      endDate: item.endDate ? new Date(item.endDate) : new Date(),
      current: item.current,
      description: item.description || '',
    });
    setCurrentEducation(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      if (!formData.institution || !formData.degree) {
        return showAlert('Missing Information', 'Institution and degree are required.');
      }

      setLoading(true);
      
      if (isEditing && formData.id) {
        const { id, ...updateData } = formData;
        await profileApi.updateEducation(id, updateData);
      } else {
        const { id, ...newData } = formData;
        await profileApi.addEducation(newData);
      }
      
      setShowModal(false);
      loadEducation();
      
      showAlert(
        'Success', 
        isEditing ? 'Education updated successfully' : 'Education added successfully'
      );
    } catch (error) {
      showAlert('Error', (error as Error).message || 'Failed to save education data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await profileApi.deleteEducation(id);
      loadEducation();
      showAlert('Success', 'Education deleted successfully');
    } catch (error) {
      showAlert('Error', (error as Error).message || 'Failed to delete education');
    } finally {
      setLoading(false);
    }
  };

  const onStartDateChange = (event: any, selectedDate?: Date): void => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      handleChange('startDate', selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date): void => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      handleChange('endDate', selectedDate);
    }
  };

  const showAlert = (title: string, message: string): void => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

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
          <Text style={styles.headerTitle}>Education</Text>
          <Text style={styles.headerSubtitle}>
            Add your education history to your profile
          </Text>
        </View>
        
        {education.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              You haven't added any education yet
            </Text>
          </View>
        ) : (
          <View style={styles.educationList}>
            {education.map(item => (
              <View key={item.id} style={styles.educationItem}>
                <View style={styles.educationContent}>
                  <Text style={styles.institution}>{item.institution}</Text>
                  <Text style={styles.degree}>
                    {item.degree} {item.fieldOfStudy && `in ${item.fieldOfStudy}`}
                  </Text>
                  <Text style={styles.date}>
                    {new Date(item.startDate).getFullYear()} - 
                    {item.current ? 'Present' : new Date(item.endDate as Date).getFullYear()}
                  </Text>
                  {item.description && (
                    <Text style={styles.description}>
                      {item.description}
                    </Text>
                  )}
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => openEditModal(item)}
                  >
                    <Ionicons name="pencil-outline" size={20} color="#6200ee" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.fab}
        onPress={openAddModal}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
      
      {/* Modal for Add/Edit Education */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Education' : 'Add Education'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <Input
                label="Institution *"
                value={formData.institution}
                onChangeText={(text) => handleChange('institution', text)}
                placeholder="Enter school or university name"
              />
              
              <Input
                label="Degree *"
                value={formData.degree}
                onChangeText={(text) => handleChange('degree', text)}
                placeholder="Enter degree type (Bachelor's, Master's, etc.)"
              />
              
              <Input
                label="Field of Study"
                value={formData.fieldOfStudy}
                onChangeText={(text) => handleChange('fieldOfStudy', text)}
                placeholder="Enter field of study or major"
              />
              
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateValue}>
                  {formData.startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              
              {showStartDatePicker && (
                <DateTimePicker
                  value={formData.startDate}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                  maximumDate={new Date()}
                />
              )}
              
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Currently studying here</Text>
                <Switch
                  value={formData.current}
                  onValueChange={(value) => handleChange('current', value)}
                  trackColor={{ false: '#d1d1d1', true: '#b794f6' }}
                  thumbColor={formData.current ? '#6200ee' : '#f4f3f4'}
                />
              </View>
              
              {!formData.current && (
                <>
                  <TouchableOpacity 
                    style={styles.datePickerButton}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={styles.dateLabel}>End Date</Text>
                    <Text style={styles.dateValue}>
                      {formData.endDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={formData.endDate}
                      mode="date"
                      display="default"
                      onChange={onEndDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
              
              <Input
                label="Description"
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                placeholder="Describe your studies or achievements"
                multiline
                style={styles.textArea}
              />
              
              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setShowModal(false)}
                  variant="outline"
                  style={styles.modalButton}
                />
                <Button
                  title={isEditing ? "Update" : "Add"}
                  onPress={handleSubmit}
                  isLoading={loading}
                  style={styles.modalButton}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  educationList: {
    padding: 15,
  },
  educationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  educationContent: {
    flex: 1,
  },
  institution: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  degree: {
    fontSize: 16,
    color: '#555',
    marginTop: 2,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    lineHeight: 20,
  },
  actionButtons: {
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  editButton: {
    padding: 6,
  },
  deleteButton: {
    padding: 6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalForm: {
    padding: 15,
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});