# Migration Summary: Supabase to MongoDB

## Overview
Successfully migrated Pixora Connect from Supabase (PostgreSQL) to MongoDB with a Node.js/Express backend.

## What Changed

### Backend
- **Database**: PostgreSQL → MongoDB
- **Auth**: Supabase Auth → JWT-based authentication
- **Storage**: Supabase Storage → Local file storage with Multer
- **API**: Real-time subscriptions → REST API endpoints
- **New Files Created**:
  - `server/src/index.js` - Express server
  - `server/src/models/*` - MongoDB models (User, Profile, Wall, Project, TeamMember)
  - `server/src/routes/*` - API routes (auth, profiles, walls, projects, upload)
  - `server/src/middleware/*` - Auth and upload middleware
  - `server/.env` - Environment configuration

### Frontend
- **API Client**: New `src/lib/api.ts` replaces Supabase client
- **Auth Flow**: Updated to use JWT tokens
- **File Uploads**: Now using fetch API with FormData
- **Mock Supabase**: Created compatibility layer in `src/lib/supabase.ts`

## Key Features Preserved
✅ User authentication and registration  
✅ Role-based access control (admin, studio, artist, investor)  
✅ Profile management  
✅ Wall creation and editing  
✅ Admin verification system  
✅ File uploads (images, videos)  
✅ Browse and search functionality  
✅ View counting  

## New Architecture

```
Client (React + Vite)
       ↓
    API Client (fetch)
       ↓
  Backend (Express)
       ↓
    MongoDB
```

## Database Collections

1. **users** - Authentication (email, password, roles)
2. **profiles** - User profiles with verification status
3. **walls** - Portfolio walls
4. **projects** - Projects within walls
5. **teammembers** - Team associations

## Getting Started

See `SETUP_INSTRUCTIONS.md` for detailed setup instructions.

Quick start:
```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Current user

### Profiles
- `GET /api/profiles/me` - My profile
- `PUT /api/profiles/me` - Update profile
- `GET /api/profiles/pending` - Pending verifications (admin)
- `PUT /api/profiles/:id/verify` - Verify profile (admin)

### Walls
- `GET /api/walls` - All published walls
- `GET /api/walls/my` - My walls
- `GET /api/walls/:id` - Wall by ID
- `POST /api/walls` - Create wall
- `PUT /api/walls/:id` - Update wall
- `DELETE /api/walls/:id` - Delete wall

### Upload
- `POST /api/upload` - Upload file

## Environment Variables

### Backend (.env in server/)
```
MONGODB_URI=mongodb://localhost:27017/pixora-connect
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### Frontend (.env in root/)
```
VITE_API_URL=http://localhost:5000/api
```

## Testing
1. Start MongoDB (if local)
2. Start backend: `cd server && npm run dev`
3. Start frontend: `npm run dev`
4. Register an account at http://localhost:8080
5. Test all features

## Production Considerations
- Use MongoDB Atlas for hosted database
- Configure AWS S3 for file storage
- Set up reverse proxy (Nginx)
- Use PM2 for process management
- Configure proper CORS settings
- Set up SSL/HTTPS
- Use strong JWT secrets

## Files Modified
- `src/lib/supabase.ts` - Now uses new API
- `src/lib/api.ts` - New API client
- `src/lib/upload.ts` - Updated for new upload system
- `src/lib/roles.ts` - Updated for new auth
- `src/pages/Auth.tsx` - Simplified signup flow
- All page components now use new API

## Files to Remove (Optional)
- `supabase/` directory - Old Supabase migrations
- `src/integrations/supabase/` - Old Supabase client

## Migration Complete ✅
The application is now fully functional with MongoDB backend.
