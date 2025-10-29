# 🚀 START HERE - API Testing Guide

## Quick Start

### 1. Start the Backend

```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Server
cd server
npm install  # If not done
npm run dev
```

Server runs on: **http://localhost:5001**

---

## Test APIs Right Now!

### Test 1: Sign Up

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@test.com",
    "password": "pass123",
    "name": "Test User",
    "role": "studio"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "email": "user1@test.com",
    "roles": ["studio"]
  },
  "token": "eyJhbGc..."
}
```

**Save the token for next requests!**

---

### Test 2: Sign In

```bash
curl -X POST http://localhost:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@test.com",
    "password": "pass123"
  }'
```

---

### Test 3: Get Current User (Authenticated)

```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the token from signup/signin response.

---

### Test 4: Create a Wall

```bash
curl -X POST http://localhost:5001/api/walls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Wall",
    "description": "This is my portfolio",
    "tagline": "Creating Amazing VFX",
    "published": false
  }'
```

---

### Test 5: Get All Walls (Public)

```bash
curl http://localhost:5001/api/walls
```

---

### Test 6: Get My Walls

```bash
curl http://localhost:5001/api/walls/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Test Admin Operations

First, create an admin user:

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "admin"
  }'
```

Then test admin endpoints:

```bash
# Get pending profiles
curl http://localhost:5001/api/profiles/pending \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Verify a profile
curl -X PUT http://localhost:5001/api/profiles/PROFILE_ID/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "verification_status": "approved",
    "rating": 5
  }'
```

---

## Using Postman

1. **Base URL:** `http://localhost:5001/api`

2. **For authenticated requests:**
   - Add header: `Authorization: Bearer YOUR_TOKEN`

3. **Request body:** raw JSON

4. **Test these endpoints:**
   - POST `/auth/signup`
   - POST `/auth/signin`
   - GET `/auth/me`
   - POST `/walls`
   - GET `/walls`
   - GET `/walls/my`

---

## Test Upload

```bash
curl -X POST http://localhost:5001/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "folder=logos"
```

---

## Quick Test Commands

Copy and paste these in your terminal:

```bash
# Sign up
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"demo123","name":"Demo User","role":"studio"}'

# Sign in
curl -X POST http://localhost:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"demo123"}'

# Get all walls
curl http://localhost:5001/api/walls
```

---

## Troubleshooting

**Server not responding?**
- Check if MongoDB is running: `mongod`
- Check if server is running: `npm run dev` in `server/` directory
- Check port: Should be 5001 (see server/.env)

**401 Unauthorized?**
- Make sure you're using a valid token
- Token format: `Authorization: Bearer eyJhbGc...`

**500 Error?**
- Check server logs
- Verify MongoDB connection
- Check `.env` file in `server/` directory

---

## Documentation

See:
- `API_TEST_EXAMPLES.md` - Detailed examples
- `TEST_REQUESTS.md` - All endpoints
- `QUICK_TEST.md` - Quick reference
- `START_HERE.md` - This file
