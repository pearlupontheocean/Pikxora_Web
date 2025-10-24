import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Check, X, MapPin, Link as LinkIcon } from "lucide-react";
import RatingStars from "@/components/RatingStars";

const AdminVerifications = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(profileData);

    if (profileData?.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    // Load pending users
    const { data: pendingData } = await supabase
      .from("profiles")
      .select("*")
      .eq("verification_status", "pending")
      .eq("role", "studio")
      .order("created_at", { ascending: true });

    setPendingUsers(pendingData || []);
    setLoading(false);
  };

  const handleVerification = async (userId: string, status: "approved" | "rejected", rating?: number) => {
    const updates: any = { verification_status: status };
    if (status === "approved" && rating) {
      updates.rating = rating;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      toast.error("Error updating verification status");
    } else {
      toast.success(`Studio ${status}${rating ? ` with ${rating} star rating` : ""}`);
      loadData();
    }
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
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold red-glow-intense mb-2">
              Pending Verifications
            </h1>
            <p className="text-muted-foreground">
              Review and approve studio registrations
            </p>
          </div>

          {pendingUsers.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <p className="text-muted-foreground">
                No pending verifications at this time
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingUsers.map((pendingUser) => (
                <Card key={pendingUser.id} className="p-6 border-red-glow">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{pendingUser.name}</h3>
                        <p className="text-muted-foreground">{pendingUser.email}</p>
                      </div>

                      {pendingUser.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {pendingUser.location}
                        </div>
                      )}

                      {pendingUser.bio && (
                        <div>
                          <h4 className="font-semibold mb-1">Bio</h4>
                          <p className="text-sm text-muted-foreground">{pendingUser.bio}</p>
                        </div>
                      )}

                      {pendingUser.associations && pendingUser.associations.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Associations</h4>
                          <div className="flex flex-wrap gap-2">
                            {pendingUser.associations.map((assoc: string, i: number) => (
                              <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                {assoc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        Registered: {new Date(pendingUser.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Assign Rating</h4>
                        <Select
                          onValueChange={(value) => {
                            const rating = parseInt(value);
                            handleVerification(pendingUser.id, "approved", rating);
                          }}
                        >
                          <SelectTrigger className="border-border">
                            <SelectValue placeholder="Select rating and approve" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">
                              <div className="flex items-center gap-2">
                                <RatingStars rating={5} />
                                <span className="text-xs">- Global Elite</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="4">
                              <div className="flex items-center gap-2">
                                <RatingStars rating={4} />
                                <span className="text-xs">- Premier</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="3">
                              <div className="flex items-center gap-2">
                                <RatingStars rating={3} />
                                <span className="text-xs">- Verified</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="2">
                              <div className="flex items-center gap-2">
                                <RatingStars rating={2} />
                                <span className="text-xs">- Approved</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="1">
                              <div className="flex items-center gap-2">
                                <RatingStars rating={1} />
                                <span className="text-xs">- Entry Level</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleVerification(pendingUser.id, "rejected")}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject Application
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminVerifications;
