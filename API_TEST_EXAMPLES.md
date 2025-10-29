# API Testing Guide - Test Locally

All API endpoints are available at: `http://localhost:5000/api`

## 1. Sign Up (Register New User)

**Endpoint:** `POST http://localhost:5000/api/auth/signup`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "role": "studio"
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "studio"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "65f...",
    "email": "test@example.com",
    "roles": ["studio"]
  },
  "token": "eyJhbGc..."
}
```

## 2. Sign In (Login)

**Endpoint:** `POST http://localhost:5000/api/auth/signin`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "65f...",
    "email": "test@example.com",
    "roles": ["studio"]
  },
  "token": "eyJhbGc..."
}
```

**Save the token for authenticated requests!**

## 3. Get Current User (Authenticated)

**Endpoint:** `GET http://localhost:5000/api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**cURL Command:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "user": {
    "id": "65f...",
    "email": "test@example.com",
    "roles": ["studio"]
  },
  "profile": {
    "_id": "65f...",
    "user_id": "65f...",
    "email": "test@example.com",
    "name": "Test User",
    "verification_status": "pending",
    ...
  }
}
```

## 4. Get My Profile (Authenticated)

**Endpoint:** `GET http://localhost:5000/api/profiles/me`

**cURL Command:**
```bash
curl -X GET http://localhost:5000/api/profiles/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 5. Create Wall (Authenticated)

**Endpoint:** `POST http://localhost:5000/api/walls`

**Request Body:**
```json
{
  "title": "My Awesome Wall",
  "description": "This is my portfolio wall",
  "tagline": "Creating amazing VFX",
  "logo_url": "https://example.com/logo.png",
  "hero_media_url": "https://example.com/hero.jpg",
  "hero_media_type": "image",
  "showreel_url": "https://youtube.com/watch?v=...",
  "showreel_type": "embed",
  "journey_content": "Started in 2020...",
  "brand_colors": {
    "primary": "#ef4444",
    "secondary": "#1a1a1a"
  },
  "social_links": {
    "twitter": "https://twitter.com/...",
    "linkedin": "https://linkedin.com/...",
    "instagram": "https://instagram.com/...",
    "website": "https://example.com"
  },
  "awards": ["Award 1", "Award 2"],
  "published": false
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/walls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Awesome Wall",
    "description": "This is my portfolio wall",
    "published": false
  }'
```

## 6. Get All Published Walls (Public)

**Endpoint:** `GET http://localhost:5000/api/walls`

**cURL Command:**
```bash
curl http://localhost:5000/api/walls
```

## 7. Get My Walls (Authenticated)

**Endpoint:** `GET http://localhost:5000/api/walls/my`

**cURL Command:**
```bash
curl http://localhost:5000/api/walls/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 8. Get Specific Wall (Public)

**Endpoint:** `GET http://localhost:5000/api/walls/{WALL_ID}`

**cURL Command:**
```bash
curl http://localhost:5000/api/walls/65f1234567890abcdef
```

## 9. Update Wall (Authenticated - Owner Only)

**Endpoint:** `PUT http://localhost:5000/api/walls/{WALL_ID}`

**Request Body:**
```json
{
  "title": "Updated Wall Title",
  "description": "Updated description",
  "published": true
}
```

**cURL Command:**
```bash
curl -X PUT http://localhost:5000/api/walls/65f1234567890abcdef \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Wall Title",
    "published": true
  }'
```

## 10. Get Pending Profiles (Admin Only)

**Endpoint:** `GET http://localhost:5000/api/profiles/pending`

**cURL Command:**
```bash
curl http://localhost:5000/api/profiles/pending \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## 11. Verify Profile (Admin Only)

**Endpoint:** `PUT http://localhost:5000/api/profiles/{PROFILE_ID}/verify`

**Request Body:**
```json
{
  "verification_status": "approved",
  "rating": 4
}
```

**cURL Command:**
```bash
curl -X PUT http://localhost:5000/api/profiles/65f1234567890abcdef/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "verification_status": "approved",
    "rating": 4
  }'
```

## 12. Upload File (Authenticated)

**Endpoint:** `POST http://localhost:5000/api/upload`

**Form Data:**
- `file` - The file to upload
- `folder` - Folder name (e.g., "logos", "hero", "showreels")

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/image.jpg" \
  -F "folder=logos"
```

**Response:**
```json
{
  "url": "/uploads/logos/1234567890-image.jpg"
}
```

## Quick Test Workflow

1. **Sign up a user:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "admin"
  }'
```

2. **Copy the token from response**

3. **Create a wall:**
```bash
curl -X POST http://localhost:5000/api/walls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Wall",
    "description": "Testing the API",
    "published": false
  }'
```

4. **Get all walls:**
```bash
curl http://localhost:5000/api/walls
```

## Testing with Postman

1. Create a new collection "Pixora API"
2. Set base URL: `http://localhost:5000/api`
3. For authenticated requests:
   - Go to Authorization tab
   - Type: Bearer Token
   - Token: Paste your token from signup/signin response
4. Test each endpoint

## Environment Setup

Make sure your `.env` in `server/` has:
```env
MONGODB_URI=mongodb://localhost:27017/pixora-connect
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

Start MongoDB:
```bash
mongod
```

Start server:
```bash
cd server
npm run dev
```

Test API is running:
```bash
curl http://localhost:5000/api/auth/me
```
