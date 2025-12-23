import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Sidebar from '../ui/Sidebar';
import Header from '../ui/Header';
import StatCard from '../ui/StatCard';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.main}>
        <Header />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.statsRow}>
            <StatCard label="Total visitors" value="2.761" color="#ef4444" />
            <StatCard label="Order" value="580" color="#f43f5e" />
            <StatCard label="Revenue" value="22.000.000₫" color="#8b5cf6" />
            <StatCard label="Canceled" value="90" color="#38bdf8" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  main: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});


