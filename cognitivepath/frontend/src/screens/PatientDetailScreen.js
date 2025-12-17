/**
 * Patient Detail Screen
 * Shows detailed patient information
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import patientService from '../services/patientService';

export default function PatientDetailScreen({ route }) {
  const { patientId } = route.params;
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    try {
      const response = await patientService.getPatient(patientId);
      if (response.success) {
        setPatient(response.data.patient);
      }
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.center}>
        <Text>Patient not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{patient.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Age</Text>
        <Text style={styles.value}>{patient.age}</Text>
      </View>

      {patient.email && (
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{patient.email}</Text>
        </View>
      )}

      {patient.phone && (
        <View style={styles.section}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{patient.phone}</Text>
        </View>
      )}

      {patient.cognitive_score !== null && (
        <View style={styles.section}>
          <Text style={styles.label}>Cognitive Score</Text>
          <Text style={styles.value}>{patient.cognitive_score}/100</Text>
        </View>
      )}

      {patient.risk_level && (
        <View style={styles.section}>
          <Text style={styles.label}>Risk Level</Text>
          <Text style={[styles.value, styles[`risk${patient.risk_level}`]]]}>
            {patient.risk_level}
          </Text>
        </View>
      )}

      {patient.status && (
        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{patient.status}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  riskLow: {
    color: '#27ae60',
  },
  riskModerate: {
    color: '#f39c12',
  },
  riskHigh: {
    color: '#e74c3c',
  },
});




