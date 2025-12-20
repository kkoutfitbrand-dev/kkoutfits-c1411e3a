import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Wallet, Clock, CreditCard, Banknote, AlertCircle, CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const refundInfo = [
  {
    icon: Clock,
    title: "Processing Time",
    description: "Refunds are processed within 5-7 business days after we receive the returned item."
  },
  {
    icon: CreditCard,
    title: "Original Payment Method",
    description: "Refunds are credited back to your original payment method used during checkout."
  },
  {
    icon: Banknote,
    title: "Bank Processing",
    description: "Additional 3-5 business days may be required for your bank to reflect the refund."
  }
];

const refundMethods = [
  { method: "Credit/Debit Card", timeline: "5-7 business days", description: "Refund credited to the same card" },
  { method: "UPI Payments", timeline: "2-3 business days", description: "Instant refund to linked bank account" },
  { method: "Net Banking", timeline: "5-7 business days", description: "Refund to the source bank account" },
  { method: "Wallet Payments", timeline: "1-2 business days", description: "Refund to the same wallet" },
  { method: "Cash on Delivery", timeline: "7-10 business days", description: "Bank transfer to provided account" }
];

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
              Refund Policy
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
              Transparent and hassle-free refunds for your peace of mind
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {refundInfo.map((info, index) => (
              <ScrollReveal key={info.title} delay={index * 0.1}>
                <div className="text-center p-6 bg-card rounded-xl border border-border h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{info.title}</h3>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Methods & Timeline */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-serif font-semibold text-center mb-12">
              Refund Methods & Timeline
            </h2>
          </ScrollReveal>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {refundMethods.map((item, index) => (
              <ScrollReveal key={item.method} delay={index * 0.1}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.method}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      <Clock className="w-3 h-3" />
                      {item.timeline}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ScrollReveal direction="left">
              <div className="bg-card p-8 rounded-xl border border-green-500/30 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-semibold">Full Refund Eligibility</h2>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Product received is damaged or defective
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Wrong product or size delivered
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Product quality differs from description
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Order cancelled before shipping
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-green-500 shrink-0" />
                    Item returned within 15 days with tags
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="bg-card p-8 rounded-xl border border-orange-500/30 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                  <h2 className="text-xl font-semibold">Partial/No Refund Cases</h2>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-orange-500 shrink-0" />
                    Products with missing original tags
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-orange-500 shrink-0" />
                    Signs of wear, alteration, or washing
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-orange-500 shrink-0" />
                    Return requested after 15 days
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-orange-500 shrink-0" />
                    Sale or discounted items (final sale)
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 text-orange-500 shrink-0" />
                    Custom-made or personalized orders
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Refund Process */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 max-w-4xl">
          <ScrollReveal>
            <h2 className="text-3xl font-serif font-semibold text-center mb-12">
              Refund Process
            </h2>
          </ScrollReveal>
          
          <div className="space-y-6">
            {[
              { step: 1, title: "Return Initiated", desc: "Once you initiate a return request, we'll arrange pickup within 24-48 hours" },
              { step: 2, title: "Item Pickup", desc: "Our courier partner will collect the item from your doorstep" },
              { step: 3, title: "Quality Check", desc: "The returned item undergoes quality inspection at our warehouse" },
              { step: 4, title: "Refund Approved", desc: "Upon successful verification, refund is approved and processed" },
              { step: 5, title: "Amount Credited", desc: "Refund amount is credited to your original payment method" }
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
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16">
        <div className="container px-4 max-w-3xl">
          <ScrollReveal>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Important Notes
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-primary shrink-0" />
                  Shipping charges are non-refundable unless the return is due to our error.
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-primary shrink-0" />
                  Promotional discounts or coupon values are deducted from the refund amount.
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-primary shrink-0" />
                  Refunds for COD orders require valid bank account details.
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-primary shrink-0" />
                  Refund status can be tracked in your account under "My Orders".
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
                <HelpCircle className="w-5 h-5" />
                Questions about your refund?
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

export default RefundPolicy;