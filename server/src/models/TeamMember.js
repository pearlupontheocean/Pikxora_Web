import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  studio_wall_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wall',
    required: true
  },
  artist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  role: String
}, {
  timestamps: true
});

teamMemberSchema.index({ studio_wall_id: 1, artist_id: 1 }, { unique: true });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
export default TeamMember;
