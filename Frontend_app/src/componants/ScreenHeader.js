import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ScreenHeader({ icon, title, subtitle, onBack }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </Pressable>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={30} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 240,
    paddingHorizontal: 20,
    paddingTop: 44,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: '#5B5FEF',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  iconWrap: {
    width: 58,
    height: 58,
    marginTop: 16,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  title: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 7,
    fontSize: 15,
    color: '#E8EAFF',
  },
});
