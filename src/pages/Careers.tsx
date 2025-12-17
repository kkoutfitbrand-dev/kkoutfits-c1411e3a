import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Briefcase, Users, Heart, Zap, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const benefits = [
  { icon: Heart, title: "Health Insurance", desc: "Comprehensive coverage for you and family" },
  { icon: Zap, title: "Learning Budget", desc: "Annual allowance for skill development" },
  { icon: Users, title: "Team Events", desc: "Regular team outings and celebrations" },
  { icon: Clock, title: "Flexible Hours", desc: "Work-life balance that works for you" }
];

const openings = [
  {
    title: "Fashion Designer",
    department: "Design",
    location: "Mumbai",
    type: "Full-time",
    description: "Create stunning traditional and contemporary designs that resonate with our customers."
  },
  {
    title: "Digital Marketing Manager",
    department: "Marketing",
    location: "Mumbai",
    type: "Full-time",
    description: "Lead our digital marketing initiatives and drive brand awareness across platforms."
  },
  {
    title: "Store Manager",
    department: "Retail",
    location: "Delhi",
    type: "Full-time",
    description: "Manage store operations and deliver exceptional customer experiences."
  },
  {
    title: "Frontend Developer",
    department: "Technology",
    location: "Remote",
    type: "Full-time",
    description: "Build and maintain our e-commerce platform with modern web technologies."
  },
  {
    title: "Customer Support Executive",
    department: "Support",
    location: "Bangalore",
    type: "Full-time",
    description: "Provide exceptional support and resolve customer queries efficiently."
  }
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <Badge variant="outline" className="mb-6">We're Hiring</Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 max-w-3xl">
              Join Our Team & Shape the Future of Fashion
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mb-8">
              Be part of a passionate team dedicated to preserving traditional craftsmanship 
              while embracing modern innovation.
            </p>
            <Button size="lg" className="group">
              View Open Positions
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-serif font-semibold text-center mb-12">
              Why Work With Us
            </h2>
          </ScrollReveal>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title} delay={index * 0.1}>
                <div className="text-center p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-serif font-semibold text-center mb-4">
              Open Positions
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Find your perfect role and start your journey with us
            </p>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto space-y-4">
            {openings.map((job, index) => (
              <ScrollReveal key={job.title} delay={index * 0.1}>
                <div className="group bg-card p-6 rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{job.department}</Badge>
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container px-4">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                Don't See a Perfect Fit?
              </h2>
              <p className="text-muted-foreground mb-6">
                We're always looking for talented individuals. Send us your resume and 
                we'll keep you in mind for future opportunities.
              </p>
              <Button variant="outline" size="lg">
                Send Your Resume
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
