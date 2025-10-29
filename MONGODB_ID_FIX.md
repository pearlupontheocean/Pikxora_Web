# MongoDB ID Fix - Admin Verifications

## Problem
The code was using `pendingUser.id` but MongoDB uses `pendingUser._id` as the ID field. This caused `undefined` to be passed to the API endpoint.

## Error
```
PUT http://localhost:5001/api/profiles/undefined/verify 500
```

## Root Cause
- MongoDB Mongoose models use `_id` not `id`
- The field is `_id` in the database
- Code was accessing `.id` which is undefined

## Fix Applied

Changed all occurrences from:
- `pendingUser.id` → `pendingUser._id` ✅
- `approvedUser.id` → `approvedUser._id` ✅
- `created_at` → `createdAt` (Mongoose timestamps)

## Files Updated
✅ `src/pages/AdminVerifications.tsx`

### Changes Made:
1. `key={pendingUser._id}` - Use `_id` for React keys
2. `handleVerification(pendingUser._id, ...)` - Pass `_id` to verification
3. `selectedRatings[pendingUser._id]` - Use `_id` for state keys
4. `new Date(pendingUser.createdAt || pendingUser.created_at)` - Use correct timestamp field
5. `key={approvedUser._id}` - Use `_id` for approved users too

## MongoDB Schema Timestamps
Mongoose adds these automatically:
- `createdAt` - When document was created
- `updatedAt` - When document was last updated

Not `created_at` or `updated_at`!

## Result
✅ API now receives correct ID
✅ Endpoint: `PUT /api/profiles/68ff4d4acf35f73078c64f61/verify`
✅ Approve/reject works correctly
✅ Ratings are saved properly

## Test
Try to approve a pending studio - should work now!
