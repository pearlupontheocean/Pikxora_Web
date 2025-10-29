# Pixora Connect - Supabase to MongoDB Migration

This project has been migrated from Supabase (PostgreSQL) to MongoDB with a Node.js/Express backend.

## Backend Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas connection string)

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/pixora-connect
JWT_SECRET=your-secret-key-change-this
PORT=5000
NODE_ENV=development
```

5. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Update the API URL in `.env` or `vite.config.ts`:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the frontend:
```bash
npm run dev
```

## Architecture

### Backend Structure
```
server/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   ├── User.js          # User authentication
│   │   ├── Profile.js       # User profiles
│   │   ├── Wall.js          # Portfolio walls
│   │   ├── Project.js       # Projects within walls
│   │   └── TeamMember.js    # Team member associations
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── upload.js        # File upload with Multer
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── profiles.js      # Profile management
│   │   ├── walls.js         # Wall CRUD operations
│   │   ├── projects.js      # Project operations
│   │   └── upload.js        # File upload endpoint
│   └── index.js             # Express server
└── uploads/                 # Uploaded files storage
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user

#### Profiles
- `GET /api/profiles/me` - Get current user's profile
- `PUT /api/profiles/me` - Update current user's profile
- `GET /api/profiles/pending` - Get pending verifications (admin only)
- `PUT /api/profiles/:id/verify` - Verify profile (admin only)

#### Walls
- `GET /api/walls` - Get all published walls
- `GET /api/walls/my` - Get current user's walls
- `GET /api/walls/:id` - Get wall by ID
- `POST /api/walls` - Create new wall
- `PUT /api/walls/:id` - Update wall
- `DELETE /api/walls/:id` - Delete wall

#### Projects
- `GET /api/projects/wall/:wallId` - Get projects for a wall
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project

#### Upload
- `POST /api/upload` - Upload file

## Database Schema

### User
- `_id` (ObjectId)
- `email` (String)
- `password` (String, hashed)
- `roles` (Array of Strings: admin, artist, investor, studio)

### Profile
- `_id` (ObjectId)
- `user_id` (ObjectId, ref: User)
- `email` (String)
- `name` (String)
- `verification_status` (String: pending, approved, rejected)
- `rating` (Number, 1-5)
- `location` (String)
- `bio` (String)
- `avatar_url` (String)
- `associations` (Array of Strings)
- `social_links` (Object)
- `brand_colors` (Object)

### Wall
- `_id` (ObjectId)
- `user_id` (ObjectId, ref: Profile)
- `title` (String)
- `description` (String)
- `published` (Boolean)
- `view_count` (Number)
- Plus all other wall fields...

### Project
- `_id` (ObjectId)
- `wall_id` (ObjectId, ref: Wall)
- `title` (String)
- Plus all other project fields...

### TeamMember
- `_id` (ObjectId)
- `studio_wall_id` (ObjectId, ref: Wall)
- `artist_id` (ObjectId, ref: Profile)
- `role` (String)

## Migration Notes

### Changes from Supabase:
1. Authentication: Now using JWT instead of Supabase Auth
2. Database: MongoDB instead of PostgreSQL
3. File Storage: Local storage with Multer instead of Supabase Storage
4. API: REST endpoints instead of real-time subscriptions
5. Storage: Files stored in `server/uploads/` directory

### Frontend Changes:
- All Supabase calls replaced with fetch API calls
- Auth state managed with JWT tokens in localStorage
- File uploads use FormData with fetch
- Real-time subscriptions replaced with polling where needed

## Development

Start both servers in separate terminals:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## Production Deployment

1. Set production environment variables
2. Use MongoDB Atlas for database
3. Configure file storage (consider AWS S3 for production)
4. Use a reverse proxy (nginx) to serve both API and frontend
5. Set up proper CORS configuration
6. Use a process manager (PM2) for the backend

## Support

For issues or questions, please refer to the main documentation or contact the development team.
