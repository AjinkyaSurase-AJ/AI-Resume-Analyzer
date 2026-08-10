import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserCard from '../../../componants/UserCard';
import { deleteAdminUser, getAdminUsers } from '../../../api/admin/adminApi';
import { getApiErrorMessage } from '../../../api/apiClient';

const filters = ['All', 'Candidate', 'Recruiter', 'Admin'];

export default function UsersTab({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');

  const loadUsers = async (filter = activeFilter) => {
    try {
      const role = filter === 'All' ? '' : filter.toLowerCase();
      const response = await getAdminUsers(role);
      setUsers(response.data.records.map((user) => ({
        ...user,
        id: user.user_id,
        initials: user.name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      })));
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Unable to load users.'));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => loadUsers());
    return unsubscribe;
  }, [navigation, activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    loadUsers(filter);
  };

  const handleDeleteUser = (user) => {
    Alert.alert('Delete User', `Delete ${user.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAdminUser(user.id);
            await loadUsers();
          } catch (error) {
            Alert.alert('Error', getApiErrorMessage(error, 'Unable to delete user.'));
          }
        },
      },
    ]);
  };

  const visibleUsers = users.filter((user) => {
    const search = searchText.trim().toLowerCase();
    return !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={visibleUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => navigation.navigate('UserDetails', { user: item })}
            onDelete={() => handleDeleteUser(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Users</Text>
              <Text style={styles.headerSubtitle}>Manage platform users</Text>
            </View>
            <View style={styles.contentStart}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#7A8194" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search users"
                  placeholderTextColor="#7A8194"
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
              <View style={styles.filterRow}>
                {filters.map((filter) => (
                  <Pressable
                    key={filter}
                    style={[styles.filterChip, activeFilter === filter && styles.activeChip]}
                    onPress={() => handleFilterChange(filter)}
                  >
                    <Text style={[styles.filterText, activeFilter === filter && styles.activeText]}>
                      {filter}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
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
    paddingHorizontal: 20,
    paddingTop: 58,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: '#5B5FEF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#E8EAFF',
  },
  contentStart: {
    marginTop: -72,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#172033',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  activeChip: {
    backgroundColor: '#5B5FEF',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7A8194',
  },
  activeText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
});
