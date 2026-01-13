# CognitivePath API Documentation

Complete API reference for the CognitivePath backend.

## Base URL

```
http://localhost:3001/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this structure:

**Success:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "errors": [ ... ] // For validation errors
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "patient" // Optional: patient, provider, coordinator, admin
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "patient"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Email already exists or validation failed
- `429` - Too many requests

---

### Login

Authenticate and receive JWT tokens.

**Endpoint:** `POST /auth/login`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "patient"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `403` - Account deactivated
- `429` - Too many requests

---

### Refresh Token

Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Refresh token required
- `401` - Invalid or expired refresh token

---

### Get Profile

Get current authenticated user's profile.

**Endpoint:** `GET /auth/profile`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "patient",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Update Profile

Update current user's profile.

**Endpoint:** `PUT /auth/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Updated"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Updated",
      "role": "patient"
    }
  }
}
```

---

### Change Password

Change current user's password.

**Endpoint:** `PUT /auth/change-password`

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Current password incorrect

---

## Patient Endpoints

### Get All Patients

Retrieve list of patients with pagination and filters.

**Endpoint:** `GET /patients`

**Authentication:** Required

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)
- `risk_level` (optional) - Filter by risk: Low, Moderate, High
- `status` (optional) - Filter by status

**Note:** Providers only see their own patients. Admins see all patients.

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": 1,
        "name": "Jane Smith",
        "age": 68,
        "email": "jane@example.com",
        "phone": "+1234567890",
        "cognitive_score": 58,
        "risk_level": "Moderate",
        "status": "Intervention",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

---

### Get Patient by ID

Retrieve a specific patient.

**Endpoint:** `GET /patients/:id`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": 1,
      "name": "Jane Smith",
      "age": 68,
      "email": "jane@example.com",
      "phone": "+1234567890",
      "provider_id": 2,
      "provider_name": "Dr. Smith",
      "cognitive_score": 58,
      "risk_level": "Moderate",
      "status": "Intervention",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `403` - Access denied (provider trying to access another provider's patient)
- `404` - Patient not found

---

### Create Patient

Create a new patient record.

**Endpoint:** `POST /patients`

**Authentication:** Required

**Authorization:** Provider or Admin only

**Request Body:**
```json
{
  "name": "Jane Smith",
  "age": 68,
  "email": "jane@example.com",
  "phone": "+1234567890"
}
```

**Validation:**
- `name` - Required, 2-100 characters
- `age` - Required, 18-120
- `email` - Optional, valid email format
- `phone` - Optional, valid phone format

**Response:**
```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "patient": {
      "id": 1,
      "name": "Jane Smith",
      "age": 68,
      "email": "jane@example.com",
      "phone": "+1234567890",
      "provider_id": 2,
      "cognitive_score": null,
      "risk_level": null,
      "status": "Monitoring",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Validation error
- `403` - Insufficient permissions

---

### Update Patient

Update patient information.

**Endpoint:** `PUT /patients/:id`

**Authentication:** Required

**Request Body:**
```json
{
  "cognitive_score": 65,
  "risk_level": "Moderate",
  "status": "Intervention"
}
```

**Allowed Fields:**
- `name`
- `age`
- `email`
- `phone`
- `cognitive_score` (0-100)
- `risk_level` (Low, Moderate, High)
- `status`

**Response:**
```json
{
  "success": true,
  "message": "Patient updated successfully",
  "data": {
    "patient": { ... }
  }
}
```

**Error Responses:**
- `403` - Access denied
- `404` - Patient not found

---

### Delete Patient

Delete a patient record.

**Endpoint:** `DELETE /patients/:id`

**Authentication:** Required

**Authorization:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

**Error Responses:**
- `403` - Insufficient permissions (not admin)
- `404` - Patient not found

---

## Health Check

### Get API Health

Check API status and version.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "version": "v1",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Handling

### Validation Errors

When validation fails, the response includes detailed error information:

```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long",
      "value": "short"
    }
  ]
}
```

### Authentication Errors

```json
{
  "success": false,
  "error": "Authentication required. Please provide a valid token."
}
```

### Authorization Errors

```json
{
  "success": false,
  "error": "Insufficient permissions. Access denied."
}
```

---

## Rate Limiting

- **General API:** 100 requests per 15 minutes
- **Authentication endpoints:** 5 requests per 15 minutes

Rate limit headers are included in responses:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Time when limit resets

---

## User Roles

- **patient** - Can view own data
- **provider** - Can manage own patients
- **coordinator** - Can view all patients, manage interventions
- **admin** - Full access to all resources

---

## Examples

### Complete Authentication Flow

```bash
# 1. Register
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "SecurePass123!",
    "name": "Dr. Smith",
    "role": "provider"
  }'

# 2. Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "SecurePass123!"
  }'

# 3. Use token for protected endpoints
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3001/api/v1/patients \
  -H "Authorization: Bearer $TOKEN"
```

---

## Support

For issues or questions, please refer to the main README or create an issue in the repository.





