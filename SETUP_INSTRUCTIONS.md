# Setup Instructions

This project has been migrated from Supabase to MongoDB with Express.js backend.

## Prerequisites

1. Node.js 18+ installed
2. MongoDB installed locally or MongoDB Atlas account

## Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Ensure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or if using MongoDB Atlas, no need to run mongod
```

4. Update the `.env` file in `server/` directory if needed:
```env
MONGODB_URI=mongodb://localhost:27017/pixora-connect
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pixora-connect

JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on http://localhost:5000

## Frontend Setup

1. Return to the project root:
```bash
cd ..
```

2. Install frontend dependencies (if not already done):
```bash
npm install
```

3. Update environment variables (create `.env` file in root if needed):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend:
```bash
npm run dev
```

The frontend will run on http://localhost:8080 (or configured port)

## Running the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then navigate to http://localhost:8080 in your browser.

## API Endpoints

The backend provides RESTful API endpoints:

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user

### Profiles
- `GET /api/profiles/me` - Get current profile
- `PUT /api/profiles/me` - Update current profile
- `GET /api/profiles/pending` - Get pending verifications (admin)
- `PUT /api/profiles/:id/verify` - Verify profile (admin)

### Walls
- `GET /api/walls` - Get all published walls
- `GET /api/walls/my` - Get user's walls
- `GET /api/walls/:id` - Get wall by ID
- `POST /api/walls` - Create wall
- `PUT /api/walls/:id` - Update wall
- `DELETE /api/walls/:id` - Delete wall

## Testing

1. Start both servers
2. Navigate to http://localhost:8080
3. Register a new account
4. Login and explore the features

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists in server directory
- Check port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend .env
- Ensure CORS is enabled (it should be by default)

### File uploads not working
- Ensure `uploads/` directory exists in server/
- Check file permissions on uploads directory
- Verify file size limits (50MB default)

## Database Schema

The application uses MongoDB with the following main collections:

- **users** - User authentication
- **profiles** - User profile information
- **walls** - Portfolio walls
- **projects** - Projects within walls
- **teammembers** - Team member associations

## Production Deployment

For production deployment:

1. Set proper environment variables
2. Use MongoDB Atlas for database
3. Configure file storage (AWS S3 recommended)
4. Use process manager (PM2) for backend
5. Configure reverse proxy (Nginx)
6. Set up SSL certificates
7. Update CORS settings for production domain

## Support

For issues, refer to:
- `README_MIGRATION.md` for migration details
- `server/src/` for backend code
- `src/lib/api.ts` for frontend API client
