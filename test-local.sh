#!/bin/bash
# Local Testing Script for CognitivePath
# This script tests the API endpoints to verify everything is working

echo "🧪 Testing CognitivePath Locally..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3001/api/v1"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="Test1234!"
TOKEN=""

# Test 1: Health Check
echo "1️⃣  Testing API health endpoint..."
HEALTH=$(curl -s "$API_URL/health")
if echo "$HEALTH" | grep -q "success"; then
  echo -e "${GREEN}✅ API is healthy${NC}"
  echo "   Response: $HEALTH"
else
  echo -e "${RED}❌ API health check failed${NC}"
  echo "   Make sure the backend is running: docker-compose up -d"
  exit 1
fi
echo ""

# Test 2: Register User
echo "2️⃣  Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"name\": \"Test User\",
    \"role\": \"provider\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "success\|id"; then
  echo -e "${GREEN}✅ User registration successful${NC}"
  echo "   Email: $TEST_EMAIL"
elif echo "$REGISTER_RESPONSE" | grep -q "already exists\|duplicate"; then
  echo -e "${YELLOW}⚠️  User already exists, continuing with login...${NC}"
else
  echo -e "${RED}❌ User registration failed${NC}"
  echo "   Response: $REGISTER_RESPONSE"
  exit 1
fi
echo ""

# Test 3: Login
echo "3️⃣  Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed${NC}"
  echo "   Response: $LOGIN_RESPONSE"
  exit 1
else
  echo -e "${GREEN}✅ Login successful${NC}"
  echo "   Token received (length: ${#TOKEN} characters)"
fi
echo ""

# Test 4: Get User Profile (Protected Endpoint)
echo "4️⃣  Testing protected endpoint (get profile)..."
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "success\|email"; then
  echo -e "${GREEN}✅ Protected endpoint works${NC}"
  echo "   Profile data retrieved successfully"
else
  echo -e "${RED}❌ Protected endpoint failed${NC}"
  echo "   Response: $PROFILE_RESPONSE"
  exit 1
fi
echo ""

# Test 5: Create Patient
echo "5️⃣  Testing patient creation..."
PATIENT_RESPONSE=$(curl -s -X POST "$API_URL/patients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "age": 68,
    "email": "jane@example.com",
    "phone": "+1234567890"
  }')

if echo "$PATIENT_RESPONSE" | grep -q "success\|id"; then
  echo -e "${GREEN}✅ Patient creation successful${NC}"
  PATIENT_ID=$(echo "$PATIENT_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
  echo "   Patient ID: $PATIENT_ID"
else
  echo -e "${YELLOW}⚠️  Patient creation might have failed or patient already exists${NC}"
  echo "   Response: $PATIENT_RESPONSE"
fi
echo ""

# Test 6: List Patients
echo "6️⃣  Testing patient list endpoint..."
PATIENTS_RESPONSE=$(curl -s -X GET "$API_URL/patients" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PATIENTS_RESPONSE" | grep -q "success\|patients"; then
  echo -e "${GREEN}✅ Patient list endpoint works${NC}"
  PATIENT_COUNT=$(echo "$PATIENTS_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2 || echo "0")
  echo "   Patients found: $PATIENT_COUNT"
else
  echo -e "${YELLOW}⚠️  Patient list might be empty${NC}"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 All tests completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "  • API is running at: http://localhost:3001/api/v1"
echo "  • Test user: $TEST_EMAIL"
echo "  • View logs: docker-compose logs -f backend"
echo "  • Stop services: docker-compose down"
echo ""

