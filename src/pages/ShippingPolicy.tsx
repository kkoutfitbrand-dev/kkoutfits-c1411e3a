import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Truck, Clock, MapPin, Package, Shield, Phone } from "lucide-react";

const shippingInfo = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on all orders across India"
  },
  {
    icon: Clock,
    title: "Delivery Time",
    description: "Standard delivery within 5-7 business days"
  },
  {
    icon: MapPin,
    title: "Pan India Coverage",
    description: "We deliver to all pin codes across India"
  },
  {
    icon: Package,
    title: "Express Delivery",
    description: "Get your order in 2-3 days with express shipping"
  },
  {
    icon: Shield,
    title: "Secure Packaging",
    description: "All items are carefully packaged for safe delivery"
  },
  {
    icon: Phone,
    title: "Track Your Order",
    description: "Real-time tracking available for all shipments"
  }
];

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
              Shipping Policy
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
              Fast, reliable, and secure delivery to your doorstep
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingInfo.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.1}>
                <div className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Policy */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 max-w-4xl">
          <ScrollReveal>
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <h2 className="text-2xl font-serif font-semibold mb-4">Shipping Rates</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>• All Orders: <span className="text-primary font-medium">FREE Shipping</span></p>
                  <p>• Express Shipping: ₹199 (2-3 business days)</p>
                  <p>• Same Day Delivery: ₹299 (select cities only)</p>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <h2 className="text-2xl font-serif font-semibold mb-4">Delivery Timeline</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Metro Cities: 3-5 business days</p>
                  <p>• Tier 2 Cities: 5-7 business days</p>
                  <p>• Remote Areas: 7-10 business days</p>
                  <p>• International: 10-15 business days</p>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <h2 className="text-2xl font-serif font-semibold mb-4">Important Notes</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>• All orders are processed within 24-48 hours</p>
                  <p>• Tracking details are sent via email and SMS</p>
                  <p>• Delivery times may vary during festive seasons</p>
                  <p>• Contact support for bulk or corporate orders</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;
