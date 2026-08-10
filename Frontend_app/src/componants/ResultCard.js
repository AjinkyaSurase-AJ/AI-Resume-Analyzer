import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ResultCard({ result, onPress }) {
  const scoreLabel = result.score === '--' ? '--' : `${result.score}%`;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.content}>
          <Text style={styles.resume}>{result.resumeName}</Text>
          {result.candidateName ? <Text style={styles.detail}>{result.candidateName}</Text> : null}
          <Text style={styles.detail}>{result.jobTitle}</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.score}>{scoreLabel}</Text>
        </View>
      </View>
      <Text style={styles.date}>{result.analysisDate}</Text>
    </Pressable>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  resume: {
    fontSize: 17,
    fontWeight: '800',
    color: '#172033',
  },
  detail: {
    marginTop: 5,
    fontSize: 14,
    color: '#7A8194',
  },
  scoreBadge: {
    minWidth: 58,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
  },
  score: {
    fontSize: 15,
    fontWeight: '900',
    color: '#22C55E',
  },
  date: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    fontSize: 13,
    fontWeight: '700',
    color: '#7A8194',
  },
});
