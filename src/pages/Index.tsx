import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  Globe, 
  Sparkles, 
  Users, 
  Zap, 
  TrendingUp, 
  Rocket,
  Heart,
  Target,
  Shield,
  Calendar,
  Newspaper,
  Brain,
  Award
} from "lucide-react";
import heroGlobe from "@/assets/hero-globe.jpg";
import studioFuture from "@/assets/studio-future.jpg";
import aiNeural from "@/assets/ai-neural.jpg";
import artistCyber from "@/assets/artist-cyber.jpg";
import eventFuture from "@/assets/event-future.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Immersive */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroGlobe}
            alt="Holographic globe with India glowing at center"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Crafted in India • Powering Global Dreams</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="red-glow-intense block mb-2">PIKXORA</span>
              <span className="text-3xl md:text-4xl lg:text-5xl font-normal text-foreground block">
                Where Indian Pixels Power Global Dreams
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Join <span className="text-primary font-semibold">10,000+ studios</span> and creators in a borderless universe of innovation, 
              AI-fueled creativity, and unbreakable community bonds.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6 border-red-glow-intense group">
                  <Rocket className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Launch Your Studio Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Ignite Your Artist Journey
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Empowerment Spotlight Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-darker-grey">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold red-glow mb-6">
              The Neural Hub for VFX Growth
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Pikxora isn't just a platform—it's a living ecosystem where studios showcase cutting-edge reels, 
              artists build portfolios with AI-enhanced tools, and the community drives welfare through mentorship, 
              fair-pay advocacy, and skill-upgrading grants.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: TrendingUp,
                title: "Growth",
                description: "Scale your studio with global gigs and AI matchmaking that connects you to opportunities worldwide."
              },
              {
                icon: Rocket,
                title: "Empowerment",
                description: "Artists, claim your spotlight—build profiles that evolve with your career and showcase your unique vision."
              },
              {
                icon: Zap,
                title: "Enhancement",
                description: "Indian-born tools for seamless collaboration across time zones, powered by cutting-edge technology."
              },
              {
                icon: Heart,
                title: "Welfare",
                description: "Championing diversity, mental health resources, and equitable opportunities for all creators."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-primary/30 rounded-lg hover-lift bg-background/50 backdrop-blur-sm"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4 drop-shadow-[0_0_10px_hsl(var(--primary))]" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/browse">
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                <Target className="mr-2 h-5 w-5" />
                Discover Your Power
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Showcase Studios & Talent */}
      <section className="py-24 px-4 bg-gradient-to-b from-darker-grey to-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold red-glow mb-4">
              Global Studios • Infinite Talent
            </h2>
            <p className="text-xl text-muted-foreground">
              Connecting visionaries across continents
            </p>
          </motion.div>

          {/* Studio Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "PixelForge India",
                tagline: "Masters of Quantum Realms",
                location: "Mumbai, India",
                specialty: "Photorealistic CGI & Simulations",
                image: studioFuture
              },
              {
                name: "NovaEffects LA",
                tagline: "Holo-Warriors of Tomorrow",
                location: "Los Angeles, USA",
                specialty: "Character Animation & Motion Capture",
                image: heroGlobe
              },
              {
                name: "Celestial Studios",
                tagline: "Architects of Digital Dreams",
                location: "London, UK",
                specialty: "Virtual Production & Real-time VFX",
                image: eventFuture
              }
            ].map((studio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="hover-lift"
              >
                <Card className="overflow-hidden border-red-glow cursor-pointer group">
                  <div className="relative aspect-video">
                    <img
                      src={studio.image}
                      alt={studio.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold">Elite</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-bold red-glow">{studio.name}</h3>
                    <p className="text-sm text-primary italic">{studio.tagline}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {studio.location}
                    </p>
                    <p className="text-sm text-foreground">{studio.specialty}</p>
                    <Link to="/browse">
                      <Button className="w-full mt-4 group">
                        Connect Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Artist Spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold mb-8">Rising Stars</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Aisha Rao",
                role: "AI VFX Pioneer",
                location: "Mumbai, India",
                specialty: "Revolutionizing Particle Simulations",
                image: artistCyber
              },
              {
                name: "Marcus Chen",
                role: "Character Technical Director",
                location: "Singapore",
                specialty: "Photorealistic Facial Rigs"
              },
              {
                name: "Sofia Martinez",
                role: "Compositing Artist",
                location: "Barcelona, Spain",
                specialty: "Cinematic Color Grading"
              }
            ].map((artist, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 border-primary/30 hover:border-primary/60 transition-colors">
                  {artist.image && (
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/50">
                      <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h4 className="font-bold text-lg mb-1">{artist.name}</h4>
                  <p className="text-primary text-sm mb-2">{artist.role}</p>
                  <p className="text-xs text-muted-foreground mb-3">{artist.location}</p>
                  <p className="text-sm italic">{artist.specialty}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-darker-grey">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold red-glow mb-4">
              Upcoming Events • Hype Timeline
            </h2>
            <p className="text-xl text-muted-foreground">
              Network with visionaries, demo bleeding-edge tech, and co-create the industry's tomorrow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "VFX Summit 2026: Bangalore",
                tagline: "Where AI Meets Mandala Magic",
                dates: "March 15-17, 2026",
                type: "In-Person Conference"
              },
              {
                name: "Global Animation Convergence",
                tagline: "Crossing Dimensions",
                dates: "Nov 10-12, 2025",
                type: "Virtual Event"
              },
              {
                name: "Pikxora AI Hackathon",
                tagline: "Forge the Next VFX Frontier",
                dates: "February 2026",
                type: "India Edition"
              }
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-6 border-primary/30 hover:border-primary transition-colors h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-xs text-primary font-semibold uppercase">{event.type}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                  <p className="text-sm text-primary italic mb-3">{event.tagline}</p>
                  <p className="text-sm text-muted-foreground mb-4">{event.dates}</p>
                  <Button variant="outline" size="sm" className="w-full border-primary/50">
                    <Rocket className="mr-2 h-4 w-4" />
                    Secure Your Spot
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Industry News */}
      <section className="py-24 px-4 bg-gradient-to-b from-darker-grey to-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold red-glow mb-4">
              Latest Industry Pulse
            </h2>
            <p className="text-xl text-muted-foreground">
              Stay ahead of the VFX revolution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                headline: "Adobe's New AI Upscaler Shatters Render Times",
                teaser: "How Pikxora Members Are Leading the Charge",
                category: "Technology"
              },
              {
                headline: "Indian Studio Wins Oscar Nod for VFX",
                teaser: "Spotlight on Hyderabad's Hidden Gems",
                category: "Awards"
              },
              {
                headline: "Global Talent Shortage? Not Anymore.",
                teaser: "Pikxora's Empowerment Initiative Bridges the Gap with Free Upskilling",
                category: "Education"
              },
              {
                headline: "Welfare Win: New Union Pushes for AI-Ethics",
                teaser: "Join the Conversation on Responsible Innovation",
                category: "Community"
              }
            ].map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <Card className="p-6 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Newspaper className="h-4 w-4 text-primary" />
                    <span className="text-xs text-primary font-semibold uppercase">{news.category}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{news.headline}</h3>
                  <p className="text-sm text-muted-foreground">{news.teaser}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="border-primary/50">
              <Newspaper className="mr-2 h-5 w-5" />
              Dive Deeper into News Hub
            </Button>
          </div>
        </div>
      </section>

      {/* AI Revolution Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-darker-grey relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={aiNeural} alt="AI Neural Network" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold red-glow-intense mb-6">
              AI: The Cosmic Catalyst Reshaping VFX
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              Harness It with Pikxora
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg leading-relaxed text-foreground/90">
                From generative neural networks birthing impossible worlds to predictive tools empowering solo artists, 
                AI isn't replacing creators—<span className="text-primary font-semibold">it's amplifying Indian innovation on the global stage</span>.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                At Pikxora, explore ethical AI integrations, case studies from Mumbai to Hollywood, and welfare safeguards 
                against job displacement. Our platform champions responsible AI adoption that enhances human creativity rather than replacing it.
              </p>
              <div className="space-y-3">
                {[
                  "Real-Time Deepfakes & Virtual Humans (2025)",
                  "AI-Assisted Scene Composition (2026)",
                  "Sentient Simulation Environments (2030)"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Explore AI Tools
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden border border-primary/30">
                <img
                  src={aiNeural}
                  alt="AI Neural Network Visualization"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Global Creators", icon: Users },
              { value: "50+", label: "Countries", icon: Globe },
              { value: "500+", label: "Elite Studios", icon: Award },
              { value: "1M+", label: "Projects Shared", icon: Sparkles }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-10 w-10 text-primary mx-auto mb-4 drop-shadow-[0_0_10px_hsl(var(--primary))]" />
                <h3 className="text-4xl font-bold red-glow mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-gradient-to-b from-darker-grey via-black to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={eventFuture} alt="Future Event" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold red-glow-intense mb-6">
              In Pikxora, Every Pixel Pulses with Purpose
            </h2>
            <p className="text-2xl md:text-3xl font-light mb-8">
              <span className="text-primary">Crafted in India</span> • <span className="text-foreground">Conquering the Cosmos</span>
            </p>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Join the revolution where creativity meets technology, tradition embraces innovation, 
              and every artist finds their voice in the global VFX symphony.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-10 py-7 border-red-glow-intense group">
                  <Rocket className="mr-2 h-6 w-6 group-hover:animate-pulse" />
                  Launch Your Journey
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-primary/50">
                  <Globe className="mr-2 h-6 w-6" />
                  Explore the Universe
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-primary/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold red-glow mb-4">PIKXORA</h3>
              <p className="text-sm text-muted-foreground">
                The global community platform empowering VFX studios and artists worldwide. 
                Proudly crafted in India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Stay Synced to the Future</h4>
              <div className="flex gap-4">
                <Shield className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Globe className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Users className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Terms of Service</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Community Guidelines</p>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-primary/10">
            <p>© 2025 Pikxora. All rights reserved. Made with ❤️ in India for the World.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;