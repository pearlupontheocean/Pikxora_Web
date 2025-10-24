import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, Mail, Eye } from "lucide-react";
import RatingStars from "@/components/RatingStars";

const WallView = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [wall, setWall] = useState<any>(null);
  const [wallProfile, setWallProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    // Get current user (optional)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(profileData);
    }

    // Load wall
    const { data: wallData, error: wallError } = await supabase
      .from("walls")
      .select("*")
      .eq("id", id)
      .single();

    if (wallError || !wallData) {
      navigate("/browse");
      return;
    }

    setWall(wallData);

    // Increment view count
    await supabase
      .from("walls")
      .update({ view_count: (wallData.view_count || 0) + 1 })
      .eq("id", id);

    // Load wall owner profile
    const { data: ownerData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", wallData.user_id)
      .single();

    setWallProfile(ownerData);

    // Load projects
    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .eq("wall_id", id)
      .order("order_index", { ascending: true });

    setProjects(projectsData || []);

    // Load team members
    const { data: teamData } = await supabase
      .from("team_members")
      .select(`
        *,
        profiles:artist_id (
          name,
          avatar_url,
          bio
        )
      `)
      .eq("studio_wall_id", id);

    setTeamMembers(teamData || []);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} profile={profile} />
      
      <div className="pt-16">
        {/* Hero Section */}
        {wall.hero_media_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[60vh] overflow-hidden"
          >
            <img
              src={wall.hero_media_url}
              alt={wall.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-12">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold red-glow-intense mb-4">
                    {wall.title}
                  </h1>
                  {wallProfile && (
                    <div className="flex items-center gap-4 flex-wrap">
                      <p className="text-xl text-primary capitalize">
                        {wallProfile.name}
                      </p>
                      {wallProfile.rating && (
                        <RatingStars rating={wallProfile.rating} showBadge />
                      )}
                      {wallProfile.location && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {wallProfile.location}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Description */}
          {wall.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h2 className="text-3xl font-bold mb-4">About</h2>
              <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                {wall.description}
              </p>
            </motion.div>
          )}

          {/* Associations */}
          {wallProfile?.associations && wallProfile.associations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold mb-4">Associations</h2>
              <div className="flex flex-wrap gap-3">
                {wallProfile.associations.map((assoc: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg font-medium"
                  >
                    {assoc}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="hover-lift"
                  >
                    <Card className="overflow-hidden border-red-glow">
                      {project.media_url && (
                        <div className="aspect-video bg-darker-grey overflow-hidden">
                          <img
                            src={project.media_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                        {project.category && (
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                            {project.category}
                          </span>
                        )}
                        {project.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Team Members */}
          {teamMembers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">Core Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="p-6 border-red-glow text-center">
                    {member.profiles?.avatar_url && (
                      <img
                        src={member.profiles.avatar_url}
                        alt={member.profiles.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary"
                      />
                    )}
                    <h3 className="font-bold mb-1">{member.profiles?.name}</h3>
                    {member.role && (
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                    )}
                    {member.profiles?.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {member.profiles.bio}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 border-t border-border"
          >
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Interested in collaboration? Reach out to start a conversation.
            </p>
            <Button size="lg">
              <Mail className="h-5 w-5 mr-2" />
              Contact {wallProfile?.name}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WallView;
