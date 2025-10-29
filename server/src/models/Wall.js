import mongoose from 'mongoose';

const wallSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  tagline: String,
  logo_url: String,
  hero_media_url: String,
  hero_media_type: {
    type: String,
    enum: ['image', 'video']
  },
  showreel_url: String,
  showreel_type: {
    type: String,
    enum: ['embed', 'upload']
  },
  journey_content: String,
  brand_colors: {
    primary: String,
    secondary: String
  },
  social_links: {
    twitter: String,
    linkedin: String,
    instagram: String,
    website: String
  },
  awards: [String],
  published: {
    type: Boolean,
    default: false
  },
  view_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add method to increment view count
wallSchema.methods.incrementViewCount = function() {
  this.view_count += 1;
  return this.save();
};

const Wall = mongoose.model('Wall', wallSchema);
export default Wall;
