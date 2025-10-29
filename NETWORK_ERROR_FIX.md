# Network Error Fix - Frontend Connection

## Problem
Frontend was getting network errors when trying to sign up, but Postman works fine.

## Root Causes Fixed

### 1. Wrong Port Configuration
- Frontend was trying to connect to port 5000
- Backend is running on port 5001
- ✅ Fixed: Updated `src/lib/axios.ts` to use port 5001

### 2. Missing .env File
- No `.env` file in root directory
- ✅ Fixed: Created `.env` with `VITE_API_URL=http://localhost:5001/api`

### 3. CORS Configuration
- Default CORS might block requests
- ✅ Fixed: Updated `server/src/index.js` CORS settings

## What Was Changed

### `src/lib/axios.ts`
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
```

### `server/src/index.js`
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

### `.env` (Root Directory)
```
VITE_API_URL=http://localhost:5001/api
```

## Test Now!

1. **Restart the frontend:**
```bash
# Stop current frontend (Ctrl+C)
npm run dev
```

2. **Try to sign up again**

3. **Should work now!** ✅

## Quick Test

### Test Backend API:
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "pass123",
    "name": "Test",
    "role": "studio"
  }'
```

If this returns a token, the backend works!
If frontend still fails, check browser console for errors.

## Troubleshooting

### Still Getting Network Error?

1. **Check if both servers are running:**
   - Backend: Port 5001 (check with `lsof -i :5001`)
   - Frontend: Usually port 8080

2. **Open browser console:**
   - Look for the actual error message
   - Check Network tab to see the request URL

3. **Common Issues:**
   - Backend not running: `cd server && npm run dev`
   - MongoDB not running: `mongod`
   - CORS error: Backend CORS already fixed

4. **Check the request URL in browser:**
   - Should be: `http://localhost:5001/api/auth/signup`
   - If it's `http://localhost:5000/...` then restart frontend

## Status

✅ Port configuration fixed
✅ CORS fixed  
✅ .env file created
✅ API working (confirmed with curl)
✅ Frontend should work now!

## Next Steps

1. Restart frontend: `npm run dev`
2. Try signing up in browser
3. Check console for any errors
4. If still issues, share console error messages
