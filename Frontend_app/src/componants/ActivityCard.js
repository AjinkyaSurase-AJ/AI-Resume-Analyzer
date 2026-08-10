import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ActivityCard({ activity }) {
  return (
    <View style={styles.card}>
      <View style={styles.emptyIcon}>
        <Ionicons name="time" size={26} color="#5B5FEF" />
      </View>
      <Text style={styles.title}>Recent Activity</Text>
      <Text style={styles.body}>
        {activity ? `${activity.event}: ${activity.description}` : 'No recent activity available.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF0FF',
  },
  title: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '800',
    color: '#172033',
  },
  body: {
    marginTop: 6,
    fontSize: 14,
    color: '#7A8194',
  },
});
