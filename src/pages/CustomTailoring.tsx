import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Ruler, Palette, Package, Truck } from "lucide-react";

const CustomTailoring = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-luxury-burgundy to-luxury-charcoal">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-4">
            Custom Tailoring
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Experience the luxury of perfectly fitted garments crafted just for you
          </p>
        </div>
      </section>

      {/* Process Section */}
      <section className="container px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <Palette className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-bold text-xl mb-2">1. Select Design</h3>
            <p className="text-muted-foreground">
              Choose from our collection or bring your own design
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <Ruler className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-bold text-xl mb-2">2. Get Measured</h3>
            <p className="text-muted-foreground">
              Visit our store or schedule a home visit for precise measurements
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <Package className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-bold text-xl mb-2">3. Customize</h3>
            <p className="text-muted-foreground">
              Choose fabric, embroidery, buttons, and other details
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <Truck className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-bold text-xl mb-2">4. Delivery</h3>
            <p className="text-muted-foreground">
              Receive your perfectly tailored garment in 15-20 days
            </p>
          </div>
        </div>
      </section>

      {/* Fabric Selection */}
      <section className="bg-luxury-cream py-16 md:py-20">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Premium Fabrics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Silk", "Velvet", "Brocade", "Cotton", "Linen", "Jacquard", "Satin", "Wool"].map(fabric => (
              <div key={fabric} className="bg-card border border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                <h3 className="font-semibold text-lg">{fabric}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="container px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8">
            Book an Appointment
          </h2>
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" required className="mt-2" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" required className="mt-2" />
              </div>
              
              <div>
                <Label htmlFor="garmentType">Garment Type *</Label>
                <Input id="garmentType" placeholder="e.g., Wedding Sherwani" required className="mt-2" />
              </div>
              
              <div>
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <Input id="preferredDate" type="date" required className="mt-2" />
              </div>
              
              <div>
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Tell us about your design preferences, occasion, budget, etc."
                  className="mt-2 min-h-[120px]"
                />
              </div>
              
              <Button type="submit" size="lg" className="w-full">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-muted py-16">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Starting Prices
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-6 text-center">
              <h3 className="text-2xl font-serif font-bold mb-2">Kurta Pajama</h3>
              <p className="text-3xl font-bold text-accent mb-4">₹8,999</p>
              <p className="text-sm text-muted-foreground">Basic customization included</p>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center border-2 border-accent">
              <h3 className="text-2xl font-serif font-bold mb-2">Sherwani</h3>
              <p className="text-3xl font-bold text-accent mb-4">₹29,999</p>
              <p className="text-sm text-muted-foreground">Premium fabrics & embroidery</p>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center">
              <h3 className="text-2xl font-serif font-bold mb-2">Bandhgala</h3>
              <p className="text-3xl font-bold text-accent mb-4">₹18,999</p>
              <p className="text-sm text-muted-foreground">Luxury finish & details</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomTailoring;
