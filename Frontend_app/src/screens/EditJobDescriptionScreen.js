import React, { useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../componants/ScreenHeader';
import FormField from '../componants/FormField';
import { createJobDescription } from '../api/recruiter/jobDescriptionApi';
import { getApiErrorMessage } from '../api/apiClient';

const sections = [{ id: 'edit-job-description' }];

export default function EditJobDescriptionScreen({ navigation, route }) {
  const mode = route.params?.mode === 'create' ? 'Create' : 'Edit';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (mode !== 'Create') {
      Alert.alert('Unavailable', 'The backend does not provide a job-description update API.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      Alert.alert('Validation', 'Job title and description are required.');
      return;
    }

    try {
      setSaving(true);
      await createJobDescription({
        title: title.trim(),
        description: description.trim(),
        experience_required: experienceRequired.trim() || undefined,
      });
      Alert.alert('Success', 'Job description created successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Unable to create job description.'));
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => (
    <View>
      <ScreenHeader
        icon={mode === 'Create' ? 'add-circle' : 'create'}
        title={`${mode} Job Description`}
        subtitle="Prepare recruiter job requirements"
        onBack={navigation.goBack}
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <FormField label="Job Title" placeholder="Enter job title" value={title} onChangeText={setTitle} />
          <FormField label="Experience Required" placeholder="Enter required experience" value={experienceRequired} onChangeText={setExperienceRequired} />
          <FormField label="Description" placeholder="Enter full job description" multiline value={description} onChangeText={setDescription} />
          <Pressable style={styles.primaryButton} onPress={handleSubmit} disabled={saving}>
            <Ionicons name="save" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>
              {saving ? 'Saving...' : `${mode} Job Description`}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  content: {
    marginTop: -36,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#5B5FEF',
  },
  primaryButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
