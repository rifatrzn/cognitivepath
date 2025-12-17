# CognitivePath Frontend

React Native mobile application for CognitivePath with full authentication integration.

## 🚀 Features

- ✅ **JWT Authentication** - Secure login and registration
- ✅ **Patient Management** - View and manage patients
- ✅ **Role-Based Access** - Different views for different user roles
- ✅ **Token Persistence** - Automatic token storage and refresh
- ✅ **Navigation** - React Navigation with stack navigator
- ✅ **API Integration** - Complete backend API integration

## 📋 Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator
- Backend API running (see backend README)

## 🔧 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure API URL:**

Create `.env` file:
```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Or update `src/config/api.js` directly.

3. **Start the app:**
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── api.js           # API client configuration
│   ├── contexts/
│   │   └── AuthContext.js   # Authentication context
│   ├── services/
│   │   ├── authService.js   # Authentication API calls
│   │   └── patientService.js # Patient API calls
│   └── screens/
│       ├── LoginScreen.js
│       ├── RegisterScreen.js
│       ├── HomeScreen.js
│       ├── PatientListScreen.js
│       ├── PatientDetailScreen.js
│       └── ProfileScreen.js
├── App.js                   # Main app component
├── app.json                 # Expo configuration
└── package.json
```

## 🔐 Authentication Flow

1. **Login/Register** - User authenticates with backend
2. **Token Storage** - JWT token stored in AsyncStorage
3. **Auto-Refresh** - Token automatically refreshed when expired
4. **Protected Routes** - Navigation based on auth state

## 📱 Screens

### Login Screen
- Email and password input
- Link to registration
- Error handling

### Register Screen
- User registration form
- Password validation
- Role selection

### Home Screen
- Welcome message
- Navigation to main features
- Logout option

### Patient List Screen
- List of all patients
- Pull to refresh
- Navigation to patient details

### Patient Detail Screen
- Complete patient information
- Cognitive scores
- Risk levels

### Profile Screen
- User information
- Logout option

## 🔌 API Integration

All API calls go through the centralized `apiClient`:

```javascript
import apiClient from './src/config/api';

// GET request
const data = await apiClient.get('/patients');

// POST request
const result = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});
```

## 🧪 Testing

```bash
npm test
```

## 📦 Building

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## 🔧 Configuration

### API URL

Update in `.env`:
```env
EXPO_PUBLIC_API_URL=https://your-api.com/api/v1
```

### Navigation

Navigation is handled by React Navigation. Routes are defined in `App.js`.

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache
expo start -c
```

### Token Not Persisting
- Check AsyncStorage is installed: `npm install @react-native-async-storage/async-storage`
- Verify token is being saved in `authService.js`

### API Connection Errors
- Verify backend is running
- Check API URL in `.env`
- Ensure CORS is configured correctly in backend

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)




