# CognitivePath Backend API

Complete backend implementation with authentication, database, security, and testing.

## 🚀 Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **PostgreSQL Database** - Robust data storage with migrations
- ✅ **Security Middleware** - Helmet, CORS, rate limiting
- ✅ **Input Validation** - Express-validator for request validation
- ✅ **Error Handling** - Centralized error handling
- ✅ **Logging** - Comprehensive logging system
- ✅ **Testing** - Jest test suite with coverage
- ✅ **API Documentation** - RESTful API endpoints

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🔧 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up PostgreSQL database:**
```bash
# Create database
createdb cognitivepath

# Or using psql:
psql -U postgres
CREATE DATABASE cognitivepath;
```

4. **Run migrations:**
```bash
npm run migrate
```

## 🏃 Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in `.env`)

## 📚 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/profile` - Get current user profile (Protected)
- `PUT /api/v1/auth/profile` - Update user profile (Protected)
- `PUT /api/v1/auth/change-password` - Change password (Protected)

### Patients

- `GET /api/v1/patients` - Get all patients (Protected)
- `GET /api/v1/patients/:id` - Get patient by ID (Protected)
- `POST /api/v1/patients` - Create new patient (Protected, Provider/Admin only)
- `PUT /api/v1/patients/:id` - Update patient (Protected)
- `DELETE /api/v1/patients/:id` - Delete patient (Protected, Admin only)

### Health Check

- `GET /api/v1/health` - API health check

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Example Request:
```bash
curl -X GET http://localhost:3001/api/v1/patients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 Example API Usage

### Register a User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "role": "patient"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Patient (as Provider)
```bash
curl -X POST http://localhost:3001/api/v1/patients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "age": 68,
    "email": "jane@example.com",
    "phone": "+1234567890"
  }'
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
│   ├── database.js   # Database connection
│   ├── logger.js     # Logging system
│   └── index.js      # Main config
├── controllers/       # Request handlers
│   ├── authController.js
│   └── patientController.js
├── middleware/       # Express middleware
│   ├── auth.js       # Authentication
│   ├── errorHandler.js
│   ├── security.js   # Security headers
│   └── validation.js # Input validation
├── migrations/       # Database migrations
│   ├── 001_initial_schema.sql
│   └── runMigrations.js
├── models/           # Data models
│   ├── User.js
│   ├── Patient.js
│   └── index.js
├── routes/           # API routes
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   └── index.js
├── tests/            # Test files
│   ├── auth.test.js
│   ├── patient.test.js
│   └── setup.js
├── logs/             # Log files (generated)
├── .env              # Environment variables (create from env.example)
├── .gitignore
├── jest.config.js
├── package.json
└── server.js         # Main entry point
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with configurable rounds
- **CORS Protection** - Configurable allowed origins
- **Rate Limiting** - Prevents brute force attacks
- **Helmet.js** - Security headers
- **Input Validation** - Prevents injection attacks
- **SQL Injection Protection** - Parameterized queries

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Hashed password
- `name` - User's full name
- `role` - User role (patient, provider, coordinator, admin)
- `is_active` - Account status
- `created_at`, `updated_at` - Timestamps

### Patients Table
- `id` - Primary key
- `name` - Patient name
- `age` - Patient age
- `email` - Contact email
- `phone` - Contact phone
- `provider_id` - Foreign key to users
- `cognitive_score` - Cognitive assessment score
- `risk_level` - Risk level (Low, Moderate, High)
- `status` - Patient status
- `created_at`, `updated_at` - Timestamps

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify database credentials in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process using port: `lsof -ti:3001 | xargs kill`

### Migration Errors
- Ensure database exists
- Check user has CREATE privileges
- Review migration SQL for syntax errors

## 📝 Environment Variables

See `env.example` for all available environment variables.

**Required for production:**
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `DB_PASSWORD`
- `SESSION_SECRET`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

ISC





