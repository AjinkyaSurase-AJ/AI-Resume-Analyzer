import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatCard from '../../../componants/StatCard';
import ActivityCard from '../../../componants/ActivityCard';
import { getAdminLogs, getDashboard } from '../../../api/admin/adminApi';
import { getApiErrorMessage } from '../../../api/apiClient';

const dashboardSections = [{ id: 'dashboard-content' }];

const quickActions = [
  { id: 'manage-users', label: 'Manage Users', icon: 'people', tab: 'Users' },
  { id: 'view-jobs', label: 'View Job Descriptions', icon: 'briefcase', tab: 'Jobs' },
  { id: 'view-results', label: 'View Analysis Results', icon: 'analytics', tab: 'Results' },
  { id: 'system-logs', label: 'View System Logs', icon: 'terminal', screen: 'SystemLogs' },
];

const systemInfo = [
  { id: 'version', label: 'Version', value: '1.0.0' },
  { id: 'server', label: 'Server Status', value: 'Connected' },
];

export default function DashboardTab({ navigation }) {
  const [dashboard, setDashboard] = useState({});
  const [recentActivity, setRecentActivity] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const [dashboardResponse, logsResponse] = await Promise.all([
          getDashboard(),
          getAdminLogs(1, 1),
        ]);
        setDashboard(dashboardResponse.data);
        setRecentActivity(logsResponse.data.records[0] || null);
      } catch (error) {
        Alert.alert('Error', getApiErrorMessage(error, 'Unable to load dashboard.'));
      }
    });
    return unsubscribe;
  }, [navigation]);

  const stats = [
    { id: 'users', label: 'Users', value: dashboard.users ?? '--', icon: 'people' },
    { id: 'resumes', label: 'Resumes', value: dashboard.resumes ?? '--', icon: 'document-text' },
    { id: 'jobs', label: 'Job Descriptions', value: dashboard.job_descriptions ?? '--', icon: 'briefcase' },
    { id: 'results', label: 'Analysis Results', value: dashboard.results ?? '--', icon: 'analytics' },
  ];
  const handleActionPress = (action) => {
    if (action.screen) {
      navigation.navigate(action.screen);
      return;
    }

    navigation.navigate(action.tab);
  };

  const renderContent = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark" size={34} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage the AI Resume Analyzer platform</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <StatCard key={item.id} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </View>

        <ActivityCard activity={recentActivity} />

        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          {quickActions.map((action) => (
            <Pressable key={action.id} style={styles.actionRow} onPress={() => handleActionPress(action)}>
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={20} color="#5B5FEF" />
              </View>
              <Text style={styles.actionText}>{action.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#7A8194" />
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>System Information</Text>
          {systemInfo.map((item) => (
            <View key={item.id} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={dashboardSections}
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
    paddingHorizontal: 20,
    paddingTop: 46,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: '#5B5FEF',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  headerTitle: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#E8EAFF',
  },
  content: {
    marginTop: -36,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionCard: {
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
  cardTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '800',
    color: '#172033',
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  infoLabel: {
    fontSize: 14,
    color: '#7A8194',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#172033',
  },
});
