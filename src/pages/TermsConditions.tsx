import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FileText, Scale, ShoppingBag, CreditCard, Truck, AlertTriangle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const terms = [{
  icon: ShoppingBag,
  title: "Products & Orders",
  content: `All products displayed on our website are subject to availability. We reserve the right to limit quantities and discontinue products without notice. Product images are for illustration purposes; actual products may vary slightly. Prices are subject to change without prior notice. Orders are confirmed only after successful payment processing.`
}, {
  icon: CreditCard,
  title: "Payment Terms",
  content: `We accept all major credit/debit cards, UPI, net banking, and wallet payments. All payments are processed through secure payment gateways. Prices displayed include applicable taxes unless stated otherwise. We do not store your complete payment information on our servers.`
}, {
  icon: Truck,
  title: "Shipping & Delivery",
  content: `We ship to all serviceable pin codes across India. Delivery timelines are estimates and may vary based on location and other factors. Risk of loss passes to you upon delivery. We are not responsible for delays caused by circumstances beyond our control.`
}, {
  icon: Scale,
  title: "Intellectual Property",
  content: `All content on this website, including text, graphics, logos, images, and software, is the property of KK Outfit and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.`
}, {
  icon: AlertTriangle,
  title: "Limitation of Liability",
  content: `KK Outfit shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the specific product giving rise to the claim.`
}];
const TermsConditions = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-accent/10 via-background to-primary/5 overflow-hidden">
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-muted-foreground text-center mt-4">Effective Date: December 2025</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container px-4 max-w-4xl">
          <ScrollReveal>
            <div className="bg-card p-8 rounded-xl border border-border">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to KK Outfit. By accessing and using our website, you agree to be bound by these 
                Terms and Conditions. If you do not agree to these terms, please do not use our services. 
                We reserve the right to modify these terms at any time, and your continued use of the 
                website constitutes acceptance of any changes.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Terms Accordion */}
      <section className="py-12">
        <div className="container px-4 max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {terms.map((term, index) => <ScrollReveal key={term.title} delay={index * 0.1}>
                <AccordionItem value={`item-${index}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <term.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-left">{term.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                    {term.content}
                  </AccordionContent>
                </AccordionItem>
              </ScrollReveal>)}
          </Accordion>
        </div>
      </section>

      {/* Additional Terms */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 max-w-4xl">
          <ScrollReveal>
            <div className="space-y-6">
              <div className="bg-card p-8 rounded-xl border border-border">
                <h3 className="text-xl font-semibold mb-4">Governing Law</h3>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance with the laws of India. 
                  Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Mumbai.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl border border-border">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <p className="text-muted-foreground">
                  For any questions regarding these terms, please contact us at{" "}
                  <a href="mailto:legal@kkoutfit.com" className="text-primary hover:underline">
                    legal@kkoutfit.com
                  </a>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>;
};
export default TermsConditions;