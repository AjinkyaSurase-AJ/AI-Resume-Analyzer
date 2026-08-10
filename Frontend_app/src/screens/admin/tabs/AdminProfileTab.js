import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import config from '../../../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../../../api/profileApi';
import { getApiErrorMessage } from '../../../api/apiClient';

const profileSections = [{ id: 'profile-content' }];

const actions = [
  { id: 'edit-profile', label: 'Edit Profile', icon: 'create', screen: 'EditProfile' },
  { id: 'change-password', label: 'Change Password', icon: 'lock-closed', screen: 'ChangePassword' },
  { id: 'settings', label: 'Settings', icon: 'settings', screen: 'Settings' },
  { id: 'logout', label: 'Logout', icon: 'log-out', screen: 'Login' },
];

export default function AdminProfileTab({ navigation }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (error) {
        Alert.alert('Error', getApiErrorMessage(error, 'Unable to load profile.'));
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogoutPress = async () => {
    try {
      await AsyncStorage.removeItem(config.KEY_TOKEN);
      await AsyncStorage.removeItem(config.KEY_REMEMBER_ME);
      await AsyncStorage.removeItem("user")
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleActionPress = (action) => {
    if (action.id === 'logout') {
      handleLogoutPress();
      return;
    }
    if (action.screen) {
      navigation.navigate(action.screen);
    }
  };

  const renderContent = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={38} color="#5B5FEF" />
        </View>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Profile Summary</Text>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{profile?.name || '--'}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile?.email || '--'}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>Admin</Text>
          </View>
        </View>

        <View style={styles.actionCard}>
          {actions.map((action) => (
            <Pressable key={action.id} style={styles.actionRow} onPress={() => handleActionPress(action)}>
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={20} color="#5B5FEF" />
              </View>
              <Text style={styles.actionText}>{action.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#7A8194" />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={profileSections}
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
  header: {
    height: 240,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 42,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: '#5B5FEF',
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 15,
    color: '#E8EAFF',
  },
  content: {
    marginTop: -36,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  summaryCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#172033',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  label: {
    fontSize: 14,
    color: '#7A8194',
  },
  value: {
    fontSize: 14,
    fontWeight: '800',
    color: '#172033',
  },
  actionCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF0FF',
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
  },
});
