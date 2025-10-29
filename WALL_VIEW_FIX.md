# Wall View Fix - Infinite Loading

## Problem
After creating a wall, clicking on it from the dashboard shows infinite loading.

## Root Cause
The code was using `wall.id` but MongoDB uses `wall._id` as the ID field.

## Fix Applied

### 1. Updated Dashboard Navigation
Changed from:
```typescript
key={wall.id}
onClick={() => navigate(`/wall/${wall.id}`)}
```

To:
```typescript
key={wall._id}
onClick={() => navigate(`/wall/${wall._id}`)}
```

### 2. Updated Browse Navigation
Changed from:
```typescript
onClick={() => navigate(`/wall/${wall.id}`)}
```

To:
```typescript
onClick={() => navigate(`/wall/${wall._id}`)}
```

### 3. Updated useWall Hook
Added error handling and debugging:
```typescript
export const useWall = (id: string) => {
  return useQuery({
    queryKey: ['wall', id],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/walls/${id}`);
        // Increment view count
        try {
          await axiosInstance.put(`/walls/${id}/view`);
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
        return response.data;
      } catch (error: any) {
        console.error('Error fetching wall:', error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1,
  });
};
```

### 4. Updated isOwner Check
Fixed owner check in WallView:
```typescript
const isOwner = user && wallOwner && (user.id === wallOwner._id || user.id === wallOwner.user_id);
```

## Files Updated
✅ `src/pages/Dashboard.tsx` - Use `_id` instead of `id`
✅ `src/pages/Browse.tsx` - Use `_id` instead of `id`  
✅ `src/lib/api-hooks.ts` - Added error handling
✅ `src/pages/WallView.tsx` - Fixed isOwner check

## Test
1. Create a wall
2. Click on it from dashboard
3. Should load the wall details page ✅

## Why It Happened
- Frontend expected `wall.id`
- Backend returns `wall._id` (MongoDB convention)
- Mismatch caused undefined ID
- Page tried to load `/wall/undefined`
- Caused infinite loading

Now fixed!
