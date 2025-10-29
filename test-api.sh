#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing Pixora Connect API${NC}\n"

BASE_URL="http://localhost:5001/api"

# Test 1: Sign Up
echo -e "${GREEN}Test 1: Sign Up${NC}"
echo "POST $BASE_URL/auth/signup"
echo "Body: {\"email\":\"test@test.com\",\"password\":\"test123\",\"name\":\"Test User\",\"role\":\"studio\"}"
echo ""
curl -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "name": "Test User",
    "role": "studio"
  }' | jq .

echo -e "\n${BLUE}Save the token from the response above!${NC}\n"

# Test 2: Sign In (if you have an existing user)
echo -e "${GREEN}Test 2: Sign In${NC}"
echo "POST $BASE_URL/auth/signin"
echo "Body: {\"email\":\"test@test.com\",\"password\":\"test123\"}"
echo ""
curl -X POST $BASE_URL/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }' | jq .

echo -e "\n${BLUE}Usage:${NC}"
echo "1. Start MongoDB: mongod"
echo "2. Start server: cd server && npm run dev"
echo "3. Run this script: ./test-api.sh"
