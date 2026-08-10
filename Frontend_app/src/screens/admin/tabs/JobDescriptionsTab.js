import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JobCard from '../../../componants/JobCard';
import { getAdminJobDescriptions } from '../../../api/admin/adminApi';
import { deleteJobDescription } from '../../../api/recruiter/jobDescriptionApi';
import { getApiErrorMessage } from '../../../api/apiClient';

const filters = ['All', 'Active', 'Closed'];

export default function JobDescriptionsTab({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState('');

  const loadJobs = async () => {
    try {
      const response = await getAdminJobDescriptions();
      setJobs(response.data.records.map((job) => ({
        ...job,
        id: job.jd_id,
        createdAt: new Date(job.upload_date).toLocaleDateString(),
      })));
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Unable to load job descriptions.'));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadJobs);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (job) => {
    Alert.alert('Delete Job Description', `Delete ${job.title}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteJobDescription(job.id);
            await loadJobs();
          } catch (error) {
            Alert.alert('Error', getApiErrorMessage(error, 'Unable to delete job description.'));
          }
        },
      },
    ]);
  };

  const visibleJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={visibleJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onEdit={() => Alert.alert('Job Description', item.description || 'No description available.')}
              onDelete={() => handleDelete(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Job Descriptions</Text>
                <Text style={styles.headerSubtitle}>Manage recruiter job descriptions</Text>
              </View>
              <View style={styles.contentStart}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#7A8194" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search job descriptions"
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
                      onPress={() => setActiveFilter(filter)}
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
        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate('EditJobDescription', { mode: 'create' })}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  container: {
    flex: 1,
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
    marginTop: 14,
  },
  filterChip: {
    marginRight: 8,
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
    paddingBottom: 96,
    paddingHorizontal: 20,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B5FEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
});
