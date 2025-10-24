-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('studio', 'artist', 'investor', 'admin');

-- Create enum for verification status
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  verification_status verification_status DEFAULT 'pending',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  associations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create walls table
CREATE TABLE walls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  hero_media_url TEXT,
  hero_media_type TEXT,
  description TEXT,
  published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wall_id UUID REFERENCES walls(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT,
  media_type TEXT,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team members table (for linking artists to studios)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  studio_wall_id UUID REFERENCES walls(id) ON DELETE CASCADE NOT NULL,
  artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(studio_wall_id, artist_id)
);

-- Create connections table
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE walls ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Walls policies
CREATE POLICY "Published walls are viewable by everyone" 
  ON walls FOR SELECT USING (published = true OR user_id = auth.uid());

CREATE POLICY "Users can create own walls" 
  ON walls FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own walls" 
  ON walls FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own walls" 
  ON walls FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Projects are viewable via walls" 
  ON projects FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM walls 
      WHERE walls.id = projects.wall_id 
      AND (walls.published = true OR walls.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage projects on own walls" 
  ON projects FOR ALL USING (
    EXISTS (
      SELECT 1 FROM walls 
      WHERE walls.id = projects.wall_id 
      AND walls.user_id = auth.uid()
    )
  );

-- Team members policies
CREATE POLICY "Team members are viewable via walls" 
  ON team_members FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM walls 
      WHERE walls.id = team_members.studio_wall_id 
      AND walls.published = true
    )
  );

CREATE POLICY "Studio owners can manage team" 
  ON team_members FOR ALL USING (
    EXISTS (
      SELECT 1 FROM walls 
      WHERE walls.id = team_members.studio_wall_id 
      AND walls.user_id = auth.uid()
    )
  );

-- Connections policies
CREATE POLICY "Users can view own connections" 
  ON connections FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "Users can create connections" 
  ON connections FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update connections" 
  ON connections FOR UPDATE USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_walls_updated_at BEFORE UPDATE ON walls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();