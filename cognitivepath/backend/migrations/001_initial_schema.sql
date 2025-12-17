-- CognitivePath Database Schema
-- Initial migration for users and patients tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'provider', 'coordinator', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 120),
    email VARCHAR(255),
    phone VARCHAR(50),
    provider_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    cognitive_score INTEGER CHECK (cognitive_score >= 0 AND cognitive_score <= 100),
    risk_level VARCHAR(20) CHECK (risk_level IN ('Low', 'Moderate', 'High')),
    status VARCHAR(50) DEFAULT 'Monitoring' CHECK (status IN ('Monitoring', 'Detected', 'Intervention', 'Stable', 'Improving', 'Declining')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for patients
CREATE INDEX IF NOT EXISTS idx_patients_provider_id ON patients(provider_id);
CREATE INDEX IF NOT EXISTS idx_patients_risk_level ON patients(risk_level);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

-- Assessments table (for future use)
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    transcript TEXT,
    audio_url VARCHAR(500),
    cognitive_score INTEGER,
    risk_level VARCHAR(20),
    signals JSONB,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessments_patient_id ON assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_analyzed_at ON assessments(analyzed_at);

-- Tasks table (for patient exercises)
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('cognitive', 'lifestyle')),
    description TEXT,
    duration VARCHAR(50),
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_patient_id ON tasks(patient_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();




