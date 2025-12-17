import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Shield, Eye, Lock, Database, Bell, UserCheck } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "Personal identification information (name, email, phone number)",
      "Billing and shipping addresses",
      "Payment information (processed securely through payment gateways)",
      "Order history and preferences",
      "Device and browser information for site optimization"
    ]
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "Process and fulfill your orders",
      "Send order confirmations and shipping updates",
      "Provide customer support",
      "Personalize your shopping experience",
      "Send promotional offers (with your consent)"
    ]
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "SSL encryption for all data transmission",
      "Secure payment processing through trusted gateways",
      "Regular security audits and updates",
      "Limited access to personal information",
      "Compliance with industry security standards"
    ]
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: [
      "Access your personal data anytime",
      "Request correction of inaccurate information",
      "Delete your account and associated data",
      "Opt-out of marketing communications",
      "Export your data in a portable format"
    ]
  },
  {
    icon: Bell,
    title: "Cookies & Tracking",
    content: [
      "Essential cookies for site functionality",
      "Analytics cookies to improve user experience",
      "Preference cookies to remember your settings",
      "Marketing cookies (with your consent)",
      "Option to manage cookie preferences"
    ]
  }
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
              Your privacy is important to us. Learn how we protect your data.
            </p>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Last updated: December 2024
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16">
        <div className="container px-4 max-w-4xl">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <ScrollReveal key={section.title} delay={index * 0.1}>
                <div className="bg-card p-8 rounded-xl border border-border hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-serif font-semibold">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about our privacy practices or would like to exercise your rights,
                please contact our privacy team.
              </p>
              <p className="text-muted-foreground">
                Email: <a href="mailto:privacy@kkoutfit.com" className="text-primary hover:underline">privacy@kkoutfit.com</a>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
