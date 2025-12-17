import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RotateCcw, CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ReturnsExchange = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-accent/10 via-background to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent)/0.1),transparent_50%)]" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <RotateCcw className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
              Returns & Exchange
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
              Hassle-free returns within 15 days of delivery
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <ScrollReveal delay={0}>
              <div className="text-center p-6 bg-card rounded-xl border border-border">
                <div className="text-4xl font-bold text-primary mb-2">15</div>
                <p className="text-muted-foreground">Days Return Window</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="text-center p-6 bg-card rounded-xl border border-border">
                <div className="text-4xl font-bold text-primary mb-2">Free</div>
                <p className="text-muted-foreground">Return Pickup</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="text-center p-6 bg-card rounded-xl border border-border">
                <div className="text-4xl font-bold text-primary mb-2">5-7</div>
                <p className="text-muted-foreground">Days Refund Process</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Eligible / Not Eligible */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ScrollReveal direction="left">
              <div className="bg-card p-8 rounded-xl border border-green-500/30 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-semibold">Eligible for Return</h2>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Products with original tags intact
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Unused and unwashed items
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Items in original packaging
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Wrong size or color delivered
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Damaged or defective products
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="bg-card p-8 rounded-xl border border-red-500/30 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl font-semibold">Not Eligible</h2>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-red-500 shrink-0" />
                    Altered or tailored garments
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-red-500 shrink-0" />
                    Items without original tags
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-red-500 shrink-0" />
                    Used or washed products
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-red-500 shrink-0" />
                    Sale or clearance items
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-red-500 shrink-0" />
                    Custom-made orders
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How to Return */}
      <section className="py-16">
        <div className="container px-4 max-w-4xl">
          <ScrollReveal>
            <h2 className="text-3xl font-serif font-semibold text-center mb-12">
              How to Initiate a Return
            </h2>
          </ScrollReveal>
          
          <div className="space-y-6">
            {[
              { step: 1, title: "Login to Your Account", desc: "Go to your orders section and select the item you want to return" },
              { step: 2, title: "Select Return Reason", desc: "Choose the reason for return and provide any additional details" },
              { step: 3, title: "Schedule Pickup", desc: "Select a convenient date and time for our courier to pick up" },
              { step: 4, title: "Pack the Item", desc: "Pack the item in its original packaging with all tags attached" },
              { step: 5, title: "Get Refund", desc: "Refund will be processed within 5-7 business days after inspection" }
            ].map((item, index) => (
              <ScrollReveal key={item.step} delay={index * 0.1}>
                <div className="flex gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.5}>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
                <HelpCircle className="w-5 h-5" />
                Need help with your return?
              </div>
              <div>
                <Button asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReturnsExchange;
