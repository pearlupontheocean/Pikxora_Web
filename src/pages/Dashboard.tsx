import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCurrentUser, useMyProfile, useMyWalls } from "@/lib/api-hooks";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Eye, Settings } from "lucide-react";
import RatingStars from "@/components/RatingStars";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // React Query hooks
  const { data: currentUserData, isLoading: userLoading } = useCurrentUser();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: walls = [], isLoading: wallsLoading } = useMyWalls();

  const user = currentUserData?.user;
  const loading = userLoading || profileLoading || wallsLoading;

  useEffect(() => {
    const hasToken = !!localStorage.getItem('token');
    if (!userLoading && !currentUserData && !hasToken) {
      navigate("/auth");
    }
  }, [userLoading, currentUserData, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPending = profile?.verification_status === "pending";
  const isRejected = profile?.verification_status === "rejected";

  return (
    <div className="min-h-screen">
      <Navbar user={user} profile={profile} />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold red-glow-intense mb-2">
                Welcome, {profile?.name}
              </h1>
              <p className="text-muted-foreground">
                Email: <span className="text-primary">{profile?.email}</span>
              </p>
              {profile?.rating && (
                <div className="mt-2">
                  <RatingStars rating={profile.rating} showBadge />
                </div>
              )}
            </div>
            <Button onClick={() => navigate("/profile/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Verification Status */}
          {(isPending || isRejected) && (
            <Card className={`p-6 border-2 ${isRejected ? 'border-destructive' : 'border-yellow-500'}`}>
              <h3 className="font-semibold text-lg mb-2">
                {isPending ? "Verification Pending" : "Verification Rejected"}
              </h3>
              <p className="text-muted-foreground">
                {isPending
                  ? "Your account is awaiting admin verification. You'll be able to create walls once approved."
                  : "Your verification was rejected. Please contact support for more information."}
              </p>
            </Card>
          )}

          {/* Walls Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Walls</h2>
              {profile?.verification_status === "approved" && (
                <Button onClick={() => navigate("/wall/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Wall
                </Button>
              )}
            </div>

            {walls.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <p className="text-muted-foreground mb-4">
                  You haven't created any walls yet
                </p>
                {profile?.verification_status === "approved" && (
                  <Button onClick={() => navigate("/wall/create")}>
                    Create Your First Wall
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {walls.map((wall) => (
                      <motion.div
                        key={wall._id}
                        whileHover={{ scale: 1.02 }}
                        className="hover-lift"
                      >
                        <Card className="p-6 border-red-glow cursor-pointer" onClick={() => navigate(`/wall/${wall._id}`)}>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-lg">{wall.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${wall.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {wall.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {wall.description || "No description"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {wall.view_count} views
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

              {/* Admin Section */}
              {user?.roles?.includes('admin') && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                  <div className="flex gap-4">
                    <Button onClick={() => navigate("/admin/verifications")} size="lg">
                      Approve Studios
                    </Button>
                    <Button onClick={() => navigate("/admin/verifications")} variant="outline" size="lg">
                      Manage All Users
                    </Button>
                  </div>
                </div>
              )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
