# Pikxora Demo Accounts

This document contains the credentials for demo accounts used for testing different user roles in the Pikxora platform.

## Demo Account Credentials

### Admin Account
- **Email:** admin@pikxora.com
- **Password:** admin123
- **Role:** Admin
- **Access:** Full admin panel, verification management, all features

### Studio Accounts (Verified)

#### Studio 1
- **Email:** studio1@pikxora.com
- **Password:** studio123
- **Role:** Studio
- **Status:** Verified (5-star rating)
- **Access:** Create walls, showcase projects, team management

#### Studio 2
- **Email:** studio2@pikxora.com
- **Password:** studio123
- **Role:** Studio
- **Status:** Verified (4-star rating)
- **Access:** Create walls, showcase projects, team management

### Artist Account
- **Email:** artist@pikxora.com
- **Password:** artist123
- **Role:** Artist/Freelancer
- **Access:** Create personal wall, portfolio management, networking

### Investor Account
- **Email:** investor@pikxora.com
- **Password:** investor123
- **Role:** Investor
- **Access:** Browse studios, view projects, connect with studios

## Setup Instructions

1. **Create Accounts:** These accounts need to be created through the signup flow at `/auth`
2. **Use Demo Credentials:** Copy the credentials from the Auth page or this document
3. **Sign Up:** Go to `/auth` and create each account using the credentials above
4. **Verify Studios:** For studio accounts, an admin needs to approve them at `/admin/verifications`

## Security Note

⚠️ **Important:** These are DEMO credentials only. In a production environment:
- Never use predictable passwords
- Never commit real credentials to version control
- Always use environment variables for sensitive data
- Implement proper password policies

## Testing Flows

### Admin Flow
1. Sign in as admin@pikxora.com
2. Navigate to Admin Panel → Verifications
3. Approve pending studio accounts
4. Test all admin features

### Studio Flow
1. Sign up as a new studio
2. Wait for admin approval or use pre-approved studio1/studio2
3. Create walls with projects
4. Test team member management

### Artist Flow
1. Sign in as artist@pikxora.com
2. Create personal portfolio wall
3. Browse and connect with studios
4. Test networking features

### Investor Flow
1. Sign in as investor@pikxora.com
2. Browse verified studios
3. View project showcases
4. Test connection features

## Role-Based Security

The application now uses a secure role management system:
- Roles are stored in a separate `user_roles` table
- Server-side validation using security definer functions
- No client-side role manipulation possible
- Proper RLS policies enforce access control

This prevents privilege escalation attacks and ensures proper authorization.
