import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../componants/ScreenHeader';
import FormField from '../componants/FormField';
import { getProfile, updateProfile } from '../api/profileApi';
import { getApiErrorMessage } from '../api/apiClient';
import { SafeAreaView } from 'react-native-safe-area-context';

const sections = [{ id: 'edit-profile' }];

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        setName(response.data.name || '');
        setEmail(response.data.email || '');
      } catch (error) {
        Alert.alert('Error', getApiErrorMessage(error, 'Unable to load profile.'));
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validation', 'Name and email are required.');
      return;
    }

    try {
      setSaving(true);
      await updateProfile({ name: name.trim(), email: email.trim() });
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Unable to update profile.'));
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => (
    <View>
      <ScreenHeader
        icon="person-circle"
        title="Edit Profile"
        subtitle="Update account details"
        onBack={navigation.goBack}
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <FormField label="Name" placeholder="Enter your name" value={name} onChangeText={setName} />
          <FormField label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Pressable style={styles.primaryButton} onPress={handleSave} disabled={saving}>
            <Ionicons name="save" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
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
