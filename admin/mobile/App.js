import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import Dashboard from './src/screens/Dashboard';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        <Dashboard />
      </View>
    </SafeAreaView>
  );
}

