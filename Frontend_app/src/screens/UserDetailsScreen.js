import React from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../componants/ScreenHeader';
import { deleteAdminUser } from '../api/admin/adminApi';
import { getApiErrorMessage } from '../api/apiClient';

const sections = [{ id: 'user-details' }];

export default function UserDetailsScreen({ navigation, route }) {
  const user = route.params?.user;
  const rows = [
    { id: 'name', label: 'Name', value: user?.name || '--' },
    { id: 'email', label: 'Email', value: user?.email || '--' },
    { id: 'role', label: 'Role', value: user?.role || '--' },
    {
      id: 'created',
      label: 'Joined',
      value: user?.registration_date ? new Date(user.registration_date).toLocaleDateString() : '--',
    },
  ];

  const handleDelete = () => {
    if (!user?.id) return;
    Alert.alert('Delete User', `Delete ${user.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAdminUser(user.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', getApiErrorMessage(error, 'Unable to delete user.'));
          }
        },
      },
    ]);
  };
  const renderContent = () => (
    <View>
      <ScreenHeader
        icon="person"
        title="User Details"
        subtitle="Review account information and access"
        onBack={navigation.goBack}
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.initials || '--'}</Text>
          </View>
          {rows.map((row) => (
            <View key={row.id} style={styles.row}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
          ))}
          <Pressable style={styles.dangerButton} onPress={handleDelete}>
            <Ionicons name="trash" size={20} color="#EF4444" />
            <Text style={styles.dangerText}>Delete User</Text>
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
    alignItems: 'center',
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 76,
    height: 76,
    marginBottom: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF0FF',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#5B5FEF',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  label: {
    fontSize: 14,
    color: '#7A8194',
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '800',
    color: '#172033',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 54,
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
  },
  dangerText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '800',
    color: '#EF4444',
  },
});
