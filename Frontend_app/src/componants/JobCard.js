import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{job.title}</Text>
          {job.company ? <Text style={styles.company}>{job.company}</Text> : null}
        </View>
        {job.status ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{job.status}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Created: {job.createdAt}</Text>
        {job.resumeCount !== undefined ? <Text style={styles.meta}>{job.resumeCount} resumes</Text> : null}
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="create" size={18} color="#5B5FEF" />
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash" size={18} color="#EF4444" />
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#172033',
  },
  company: {
    marginTop: 4,
    fontSize: 14,
    color: '#7A8194',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 13,
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#22C55E',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  meta: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7A8194',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#EEF0FF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '800',
    color: '#5B5FEF',
  },
  deleteText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '800',
    color: '#EF4444',
  },
});
