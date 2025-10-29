import express from 'express';
import Wall from '../models/Wall.js';
import Project from '../models/Project.js';
import TeamMember from '../models/TeamMember.js';
import Profile from '../models/Profile.js';
import { protect } from '../middleware/auth.js';

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
    res.json(walls);
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
    
    res.json(walls);
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
    
    res.json(wall);
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
    
    const wall = new Wall({
      ...req.body,
      user_id: profile._id
    });
    
    await wall.save();
    
    // Populate user_id before sending response
    const populatedWall = await Wall.findById(wall._id)
      .populate('user_id', 'name email rating location associations');
    
    res.status(201).json(populatedWall);
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
    
    Object.assign(wall, req.body);
    await wall.save();
    
    // Populate before returning
    const populatedWall = await Wall.findById(wall._id)
      .populate('user_id', 'name email rating location associations');
    
    res.json(populatedWall);
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
