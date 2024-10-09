import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

const ArtistAboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Placeholder for the Artist Bio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bio</Text>
        <Text style={styles.placeholderText}>
          This is where the artist's bio will be displayed.
        </Text>
      </View>

      {/* Placeholder for the Social Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social Links</Text>
        <Text style={styles.placeholderText}>
          This is where the artist's social links will be displayed.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ArtistAboutScreen;
