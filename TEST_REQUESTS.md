# API Testing Guide - Quick Reference

## Start the Server

```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Backend Server
cd server
npm run dev
```

Server runs on: `http://localhost:5001/api`

## Quick Tests

### 1. Sign Up a New User

**Request:**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "studio"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "65f...",
    "email": "test@example.com",
    "roles": ["studio"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Sign In

**Request:**
```bash
curl -X POST http://localhost:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Get Current User (Authenticated)

**Request:**
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Get My Profile

**Request:**
```bash
curl -X GET http://localhost:5001/api/profiles/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Create a Wall

**Request:**
```bash
curl -X POST http://localhost:5001/api/walls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Portfolio Wall",
    "description": "Showcasing my best work",
    "tagline": "Creating amazing VFX",
    "published": false
  }'
```

### 6. Get All Published Walls

**Request:**
```bash
curl http://localhost:5001/api/walls
```

### 7. Get Specific Wall

**Request:**
```bash
curl http://localhost:5001/api/walls/WALL_ID_HERE
```

### 8. Get My Walls (Authenticated)

**Request:**
```bash
curl http://localhost:5001/api/walls/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Update a Wall

**Request:**
```bash
curl -X PUT http://localhost:5001/api/walls/WALL_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Title",
    "published": true
  }'
```

### 10. Get Pending Verifications (Admin Only)

**Request:**
```bash
curl http://localhost:5001/api/profiles/pending \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 11. Verify Profile (Admin Only)

**Request:**
```bash
curl -X PUT http://localhost:5001/api/profiles/PROFILE_ID/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "verification_status": "approved",
    "rating": 4
  }'
```

### 12. Upload File

**Request:**
```bash
curl -X POST http://localhost:5001/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/image.jpg" \
  -F "folder=logos"
```

## Test Admin User

```bash
# Sign up as admin
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "admin"
  }'

# Use the token from response for admin operations
```

## Test Studio User

```bash
# Sign up as studio
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "studio@test.com",
    "password": "studio123",
    "name": "Studio User",
    "role": "studio"
  }'

# This user will have "pending" verification status
```

## Complete Test Flow

```bash
# 1. Sign up
RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test","role":"studio"}')

# 2. Extract token
TOKEN=$(echo $RESPONSE | jq -r '.token')

# 3. Get my profile
curl -X GET http://localhost:5001/api/profiles/me \
  -H "Authorization: Bearer $TOKEN"

# 4. Create a wall
curl -X POST http://localhost:5001/api/walls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Wall","description":"Testing"}'

# 5. Get my walls
curl http://localhost:5001/api/walls/my \
  -H "Authorization: Bearer $TOKEN"
```

## Using Postman

Import these URLs into Postman:

1. **Environment Variables:**
   - `base_url`: http://localhost:5001/api
   - `token`: (set this after login)

2. **Request Headers for authenticated endpoints:**
   ```
   Authorization: Bearer {{token}}
   ```

3. **Body Type:** raw JSON

## Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Base URL: `http://localhost:5001/api`
3. Set Bearer token in headers after login
4. Test all endpoints!

## Status Check

```bash
# Check if server is running
curl http://localhost:5001/api/auth/me

# Should return 401 Unauthorized (normal if not logged in)
```
