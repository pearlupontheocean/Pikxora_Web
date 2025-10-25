import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import StudioIdentity from "@/components/StudioIdentity";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, Mail, Eye, Edit, Video, Briefcase, Users, BookOpen } from "lucide-react";
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

  const isOwner = user && wall && user.id === wall.user_id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} profile={profile} />

      {/* Hero Section */}
      {wall?.hero_media_url && (
        <div className="relative h-[50vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            src={wall.hero_media_url}
            alt={wall.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-bold red-glow-intense mb-2">{wall?.title}</h1>
              {wallProfile && (
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">by {wallProfile.name}</span>
                    {wallProfile.rating && (
                      <RatingStars rating={wallProfile.rating} />
                    )}
                  </div>
                  {wallProfile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{wallProfile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{wall.view_count || 0} views</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {isOwner && (
                <Link to={`/wall/${id}/edit`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Wall
                  </Button>
                </Link>
              )}
              {wallProfile?.email && (
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Get in Touch
                </Button>
              )}
            </div>
          </div>

          {wall?.description && (
            <p className="text-lg text-muted-foreground max-w-3xl">
              {wall.description}
            </p>
          )}
        </motion.div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview" className="gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="journey" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Journey</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {wall?.showreel_url && wall?.showreel_type && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold">Main Showreel</h2>
                <VideoPlayer
                  url={wall.showreel_url}
                  type={wall.showreel_type}
                  className="max-w-4xl mx-auto"
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold mb-6">Studio Identity</h2>
              <StudioIdentity
                logoUrl={wall?.logo_url}
                tagline={wall?.tagline}
                brandColors={wall?.brand_colors as any}
                socialLinks={wall?.social_links as any}
                awards={wall?.awards}
              />
            </motion.div>

            {wallProfile?.associations && wallProfile.associations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold">Associations</h2>
                <div className="flex flex-wrap gap-2">
                  {wallProfile.associations.map((assoc: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm"
                    >
                      {assoc}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <h2 className="text-3xl font-bold">Portfolio</h2>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
                      {project.media_url && (
                        <div className="aspect-video overflow-hidden">
                          {project.media_type === "video" ? (
                            <video
                              src={project.media_url}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={project.media_url}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          )}
                        </div>
                      )}
                      <div className="p-6 space-y-2">
                        {project.category && (
                          <span className="text-xs text-primary uppercase tracking-wider">
                            {project.category}
                          </span>
                        )}
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {project.description}
                          </p>
                        )}
                        {project.showreel_url && project.showreel_type && (
                          <div className="pt-4">
                            <VideoPlayer
                              url={project.showreel_url}
                              type={project.showreel_type}
                            />
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No projects yet</p>
            )}
          </TabsContent>

          {/* Journey Tab */}
          <TabsContent value="journey" className="space-y-6">
            <h2 className="text-3xl font-bold">Our Journey</h2>
            {wall?.journey_content ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert max-w-none"
              >
                <Card className="p-8">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {wall.journey_content}
                  </p>
                </Card>
              </motion.div>
            ) : (
              <p className="text-muted-foreground text-center py-12">
                No journey content available yet
              </p>
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <h2 className="text-3xl font-bold">Core Team</h2>
            {teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member: any, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-shadow">
                      {member.profiles?.avatar_url && (
                        <img
                          src={member.profiles.avatar_url}
                          alt={member.profiles.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                      )}
                      <h3 className="text-xl font-bold text-center mb-2">
                        {member.profiles?.name}
                      </h3>
                      {member.role && (
                        <p className="text-sm text-primary text-center mb-3">
                          {member.role}
                        </p>
                      )}
                      {member.profiles?.bio && (
                        <p className="text-sm text-muted-foreground text-center">
                          {member.profiles.bio}
                        </p>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No team members yet</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WallView;
