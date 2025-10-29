# Axios + React Query Implementation

## ✅ Complete!

Auth.tsx has been updated to use:
- ✅ Axios instance for API calls
- ✅ React Query hooks (useQuery, useMutation)
- ✅ TanStack Query for data management
- ✅ No Supabase dependencies

## What Was Created

### 1. Axios Instance (`src/lib/axios.ts`)
- Axios instance with base URL configuration
- Request interceptor to add auth tokens
- Response interceptor to handle 401 errors
- Automatic token management

### 2. React Query Hooks (`src/lib/api-hooks.ts`)
Custom hooks for all API operations:
- `useCurrentUser()` - Get current user
- `useSignUp()` - Sign up mutation
- `useSignIn()` - Sign in mutation
- `useSignOut()` - Sign out mutation
- `useMyProfile()` - Get my profile
- `useUpdateProfile()` - Update profile
- `useWalls()` - Get all walls
- `useMyWalls()` - Get my walls
- `useWall(id)` - Get specific wall
- `useCreateWall()` - Create wall mutation
- `useUpdateWall()` - Update wall mutation
- `usePendingProfiles()` - Admin: get pending profiles
- `useVerifyProfile()` - Admin: verify profile

## Usage in Auth.tsx

```typescript
// Using React Query hooks
const { data: currentUser } = useCurrentUser();
const signUpMutation = useSignUp();
const signInMutation = useSignIn();

// Loading state from mutation
const loading = signUpMutation.isPending || signInMutation.isPending;

// Handle signup
const result = await signUpMutation.mutateAsync({
  email, password, name, role
});

// Handle signin
const result = await signInMutation.mutateAsync({
  email, password
});
```

## Benefits

✅ **No Supabase** - Complete removal  
✅ **Axios** - Industry standard HTTP client  
✅ **React Query** - Automatic caching, loading states, error handling  
✅ **Type Safety** - Full TypeScript support  
✅ **Optimistic Updates** - Better UX  
✅ **Automatic Refetching** - Fresh data  
✅ **Request Deduplication** - Prevents duplicate requests

## Next Steps

Update other pages to use the new hooks:

1. **Dashboard.tsx** - Use `useMyWalls()`, `useMyProfile()`
2. **Browse.tsx** - Use `useWalls()`
3. **WallView.tsx** - Use `useWall(id)`
4. **AdminVerifications.tsx** - Use `usePendingProfiles()`, `useVerifyProfile()`

## Files Updated

- ✅ `src/pages/Auth.tsx` - Now uses React Query hooks
- ✅ `src/lib/axios.ts` - Axios instance created
- ✅ `src/lib/api-hooks.ts` - Custom hooks created
- ✅ `package.json` - axios installed

## Run the App

```bash
# Frontend
npm run dev

# Backend (in server/)
cd server
npm run dev
```

Everything should work perfectly now! 🎉
