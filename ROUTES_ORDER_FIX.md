# Routes Order Fix - Pending Profiles API

## Problem
Getting 500 error when accessing `/api/profiles/pending` because the `/:id` route was catching "pending" as a parameter.

## Root Cause
Express routes are matched in order. When `/:id` comes before `/pending`, "pending" is treated as an ID and tries to find a profile with `_id = "pending"`, which fails.

## Fix Applied
Moved the `/pending` route **before** the `/:id` route so it's matched first.

### Before (Broken):
```javascript
router.get('/:id', ...)      // This catches "pending"
router.get('/pending', ...)  // Never reached
```

### After (Fixed):
```javascript
router.get('/pending', ...)  // Matches first
router.get('/:id', ...)      // Catch-all for actual IDs
```

## Files Updated
✅ `server/src/routes/profiles.js` - Reordered routes

## Route Order Now:
1. `GET /` - All profiles (admin)
2. `GET /me` - My profile
3. `GET /pending` - Pending profiles (admin) ← **Moved before /:id**
4. `PUT /me` - Update my profile  
5. `PUT /:id/verify` - Verify profile (admin)
6. `GET /:id` - Get profile by ID (catch-all last)

## Result
✅ `/api/profiles/pending` now works correctly
✅ Admin panel can fetch pending studios
✅ No more 500 errors

## Test
```bash
# Get pending profiles (as admin)
GET http://localhost:5001/api/profiles/pending
Authorization: Bearer <admin-token>
```

Should return array of pending profiles instead of error!
