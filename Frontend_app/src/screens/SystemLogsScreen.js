import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../componants/ScreenHeader';
import { getAdminLogs } from '../api/admin/adminApi';
import { getApiErrorMessage } from '../api/apiClient';

const levelStyles = {
  Info: { badge: 'infoBadge', text: 'infoText' },
  Warning: { badge: 'warningBadge', text: 'warningText' },
  Error: { badge: 'errorBadge', text: 'errorText' },
};

export default function SystemLogsScreen({ navigation }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await getAdminLogs();
        setLogs(response.data.records.map((log) => ({
          ...log,
          id: log.log_id,
          level: 'Info',
          message: log.description || log.event,
          time: new Date(log.created_at).toLocaleString(),
        })));
      } catch (error) {
        Alert.alert('Error', getApiErrorMessage(error, 'Unable to load system logs.'));
      }
    };
    loadLogs();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const tone = levelStyles[item.level];

          return (
            <View style={styles.logCard}>
              <View style={[styles.levelBadge, styles[tone.badge]]}>
                <Text style={[styles.levelText, styles[tone.text]]}>{item.level}</Text>
              </View>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          );
        }}
        ListHeaderComponent={
          <View>
            <ScreenHeader
              icon="terminal"
              title="System Logs"
              subtitle="Review platform events and issues"
              onBack={navigation.goBack}
            />
            <View style={styles.summaryCard}>
              <Ionicons name="server" size={24} color="#5B5FEF" />
              <Text style={styles.summaryTitle}>Log Stream</Text>
              <Text style={styles.summaryText}>{logs.length} recent platform events</Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  summaryCard: {
    marginTop: -36,
    marginBottom: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  summaryTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#172033',
  },
  summaryText: {
    marginTop: 6,
    fontSize: 14,
    color: '#7A8194',
  },
  logCard: {
    padding: 18,
    marginBottom: 16,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 13,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '800',
  },
  infoBadge: {
    backgroundColor: '#EEF0FF',
  },
  warningBadge: {
    backgroundColor: '#FEF3C7',
  },
  errorBadge: {
    backgroundColor: '#FEE2E2',
  },
  infoText: {
    color: '#5B5FEF',
  },
  warningText: {
    color: '#F59E0B',
  },
  errorText: {
    color: '#EF4444',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#172033',
  },
  time: {
    marginTop: 6,
    fontSize: 13,
    color: '#7A8194',
  },
});
