import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Leaf, Recycle, Heart, Globe, Droplets, Factory } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const initiatives = [
  {
    icon: Leaf,
    title: "Eco-Friendly Fabrics",
    description: "We use organic cotton, bamboo silk, and other sustainable materials in our collections.",
    progress: 75
  },
  {
    icon: Recycle,
    title: "Zero Waste Production",
    description: "Our cutting techniques minimize fabric waste, and scraps are repurposed into accessories.",
    progress: 60
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description: "Advanced dyeing processes that use 50% less water than traditional methods.",
    progress: 50
  },
  {
    icon: Factory,
    title: "Ethical Manufacturing",
    description: "Fair wages, safe working conditions, and no child labor in our supply chain.",
    progress: 100
  }
];

const stats = [
  { value: "50%", label: "Less Water Usage" },
  { value: "30%", label: "Recycled Packaging" },
  { value: "100%", label: "Ethical Sourcing" },
  { value: "5000+", label: "Artisans Supported" }
];

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-green-500/10 via-background to-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(142_76%_36%/0.1),transparent_50%)]" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <Globe className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-6">
              Fashion with a Conscience
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
              We're committed to sustainable practices that honor both traditional craftsmanship 
              and our planet's future.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <div className="text-center p-6">
                  <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-16">
        <div className="container px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-serif font-semibold text-center mb-12">
              Our Sustainability Initiatives
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {initiatives.map((initiative, index) => (
              <ScrollReveal key={initiative.title} delay={index * 0.1}>
                <div className="bg-card p-8 rounded-xl border border-border hover:border-green-500/50 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <initiative.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{initiative.title}</h3>
                      <p className="text-muted-foreground text-sm">{initiative.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-green-600">{initiative.progress}%</span>
                    </div>
                    <Progress value={initiative.progress} className="h-2 [&>div]:bg-green-500" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Support */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Heart className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-3xl font-serif font-semibold mb-4">
                    Supporting Artisan Communities
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Every purchase helps sustain traditional weaving and embroidery techniques 
                    passed down through generations. We work directly with over 5,000 artisans 
                    across India, ensuring fair compensation and preserving invaluable cultural heritage.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Direct partnerships with artisan cooperatives
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Fair trade certified workshops
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Skills training and education programs
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-primary/20 rounded-2xl p-8 text-center">
                  <div className="text-6xl font-bold text-foreground mb-2">5000+</div>
                  <p className="text-lg text-muted-foreground">Artisans Empowered</p>
                  <div className="mt-6 text-5xl font-bold text-foreground">200+</div>
                  <p className="text-lg text-muted-foreground">Villages Reached</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-16">
        <div className="container px-4">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                Our Commitment to You
              </h2>
              <p className="text-muted-foreground">
                We're on a journey to become fully sustainable by 2030. Every step we take 
                brings us closer to a future where fashion and environmental responsibility 
                go hand in hand. Thank you for being part of this journey.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sustainability;
