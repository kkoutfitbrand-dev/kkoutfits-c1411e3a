import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CreditCard, Smartphone, Building2, Wallet, Shield, CheckCircle } from "lucide-react";

const paymentMethods = [
  {
    icon: CreditCard,
    title: "Credit & Debit Cards",
    description: "All major cards accepted",
    items: ["Visa", "Mastercard", "American Express", "RuPay"]
  },
  {
    icon: Smartphone,
    title: "UPI Payments",
    description: "Instant and secure",
    items: ["Google Pay", "PhonePe", "Paytm", "BHIM UPI"]
  },
  {
    icon: Building2,
    title: "Net Banking",
    description: "All major banks supported",
    items: ["HDFC", "ICICI", "SBI", "Axis", "& 50+ more"]
  },
  {
    icon: Wallet,
    title: "Digital Wallets",
    description: "Quick checkout",
    items: ["Paytm Wallet", "Amazon Pay", "Mobikwik", "Freecharge"]
  }
];

const securityFeatures = [
  "256-bit SSL encryption",
  "PCI DSS compliant",
  "3D Secure authentication",
  "Fraud detection system",
  "Secure payment gateways",
  "No card data stored"
];

const PaymentOptions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
              Payment Options
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
              Multiple secure payment methods for your convenience
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <ScrollReveal key={method.title} delay={index * 0.1}>
                <div className="bg-card p-8 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{method.title}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {method.items.map((item) => (
                      <span
                        key={item}
                        className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Options */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-semibold text-center mb-8">
                Easy EMI Options
              </h2>
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">3 Months</div>
                    <p className="text-muted-foreground">No Cost EMI available</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">6 Months</div>
                    <p className="text-muted-foreground">Low interest rates</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">12 Months</div>
                    <p className="text-muted-foreground">Flexible payments</p>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-6">
                  *EMI available on orders above ₹3,000. Terms and conditions apply.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Security */}
      <section className="py-16">
        <div className="container px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Shield className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-serif font-semibold">
                  Secure Payments
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {securityFeatures.map((feature, index) => (
                  <ScrollReveal key={feature} delay={index * 0.05}>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* COD */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                Cash on Delivery
              </h2>
              <p className="text-muted-foreground mb-4">
                Prefer to pay in cash? We offer Cash on Delivery for orders up to ₹25,000
                across India. A nominal COD fee of ₹49 applies.
              </p>
              <p className="text-sm text-muted-foreground">
                *COD availability depends on your delivery location
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentOptions;
