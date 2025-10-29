import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCurrentUser, useMyProfile, useWall as useWallHook } from "@/lib/api-hooks";
import axiosInstance from "@/lib/axios";
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
  const navigate = useNavigate();

  // React Query hooks
  const { data: currentUserData } = useCurrentUser();
  const { data: profile } = useMyProfile();
  const { data: wall, isLoading: wallLoading } = useWallHook(id!);
  
  const user = currentUserData?.user;
  const loading = wallLoading;

  useEffect(() => {
    if (!wall && !wallLoading) {
      navigate("/browse");
    }
  }, [wall, wallLoading, navigate]);

  // Load projects
  const [projects, setProjects] = useState<any[]>([]);
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axiosInstance.get(`/projects/wall/${id}`);
        setProjects(response.data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    
    if (id) {
      loadProjects();
    }
  }, [id]);

  if (loading || !wall) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const wallOwner = wall.user_id;
  const isOwner = user && wallOwner && (user.id === wallOwner._id || user.id === wallOwner.user_id);

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
              {wallOwner && (
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">by {wallOwner.name}</span>
                    {wallOwner.rating && (
                      <RatingStars rating={wallOwner.rating} />
                    )}
                  </div>
                  {wallOwner.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{wallOwner.location}</span>
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
              {wallOwner?.email && (
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

            {wallOwner?.associations && wallOwner.associations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold">Associations</h2>
                <div className="flex flex-wrap gap-2">
                  {wallOwner.associations.map((assoc: string, index: number) => (
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
                    key={project._id}
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
        </Tabs>
      </div>
    </div>
  );
};

export default WallView;