# Quick Start Guide - Pixora Connect

## Setup (5 minutes)

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
```
Backend runs on http://localhost:5000

### 2. Frontend Setup (in new terminal)
```bash
npm run dev
```
Frontend runs on http://localhost:8080

### 3. MongoDB Setup
Make sure MongoDB is running:
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas connection string in server/.env
```

## Environment Files

### Backend (`server/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/pixora-connect
JWT_SECRET=pixora-connect-secret-key
PORT=5000
NODE_ENV=development
```

### Frontend (root `.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

## Testing the App

1. Open http://localhost:8080
2. Click "Sign Up"
3. Register with any role (Admin, Studio, Artist, Investor)
4. After signup, you'll be redirected to dashboard
5. Explore features:
   - Create walls (approved studios)
   - Browse published walls
   - View and edit walls
   - Admin verification panel (for admin role)

## Features

✅ User Authentication (JWT)
✅ Role-based Access Control
✅ Profile Management
✅ Wall Creation & Editing
✅ File Uploads
✅ Admin Verification System
✅ Browse & Search Walls
✅ View Tracking

## API Endpoints

- `POST /api/auth/signup` - Register
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Current user
- `GET /api/walls` - All published walls
- `POST /api/walls` - Create wall (requires auth)
- `GET /api/profiles/pending` - Pending verifications (admin only)
- `POST /api/upload` - Upload files

## Troubleshooting

**Backend won't start?**
- Check if MongoDB is running
- Verify `.env` file exists in `server/`

**Frontend can't connect to backend?**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`

**File uploads fail?**
- Ensure `server/uploads/` directory exists
- Check file permissions

## Project Structure

```
pixora-connect/
├── server/              # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── models/     # MongoDB models
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Auth & upload
│   │   └── index.js    # Server entry
│   └── uploads/        # File storage
├── src/                # Frontend (React + Vite)
│   ├── lib/           # API client
│   ├── pages/         # Page components
│   └── components/    # Reusable components
└── package.json
```

## Next Steps

- See `SETUP_INSTRUCTIONS.md` for detailed setup
- See `MIGRATION_SUMMARY.md` for architecture details
- See `README_MIGRATION.md` for migration information
