import React, { useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../componants/ScreenHeader';
import FormField from '../componants/FormField';
import { changePassword } from '../api/profileApi';
import { getApiErrorMessage } from '../api/apiClient';

const sections = [{ id: 'change-password' }];

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation', 'All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Validation', 'New password must contain at least 6 characters.');
      return;
    }

    try {
      setSaving(true);
      await changePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Unable to change password.'));
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => (
    <View>
      <ScreenHeader
        icon="lock-closed"
        title="Change Password"
        subtitle="Refresh account security"
        onBack={navigation.goBack}
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <FormField label="Current Password" placeholder="Enter current password" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
          <FormField label="New Password" placeholder="Enter new password" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
          <FormField label="Confirm Password" placeholder="Confirm new password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
          <Pressable style={styles.primaryButton} onPress={handleUpdatePassword} disabled={saving}>
            <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>{saving ? 'Updating...' : 'Update Password'}</Text>
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
