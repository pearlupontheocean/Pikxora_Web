import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCurrentUser, useCreateWall } from "@/lib/api-hooks";
import { uploadFile } from "@/lib/upload";
import { toast } from "sonner";
import { Loader2, Upload, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const wallSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  tagline: z.string().optional(),
  showreel_type: z.enum(["embed", "upload"]).optional(),
  showreel_url: z.string().optional(),
  journey_content: z.string().optional(),
});

type WallFormData = z.infer<typeof wallSchema>;

const WallCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [logoPreview, setLogoPreview] = useState("");
  const [heroPreview, setHeroPreview] = useState("");
  const [showreelFile, setShowreelFile] = useState<File | null>(null);
  const [awards, setAwards] = useState<string[]>([]);
  const [currentAward, setCurrentAward] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    linkedin: "",
    instagram: "",
    website: ""
  });
  const [brandColors, setBrandColors] = useState({
    primary: "#ef4444",
    secondary: "#1a1a1a"
  });

  const form = useForm<WallFormData>({
    resolver: zodResolver(wallSchema),
    defaultValues: {
      title: "",
      description: "",
      tagline: "",
      showreel_type: "embed",
      showreel_url: "",
      journey_content: ""
    }
  });

  // React Query hooks
  const { data: currentUserData, isLoading: userLoading } = useCurrentUser();
  const createWallMutation = useCreateWall();

  const user = currentUserData?.user;

  useEffect(() => {
    const hasToken = !!localStorage.getItem('token');
    if (!userLoading && !currentUserData && hasToken) {
      // Token exists but user data not loaded - might be invalid
      navigate("/auth");
    } else if (!hasToken && !userLoading) {
      // No token and not loading - not logged in
      navigate("/auth");
    }
  }, [userLoading, currentUserData, navigate]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setHeroPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleShowreelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setShowreelFile(file);
    }
  };

  const addAward = () => {
    if (currentAward.trim()) {
      setAwards([...awards, currentAward.trim()]);
      setCurrentAward("");
    }
  };

  const removeAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: WallFormData, published: boolean) => {
    if (!user) return;

    setSubmitting(true);
    try {
      let logoUrl = logoPreview;
      let heroUrl = heroPreview;
      let showreelUrl = data.showreel_url;

      // Upload logo if it's a local file
      if (logoPreview && logoPreview.startsWith("data:")) {
        const logoInput = document.querySelector('input[name="logo"]') as HTMLInputElement;
        const logoFile = logoInput?.files?.[0];
        if (logoFile) {
          const { url, error } = await uploadFile(logoFile, "wall-assets", "logos");
          if (error) throw error;
          logoUrl = url || "";
        }
      }

      // Upload hero image if it's a local file
      if (heroPreview && heroPreview.startsWith("data:")) {
        const heroInput = document.querySelector('input[name="hero"]') as HTMLInputElement;
        const heroFile = heroInput?.files?.[0];
        if (heroFile) {
          const { url, error } = await uploadFile(heroFile, "wall-assets", "hero");
          if (error) throw error;
          heroUrl = url || "";
        }
      }

      // Upload showreel video if selected
      if (showreelFile && data.showreel_type === "upload") {
        const { url, error } = await uploadFile(
          showreelFile,
          "wall-assets",
          "showreels",
          (progress) => setUploadProgress(progress.progress)
        );
        if (error) throw error;
        showreelUrl = url || "";
      }

      await createWallMutation.mutateAsync({
        title: data.title,
        description: data.description,
        tagline: data.tagline,
        logo_url: logoUrl,
        hero_media_url: heroUrl,
        hero_media_type: "image",
        showreel_url: showreelUrl,
        showreel_type: data.showreel_type,
        journey_content: data.journey_content,
        brand_colors: brandColors,
        social_links: socialLinks,
        awards: awards.length > 0 ? awards : null,
        published
      });

      toast.success(published ? "Wall published successfully!" : "Wall saved as draft!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create wall");
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold red-glow-intense mb-2">Create Your Wall</h1>
            <p className="text-muted-foreground">Build your digital presence and showcase your work</p>
          </div>

          <Form {...form}>
            <form className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wall Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter wall title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your wall..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label htmlFor="hero">Hero Image</Label>
                    <Input
                      id="hero"
                      name="hero"
                      type="file"
                      accept="image/*"
                      onChange={handleHeroUpload}
                      className="mt-2"
                    />
                    {heroPreview && (
                      <img src={heroPreview} alt="Hero preview" className="mt-4 rounded-lg max-h-48 object-cover" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Studio Identity */}
              <Card>
                <CardHeader>
                  <CardTitle>Studio Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="logo">Logo</Label>
                    <Input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="mt-2"
                    />
                    {logoPreview && (
                      <img src={logoPreview} alt="Logo preview" className="mt-4 h-24 w-auto object-contain" />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline</FormLabel>
                        <FormControl>
                          <Input placeholder="Your studio's tagline" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <Input
                        id="primary-color"
                        type="color"
                        value={brandColors.primary}
                        onChange={(e) => setBrandColors({ ...brandColors, primary: e.target.value })}
                        className="h-10 mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <Input
                        id="secondary-color"
                        type="color"
                        value={brandColors.secondary}
                        onChange={(e) => setBrandColors({ ...brandColors, secondary: e.target.value })}
                        className="h-10 mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Social Links</Label>
                    <Input
                      placeholder="Twitter URL"
                      value={socialLinks.twitter}
                      onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    />
                    <Input
                      placeholder="LinkedIn URL"
                      value={socialLinks.linkedin}
                      onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    />
                    <Input
                      placeholder="Instagram URL"
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    />
                    <Input
                      placeholder="Website URL"
                      value={socialLinks.website}
                      onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Awards & Certifications</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an award..."
                        value={currentAward}
                        onChange={(e) => setCurrentAward(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAward())}
                      />
                      <Button type="button" onClick={addAward} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {awards.map((award, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                          <span className="text-sm">{award}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAward(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Showreel */}
              <Card>
                <CardHeader>
                  <CardTitle>Main Showreel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="showreel_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Showreel Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="embed">Embed URL (YouTube/Vimeo)</SelectItem>
                            <SelectItem value="upload">Upload Video</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("showreel_type") === "embed" && (
                    <FormField
                      control={form.control}
                      name="showreel_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("showreel_type") === "upload" && (
                    <div>
                      <Label htmlFor="showreel">Upload Video</Label>
                      <Input
                        id="showreel"
                        type="file"
                        accept="video/*"
                        onChange={handleShowreelFileChange}
                        className="mt-2"
                      />
                      {showreelFile && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {showreelFile.name}
                        </p>
                      )}
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <Progress value={uploadProgress} className="mt-2" />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Studio Journey */}
              <Card>
                <CardHeader>
                  <CardTitle>Studio Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="journey_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Story</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell your studio's story, milestones, and journey..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.handleSubmit((data) => onSubmit(data, false))()}
                  disabled={submitting}
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Publish Wall"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default WallCreate;
