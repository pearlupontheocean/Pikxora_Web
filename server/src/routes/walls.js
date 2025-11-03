import express from 'express';
import Wall from '../models/Wall.js';
import Project from '../models/Project.js';
import TeamMember from '../models/TeamMember.js';
import Profile from '../models/Profile.js';
import { protect } from '../middleware/auth.js';
import { 
  isBase64Image, 
  isBase64Video,
  isEmbedUrl,
  convertFilePathToBase64, 
  validateBase64ImageSize 
} from '../utils/imageUtils.js';

const router = express.Router();

// IMPORTANT: Define specific routes before parameterized routes

// @route   GET /api/walls/my
// @desc    Get current user's walls
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const walls = await Wall.find({ user_id: profile._id.toString() })
      .populate('user_id', 'name email rating location associations')
      .sort({ createdAt: -1 });
    
    // Convert file paths to base64 for frontend
    const wallsWithBase64 = await Promise.all(
      walls.map(async (wall) => {
        const wallObj = wall.toObject();
        
        // Convert logo_url if it's a file path
        if (wallObj.logo_url && wallObj.logo_url.startsWith('/uploads/') && !isBase64Image(wallObj.logo_url)) {
          try {
            wallObj.logo_url = await convertFilePathToBase64(wallObj.logo_url);
          } catch (error) {
            console.error('Error converting logo to base64:', error);
            // Keep original path if conversion fails
          }
        }
        
        // Convert hero_media_url if it's a file path
        if (wallObj.hero_media_url && wallObj.hero_media_url.startsWith('/uploads/') && !isBase64Image(wallObj.hero_media_url)) {
          try {
            wallObj.hero_media_url = await convertFilePathToBase64(wallObj.hero_media_url);
          } catch (error) {
            console.error('Error converting hero media to base64:', error);
            // Keep original path if conversion fails
          }
        }
        
        return wallObj;
      })
    );
    
    res.json(wallsWithBase64);
  } catch (error) {
    console.error('Get my walls error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/walls/:id/view
// @desc    Increment wall view count
// @access  Public
router.put('/:id/view', async (req, res) => {
  try {
    const wall = await Wall.findById(req.params.id);
    
    if (!wall) {
      return res.status(404).json({ error: 'Wall not found' });
    }
    
    wall.view_count += 1;
    await wall.save();
    
    res.json({ view_count: wall.view_count });
  } catch (error) {
    console.error('Increment view error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/walls
// @desc    Get all published walls
// @access  Public
router.get('/', async (req, res) => {
  try {
    const walls = await Wall.find({ published: true })
      .populate('user_id', 'name email rating location associations')
      .sort({ createdAt: -1 });
    
    // Convert file paths to base64 for frontend
    const wallsWithBase64 = await Promise.all(
      walls.map(async (wall) => {
        const wallObj = wall.toObject();
        
        // Convert logo_url if it's a file path
        if (wallObj.logo_url && wallObj.logo_url.startsWith('/uploads/') && !isBase64Image(wallObj.logo_url)) {
          try {
            wallObj.logo_url = await convertFilePathToBase64(wallObj.logo_url);
          } catch (error) {
            console.error('Error converting logo to base64:', error);
            // Keep original path if conversion fails
          }
        }
        
        // Convert hero_media_url if it's a file path
        if (wallObj.hero_media_url && wallObj.hero_media_url.startsWith('/uploads/') && !isBase64Image(wallObj.hero_media_url)) {
          try {
            wallObj.hero_media_url = await convertFilePathToBase64(wallObj.hero_media_url);
          } catch (error) {
            console.error('Error converting hero media to base64:', error);
            // Keep original path if conversion fails
          }
        }
        
        return wallObj;
      })
    );
    
    res.json(wallsWithBase64);
  } catch (error) {
    console.error('Get walls error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/walls/:id
// @desc    Get wall by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const wall = await Wall.findById(req.params.id)
      .populate('user_id', 'name email rating location associations');
    
    if (!wall) {
      return res.status(404).json({ error: 'Wall not found' });
    }
    
    const wallObj = wall.toObject();
    
    // Convert file paths to base64 for frontend
    if (wallObj.logo_url && wallObj.logo_url.startsWith('/uploads/') && !isBase64Image(wallObj.logo_url)) {
      try {
        wallObj.logo_url = await convertFilePathToBase64(wallObj.logo_url);
      } catch (error) {
        console.error('Error converting logo to base64:', error);
        // Keep original path if conversion fails
      }
    }
    
    if (wallObj.hero_media_url && wallObj.hero_media_url.startsWith('/uploads/') && !isBase64Image(wallObj.hero_media_url)) {
      try {
        wallObj.hero_media_url = await convertFilePathToBase64(wallObj.hero_media_url);
      } catch (error) {
        console.error('Error converting hero media to base64:', error);
        // Keep original path if conversion fails
      }
    }
    
    // Convert showreel file path to base64 if it's an upload type
    if (wallObj.showreel_url && wallObj.showreel_type === 'upload' && 
        wallObj.showreel_url.startsWith('/uploads/') && !isBase64Video(wallObj.showreel_url)) {
      try {
        wallObj.showreel_url = await convertFilePathToBase64(wallObj.showreel_url);
      } catch (error) {
        console.error('Error converting showreel to base64:', error);
        // Keep original path if conversion fails
      }
    }
    
    res.json(wallObj);
  } catch (error) {
    console.error('Get wall error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/walls
// @desc    Create a new wall
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    console.log('Creating wall with data:', req.body);
    console.log('Profile _id:', profile._id);
    
    // Prepare wall data
    const wallData = { ...req.body };
    
    // Handle logo_url: store base64 directly, convert file paths to base64
    if (wallData.logo_url) {
      if (isBase64Image(wallData.logo_url)) {
        // Base64 data received - validate size before storing
        const validation = validateBase64ImageSize(wallData.logo_url, 50);
        if (!validation.valid) {
          return res.status(400).json({ error: `Logo image: ${validation.error}` });
        }
        console.log(`Logo image: base64 data received (${validation.sizeMB?.toFixed(2)}MB), storing directly`);
      } else if (wallData.logo_url.startsWith('/uploads/')) {
        // File path received - convert to base64 before storing
        console.log('Logo image: file path received, converting to base64');
        try {
          wallData.logo_url = await convertFilePathToBase64(wallData.logo_url);
          console.log('Logo image: successfully converted to base64');
        } catch (error) {
          console.error('Error converting logo file to base64:', error);
          return res.status(400).json({ error: 'Failed to convert logo image: ' + error.message });
        }
      }
      // If it's neither base64 nor file path, keep it as-is (could be URL)
    }
    
    // Handle hero_media_url: store base64 directly, convert file paths to base64
    if (wallData.hero_media_url) {
      if (isBase64Image(wallData.hero_media_url)) {
        // Base64 data received - validate size before storing
        const validation = validateBase64ImageSize(wallData.hero_media_url, 50);
        if (!validation.valid) {
          return res.status(400).json({ error: `Hero image: ${validation.error}` });
        }
        console.log(`Hero image: base64 data received (${validation.sizeMB?.toFixed(2)}MB), storing directly`);
        // Set hero_media_type to 'image' if not specified
        if (!wallData.hero_media_type) {
          wallData.hero_media_type = 'image';
        }
      } else if (wallData.hero_media_url.startsWith('/uploads/')) {
        // File path received - convert to base64 before storing
        console.log('Hero image: file path received, converting to base64');
        try {
          wallData.hero_media_url = await convertFilePathToBase64(wallData.hero_media_url);
          console.log('Hero image: successfully converted to base64');
          // Set hero_media_type to 'image' if not specified
          if (!wallData.hero_media_type) {
            wallData.hero_media_type = 'image';
          }
        } catch (error) {
          console.error('Error converting hero file to base64:', error);
          return res.status(400).json({ error: 'Failed to convert hero image: ' + error.message });
        }
      } else {
        // If it's not base64 or file path, set hero_media_type to 'image' if not specified
        if (!wallData.hero_media_type && wallData.hero_media_url) {
          wallData.hero_media_type = 'image';
        }
      }
    }
    
    // Handle showreel_url: convert file paths to base64, keep embed URLs as-is
    if (wallData.showreel_url && wallData.showreel_type === 'upload') {
      if (isBase64Video(wallData.showreel_url)) {
        // Base64 video data received - store directly
        console.log('Showreel video: base64 data received, storing directly');
      } else if (wallData.showreel_url.startsWith('/uploads/')) {
        // File path received - convert to base64 before storing
        console.log('Showreel video: file path received, converting to base64');
        try {
          wallData.showreel_url = await convertFilePathToBase64(wallData.showreel_url);
          console.log('Showreel video: successfully converted to base64');
        } catch (error) {
          console.error('Error converting showreel file to base64:', error);
          return res.status(400).json({ error: 'Failed to convert showreel video: ' + error.message });
        }
      }
    } else if (wallData.showreel_url && wallData.showreel_type === 'embed') {
      // Embed URL - keep as-is (YouTube, Vimeo, etc.)
      console.log('Showreel: embed URL received, storing as-is');
    }
    
    console.log('Final wallData before saving:', {
      logo_url: wallData.logo_url ? (wallData.logo_url.substring(0, 50) + '...') : 'empty',
      hero_media_url: wallData.hero_media_url ? (wallData.hero_media_url.substring(0, 50) + '...') : 'empty',
      showreel_url: wallData.showreel_url ? (wallData.showreel_url.substring(0, 50) + '...') : 'empty',
      showreel_type: wallData.showreel_type || 'empty'
    });
    
    const wall = new Wall({
      ...wallData,
      user_id: profile._id
    });
    
    await wall.save();
    
    // Populate user_id before sending response
    const populatedWall = await Wall.findById(wall._id)
      .populate('user_id', 'name email rating location associations');
    
    // Images should already be base64 at this point, but convert any remaining file paths as safety net
    const wallObj = populatedWall.toObject();
    
    if (wallObj.logo_url && wallObj.logo_url.startsWith('/uploads/') && !isBase64Image(wallObj.logo_url)) {
      try {
        wallObj.logo_url = await convertFilePathToBase64(wallObj.logo_url);
        console.log('Logo: converted remaining file path to base64 in response');
      } catch (error) {
        console.error('Error converting logo to base64:', error);
      }
    }
    
    if (wallObj.hero_media_url && wallObj.hero_media_url.startsWith('/uploads/') && !isBase64Image(wallObj.hero_media_url)) {
      try {
        wallObj.hero_media_url = await convertFilePathToBase64(wallObj.hero_media_url);
        console.log('Hero: converted remaining file path to base64 in response');
      } catch (error) {
        console.error('Error converting hero media to base64:', error);
      }
    }
    
    // Convert showreel file path to base64 if it's an upload type
    if (wallObj.showreel_url && wallObj.showreel_type === 'upload' && 
        wallObj.showreel_url.startsWith('/uploads/') && !isBase64Video(wallObj.showreel_url)) {
      try {
        wallObj.showreel_url = await convertFilePathToBase64(wallObj.showreel_url);
        console.log('Showreel: converted remaining file path to base64 in response');
      } catch (error) {
        console.error('Error converting showreel to base64:', error);
      }
    }
    
    res.status(201).json(wallObj);
  } catch (error) {
    console.error('Create wall error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/walls/:id
// @desc    Update a wall
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const wall = await Wall.findById(req.params.id);
    if (!wall) {
      return res.status(404).json({ error: 'Wall not found' });
    }
    
    // Check if user owns the wall
    if (wall.user_id.toString() !== profile._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Prepare update data
    const updateData = { ...req.body };
    
    // If base64 images are provided, store them directly (don't convert to files)
    // If logo_url is base64, keep it as base64
    if (updateData.logo_url && isBase64Image(updateData.logo_url)) {
      // Base64 data received - validate size before storing
      const validation = validateBase64ImageSize(updateData.logo_url, 50);
      if (!validation.valid) {
        return res.status(400).json({ error: `Logo image: ${validation.error}` });
      }
      console.log(`Logo image: base64 data received (${validation.sizeMB?.toFixed(2)}MB), storing directly`);
    } else if (updateData.logo_url && updateData.logo_url.startsWith('/uploads/')) {
      // If it's a file path, convert it to base64 for frontend
      try {
        updateData.logo_url = await convertFilePathToBase64(updateData.logo_url);
        console.log('Logo image: converted file path to base64');
      } catch (error) {
        console.error('Error converting logo file to base64:', error);
        // Continue with file path if conversion fails
      }
    }
    
    // If hero_media_url is base64, keep it as base64
    if (updateData.hero_media_url && isBase64Image(updateData.hero_media_url)) {
      // Base64 data received - validate size before storing
      const validation = validateBase64ImageSize(updateData.hero_media_url, 50);
      if (!validation.valid) {
        return res.status(400).json({ error: `Hero image: ${validation.error}` });
      }
      console.log(`Hero image: base64 data received (${validation.sizeMB?.toFixed(2)}MB), storing directly`);
      // Set hero_media_type to 'image' if not specified
      if (!updateData.hero_media_type) {
        updateData.hero_media_type = 'image';
      }
    } else if (updateData.hero_media_url && updateData.hero_media_url.startsWith('/uploads/')) {
      // If it's a file path, convert it to base64 for frontend
      try {
        updateData.hero_media_url = await convertFilePathToBase64(updateData.hero_media_url);
        console.log('Hero image: converted file path to base64');
      } catch (error) {
        console.error('Error converting hero file to base64:', error);
        // Continue with file path if conversion fails
      }
    }
    
    // Handle showreel_url: convert file paths to base64, keep embed URLs as-is
    if (updateData.showreel_url && updateData.showreel_type === 'upload') {
      if (isBase64Video(updateData.showreel_url)) {
        // Base64 video data received - store directly
        console.log('Showreel video: base64 data received, storing directly');
      } else if (updateData.showreel_url.startsWith('/uploads/')) {
        // File path received - convert to base64 before storing
        console.log('Showreel video: file path received, converting to base64');
        try {
          updateData.showreel_url = await convertFilePathToBase64(updateData.showreel_url);
          console.log('Showreel video: successfully converted to base64');
        } catch (error) {
          console.error('Error converting showreel file to base64:', error);
          return res.status(400).json({ error: 'Failed to convert showreel video: ' + error.message });
        }
      }
    } else if (updateData.showreel_url && updateData.showreel_type === 'embed') {
      // Embed URL - keep as-is (YouTube, Vimeo, etc.)
      console.log('Showreel: embed URL received, storing as-is');
    }
    
    Object.assign(wall, updateData);
    await wall.save();
    
    // Populate before returning
    const populatedWall = await Wall.findById(wall._id)
      .populate('user_id', 'name email rating location associations');
    
    const wallObj = populatedWall.toObject();
    
    // Convert any remaining file paths to base64 for frontend
    if (wallObj.logo_url && wallObj.logo_url.startsWith('/uploads/') && !isBase64Image(wallObj.logo_url)) {
      try {
        wallObj.logo_url = await convertFilePathToBase64(wallObj.logo_url);
      } catch (error) {
        console.error('Error converting logo to base64:', error);
      }
    }
    
    if (wallObj.hero_media_url && wallObj.hero_media_url.startsWith('/uploads/') && !isBase64Image(wallObj.hero_media_url)) {
      try {
        wallObj.hero_media_url = await convertFilePathToBase64(wallObj.hero_media_url);
      } catch (error) {
        console.error('Error converting hero media to base64:', error);
      }
    }
    
    // Convert showreel file path to base64 if it's an upload type
    if (wallObj.showreel_url && wallObj.showreel_type === 'upload' && 
        wallObj.showreel_url.startsWith('/uploads/') && !isBase64Video(wallObj.showreel_url)) {
      try {
        wallObj.showreel_url = await convertFilePathToBase64(wallObj.showreel_url);
      } catch (error) {
        console.error('Error converting showreel to base64:', error);
      }
    }
    
    res.json(wallObj);
  } catch (error) {
    console.error('Update wall error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/walls/:id
// @desc    Delete a wall
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const wall = await Wall.findById(req.params.id);
    if (!wall) {
      return res.status(404).json({ error: 'Wall not found' });
    }
    
    // Check if user owns the wall
    if (wall.user_id.toString() !== profile._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await Wall.findByIdAndDelete(req.params.id);
    res.json({ message: 'Wall deleted' });
  } catch (error) {
    console.error('Delete wall error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/walls/:id/projects
// @desc    Get projects for a wall
// @access  Public
router.get('/:id/projects', async (req, res) => {
  try {
    const projects = await Project.find({ wall_id: req.params.id })
      .sort({ order_index: 1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
