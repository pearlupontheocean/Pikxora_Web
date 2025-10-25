import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCurrentUser, supabase } from "@/lib/supabase";
import { getUserPrimaryRole } from "@/lib/roles";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Eye, Settings } from "lucide-react";
import RatingStars from "@/components/RatingStars";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [walls, setWalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { session } = await getCurrentUser();
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(profileData);

    // Load user role
    const role = await getUserPrimaryRole(session.user.id);
    setUserRole(role);

    // Load walls
    const { data: wallsData } = await supabase
      .from("walls")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setWalls(wallsData || []);
    setLoading(false);
  };

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
                Role: <span className="text-primary capitalize">{userRole}</span>
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
          {userRole === "studio" && (isPending || isRejected) && (
            <Card className={`p-6 border-2 ${isRejected ? 'border-destructive' : 'border-yellow-500'}`}>
              <h3 className="font-semibold text-lg mb-2">
                {isPending ? "Verification Pending" : "Verification Rejected"}
              </h3>
              <p className="text-muted-foreground">
                {isPending
                  ? "Your studio account is awaiting admin verification. You'll be able to create walls once approved."
                  : "Your studio verification was rejected. Please contact support for more information."}
              </p>
            </Card>
          )}

          {/* Walls Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Walls</h2>
              {userRole !== "investor" && profile?.verification_status === "approved" && (
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
                {profile?.verification_status === "approved" && userRole !== "investor" && (
                  <Button onClick={() => navigate("/wall/create")}>
                    Create Your First Wall
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {walls.map((wall) => (
                  <motion.div
                    key={wall.id}
                    whileHover={{ scale: 1.02 }}
                    className="hover-lift"
                  >
                    <Card className="p-6 border-red-glow cursor-pointer" onClick={() => navigate(`/wall/${wall.id}`)}>
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
          {userRole === "admin" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
              <Button onClick={() => navigate("/admin/verifications")}>
                View Pending Verifications
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
