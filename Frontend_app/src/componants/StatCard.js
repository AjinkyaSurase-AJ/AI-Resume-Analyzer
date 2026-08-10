import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatCard({ icon, label, value, tone }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, tone]}>
        <Ionicons name={icon} size={22} color="#5B5FEF" />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    padding: 16,
    marginBottom: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF0FF',
  },
  value: {
    marginTop: 14,
    fontSize: 26,
    fontWeight: '800',
    color: '#172033',
  },
  label: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: '#7A8194',
  },
});
