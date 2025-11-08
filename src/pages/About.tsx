import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Award, Heart, Users, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-luxury-burgundy to-luxury-charcoal">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-4">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Crafting timeless elegance in traditional Indian menswear since 2010
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-6">
            At KK Outfit, we believe that traditional Indian attire is not just clothing—it's
            an expression of culture, heritage, and personal style. Our mission is to preserve
            the artistry of traditional craftsmanship while making it accessible to the modern man.
          </p>
          <p className="text-lg text-muted-foreground">
            Each piece in our collection is carefully curated and crafted by skilled artisans
            who have perfected their craft over generations. We're committed to delivering
            exceptional quality, authentic designs, and unparalleled customer service.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-luxury-cream py-16 md:py-20">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl mb-2">Quality First</h3>
              <p className="text-muted-foreground">
                We never compromise on the quality of fabrics and craftsmanship
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl mb-2">Authenticity</h3>
              <p className="text-muted-foreground">
                Every piece reflects genuine Indian craftsmanship and tradition
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl mb-2">Customer Focus</h3>
              <p className="text-muted-foreground">
                Your satisfaction and style goals are our top priority
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Blending traditional designs with contemporary fashion trends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="container px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Master Craftsmanship
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Our artisans bring decades of experience in traditional Indian garment making.
              From intricate embroidery to precise tailoring, every detail is executed with
              expertise and care.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              We work exclusively with premium fabrics sourced from renowned textile centers
              across India. Each garment undergoes rigorous quality checks to ensure it meets
              our exacting standards.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether it's a wedding sherwani or a casual kurta, we treat every piece as a
              work of art that you'll treasure for years to come.
            </p>
          </div>
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-burgundy/20 to-luxury-charcoal/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-6xl font-serif font-bold text-muted-foreground/20">
                Craftsmanship
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">14+</div>
              <div className="text-sm md:text-base opacity-90">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-sm md:text-base opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-sm md:text-base opacity-90">Unique Designs</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-sm md:text-base opacity-90">Master Artisans</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
