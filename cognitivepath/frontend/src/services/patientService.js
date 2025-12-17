/**
 * Patient Service
 * Handles patient-related API calls
 */

import apiClient from '../config/api';

class PatientService {
  /**
   * Get all patients
   */
  async getPatients(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.risk_level) queryParams.append('risk_level', filters.risk_level);
    if (filters.status) queryParams.append('status', filters.status);

    const queryString = queryParams.toString();
    const endpoint = `/patients${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  }

  /**
   * Get patient by ID
   */
  async getPatient(id) {
    return apiClient.get(`/patients/${id}`);
  }

  /**
   * Create new patient
   */
  async createPatient(patientData) {
    return apiClient.post('/patients', patientData);
  }

  /**
   * Update patient
   */
  async updatePatient(id, updates) {
    return apiClient.put(`/patients/${id}`, updates);
  }

  /**
   * Delete patient
   */
  async deletePatient(id) {
    return apiClient.delete(`/patients/${id}`);
  }
}

export default new PatientService();




