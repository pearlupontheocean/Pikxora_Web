# Quick API Test

## Test These APIs Now!

### 1. Sign Up (POST)
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "pass123",
    "name": "Test User",
    "role": "studio"
  }'
```

### 2. Sign In (POST)
```bash
curl -X POST http://localhost:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "pass123"
  }'
```

**Save the token!**

### 3. Get Current User (GET)
```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer TOKEN_HERE"
```

### 4. Create Wall (POST)
```bash
curl -X POST http://localhost:5001/api/walls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{
    "title": "My Wall",
    "description": "Test wall",
    "published": true
  }'
```

### 5. Get All Walls (GET)
```bash
curl http://localhost:5001/api/walls
```

## Setup First:

1. Start MongoDB: `mongod`
2. Start Server: `cd server && npm run dev`
3. Test APIs with curl commands above

See `TEST_REQUESTS.md` for complete examples!
