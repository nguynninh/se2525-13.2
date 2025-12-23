import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ label, value, color = '#3b82f6' }) {
  return (
    <View style={[styles.card, { borderColor: '#e5e7eb' }]}> 
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  texts: {
    flex: 1,
  },
  label: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});



