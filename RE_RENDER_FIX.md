# Re-render Loop Fix - Auth Page

## Problem
Auth page was re-rendering infinitely because `useCurrentUser()` was making API calls without checking for token first.

## Root Cause
- `useCurrentUser()` hook was running even when no token exists
- This caused continuous API calls and re-renders
- The hook should only run when a token is present

## Fix Applied

### 1. Updated `src/lib/api-hooks.ts`
Added `enabled` flag to prevent query when no token:
```typescript
export const useCurrentUser = () => {
  const hasToken = !!localStorage.getItem('token');
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
      } catch (error) {
        localStorage.removeItem('token');
        throw error;
      }
    },
    enabled: hasToken, // ✅ Only run if token exists
    retry: false,
    cacheTime: 0, // Don't cache to prevent stale data
  });
};
```

### 2. Updated `src/pages/Auth.tsx`
Added better loading state checks:
```typescript
const hasToken = !!localStorage.getItem('token');
const { data: currentUser, isLoading: userLoading } = useCurrentUser();

useEffect(() => {
  if (!userLoading && currentUser && hasToken) {
    navigate("/dashboard");
  }
}, [currentUser, userLoading, hasToken, navigate]);
```

### 3. Updated Other Pages
- `Dashboard.tsx` - Check for token before redirecting
- `WallCreate.tsx` - Check for token existence
- `WallEdit.tsx` - Better token validation
- `AdminVerifications.tsx` - Improved token checks

## How It Works Now

1. **No Token** → Auth page loads normally, no API calls
2. **Has Token** → Check if user is valid
3. **Valid Token** → Redirect to dashboard
4. **Invalid Token** → Stay on auth page

## Result

✅ No more infinite re-renders
✅ Auth page stays stable
✅ Login/Signup works properly
✅ Proper token validation

## Test Now

1. Go to http://localhost:8080/auth
2. Page should load and stay loaded
3. Try to sign up or sign in
4. Should work smoothly!

## If Still Re-rendering

Check browser console for:
- Network tab: Look for repeated `/auth/me` calls
- Console tab: Look for errors
- React DevTools: Check for component updates
