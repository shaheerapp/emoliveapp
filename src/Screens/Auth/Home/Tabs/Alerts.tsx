import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

export default function Alerts() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Alerts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
