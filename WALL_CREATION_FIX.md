# Wall Creation Fix

## Problem
Wall creation is failing - need to debug and fix the create wall endpoint.

## Issues Found

1. **Route Order** - PUT /:id/view needs to be before GET /:id
2. **Population** - Walls should populate user_id data
3. **Data Structure** - Need to ensure correct data format

## Fixes Applied

### 1. Wall Routes Order
✅ GET /my - Get my walls (specific first)
✅ PUT /:id/view - Increment views (before /:id)
✅ GET / - Get all published walls
✅ GET /:id - Get wall by ID (catch-all)
✅ POST / - Create wall
✅ PUT /:id - Update wall
✅ DELETE /:id - Delete wall

### 2. Create Wall Endpoint
```javascript
router.post('/', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const wall = new Wall({
      ...req.body,
      user_id: profile._id  // Use profile._id
    });
    
    await wall.save();
    
    // Populate before returning
    const populatedWall = await Wall.findById(wall._id)
      .populate('user_id', 'name email rating location associations');
    
    res.status(201).json(populatedWall);
  } catch (error) {
    console.error('Create wall error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Get My Walls
Added populate to get full user data:
```javascript
const walls = await Wall.find({ user_id: profile._id.toString() })
  .populate('user_id', 'name email rating location associations')
  .sort({ createdAt: -1 });
```

### 4. Update Wall
Added populate to return full data:
```javascript
const populatedWall = await Wall.findById(wall._id)
  .populate('user_id', 'name email rating location associations');
```

## Test

Create wall test:
```bash
curl -X POST http://localhost:5001/api/walls \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Wall",
    "description": "Test wall",
    "published": true
  }'
```

Should return created wall with populated user data!

## Files Updated
✅ `server/src/routes/walls.js` - Added populate, console logs
