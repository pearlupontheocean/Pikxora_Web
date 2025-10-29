# Frontend API Connection Fixed

## Issue
- Frontend was trying to connect to wrong port (5000 instead of 5001)
- CORS needed to be configured properly

## Fix Applied

### 1. Updated API URL in `src/lib/axios.ts`
Changed from:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

To:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
```

### 2. Updated CORS in `server/src/index.js`
Changed from:
```javascript
app.use(cors());
```

To:
```javascript
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true
}));
```

### 3. Created `.env` file in root
```
VITE_API_URL=http://localhost:5001/api
```

## Now Try Again!

1. Make sure backend is running:
```bash
cd server
npm run dev
```

2. Make sure frontend is running:
```bash
npm run dev
```

3. Try to register again!

## Test the API Directly

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "name": "Test User",
    "role": "studio"
  }'
```

If this works, the frontend should work too now!
