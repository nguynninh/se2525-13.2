import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Sidebar() {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.brand}>Dashboard</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 80,
    backgroundColor: '#f3f4f6',
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  brand: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
});


