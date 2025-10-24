import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Star, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-vfx.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="VFX Hero"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold red-glow-intense"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              PIKXORA
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              The Global Network for VFX & Animation Excellence
            </motion.p>

            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Connect studios, artists, and investors worldwide. Showcase your work,
              discover talent, and collaborate across borders.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6 border-red-glow-intense">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Browse Talent
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold red-glow mb-4">
              Why PIKXORA?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The premier platform for global VFX and animation networking
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Reach",
                description: "Connect with studios and artists across continents, breaking geographical barriers"
              },
              {
                icon: Star,
                title: "Quality Ratings",
                description: "Elite rating system highlights top-tier studios with verified badges"
              },
              {
                icon: Users,
                title: "Association Network",
                description: "Link with industry associations like TVAGA, SIGGRAPH, VES, and more"
              },
              {
                icon: Zap,
                title: "Sophisticated Walls",
                description: "Create stunning interactive portfolios with advanced customization"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-red-glow rounded-lg hover-lift"
                whileHover={{ borderColor: "hsl(var(--red-glow))" }}
              >
                <feature.icon className="h-12 w-12 text-primary mb-4 drop-shadow-[0_0_10px_hsl(var(--red-glow))]" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-darker-grey">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold red-glow-intense">
              Ready to Go Global?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the world's most sophisticated VFX and animation networking platform
            </p>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6 border-red-glow-intense">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
