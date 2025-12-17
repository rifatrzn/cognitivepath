/**
 * Patient List Screen
 * Displays list of patients
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import patientService from '../services/patientService';

export default function PatientListScreen({ navigation }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientService.getPatients();
      if (response.success) {
        setPatients(response.data.patients);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPatients();
  };

  const renderPatient = ({ item }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => navigation.navigate('PatientDetail', { patientId: item.id })}
    >
      <Text style={styles.patientName}>{item.name}</Text>
      <Text style={styles.patientInfo}>Age: {item.age}</Text>
      {item.risk_level && (
        <Text style={[styles.riskLevel, styles[`risk${item.risk_level}`]]]}>
          Risk: {item.risk_level}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={patients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No patients found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientCard: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  patientInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  riskLevel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
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
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});




