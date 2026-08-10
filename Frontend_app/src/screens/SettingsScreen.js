import React, { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../componants/ScreenHeader';

const sections = [{ id: 'settings' }];

const settings = [
  { id: 'notifications', label: 'Email Notifications', icon: 'mail' },
  { id: 'maintenance', label: 'Maintenance Mode', icon: 'construct' },
  { id: 'autoBackup', label: 'Automatic Backups', icon: 'cloud-upload' },
];

export default function SettingsScreen({ navigation }) {
  const [enabledSettings, setEnabledSettings] = useState({
    notifications: true,
    maintenance: false,
    autoBackup: true,
  });

  const toggleSetting = (id) => {
    setEnabledSettings((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const renderContent = () => (
    <View>
      <ScreenHeader
        icon="settings"
        title="Settings"
        subtitle="Configure admin preferences"
        onBack={navigation.goBack}
      />
      <View style={styles.content}>
        <View style={styles.card}>
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingRow}>
              <View style={styles.iconWrap}>
                <Ionicons name={setting.icon} size={20} color="#5B5FEF" />
              </View>
              <Text style={styles.settingText}>{setting.label}</Text>
              <Switch
                value={Boolean(enabledSettings[setting.id])}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: '#ECECEC', true: '#C7D2FE' }}
                thumbColor={enabledSettings[setting.id] ? '#5B5FEF' : '#FFFFFF'}
              />
            </View>
          ))}
          {/* TODO: Load and persist admin settings through backend. */}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Controls</Text>
          <Pressable style={styles.secondaryButton} onPress={() => {}}>
            {/* TODO: Trigger export through backend. */}
            <Ionicons name="download" size={20} color="#5B5FEF" />
            <Text style={styles.secondaryText}>Export Platform Data</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={() => {}}>
            {/* TODO: Trigger cache clear through backend. */}
            <Ionicons name="refresh" size={20} color="#EF4444" />
            <Text style={styles.dangerText}>Clear Cache</Text>
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
    marginBottom: 16,
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF0FF',
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#EEF0FF',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    marginTop: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
  },
  secondaryText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '800',
    color: '#5B5FEF',
  },
  dangerText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '800',
    color: '#EF4444',
  },
});
