import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 5-7 business days across India. Express shipping (available at checkout) takes 2-3 business days. International shipping typically takes 10-15 business days.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all orders above ₹20,000. For orders below this amount, a flat shipping fee of ₹299 applies.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely! Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order by visiting the 'My Orders' section in your account.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return policy for all products. Items must be unused, unwashed, and in original condition with all tags attached. Custom-tailored items cannot be returned.",
      },
      {
        q: "How do I initiate a return?",
        a: "Log into your account, go to 'My Orders', select the order you want to return, and click 'Request Return'. Our team will review and approve your request within 24 hours.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.",
      },
    ],
  },
  {
    category: "Payment & Pricing",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, net banking, mobile wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery (COD) for orders under ₹50,000.",
      },
      {
        q: "Are the prices inclusive of taxes?",
        a: "Yes, all prices displayed on our website are inclusive of GST. There are no hidden charges.",
      },
      {
        q: "Do you offer EMI options?",
        a: "Yes, we offer EMI options on orders above ₹10,000. EMI options are available for 3, 6, and 12 months on all major credit cards.",
      },
    ],
  },
  {
    category: "Products & Sizing",
    questions: [
      {
        q: "How do I find my size?",
        a: "Please refer to our detailed Size Guide page for measurements. If you're still unsure, contact our customer support team, and they'll help you find the perfect fit.",
      },
      {
        q: "Can I request customization?",
        a: "Yes! We offer custom tailoring services for all our garments. You can choose fabrics, add embroidery, modify designs, and get a perfect fit. Visit our Custom Tailoring page to learn more.",
      },
      {
        q: "Are the products handmade?",
        a: "Most of our products feature handcrafted elements, especially embroidery and detailing. Our master artisans use traditional techniques passed down through generations.",
      },
    ],
  },
  {
    category: "Custom Orders",
    questions: [
      {
        q: "How long does custom tailoring take?",
        a: "Custom-tailored garments typically take 15-20 business days from the date of order confirmation and measurement finalization.",
      },
      {
        q: "Can I cancel a custom order?",
        a: "Custom orders can be cancelled within 24 hours of placing the order. After 24 hours, once production has started, cancellation is not possible.",
      },
      {
        q: "What if my custom garment doesn't fit?",
        a: "We offer one free alteration within 30 days of delivery for custom orders. Just bring it to our store or schedule a pickup, and we'll adjust it to fit perfectly.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-luxury-burgundy to-luxury-charcoal py-16 text-primary-foreground">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Find answers to common questions about our products, services, and policies
          </p>
        </div>
      </section>

      <div className="container px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {faqData.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-serif font-bold mb-4">{section.category}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.questions.map((item, qIdx) => (
                  <AccordionItem
                    key={qIdx}
                    value={`${idx}-${qIdx}`}
                    className="bg-card border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="max-w-4xl mx-auto mt-16 text-center bg-luxury-cream rounded-lg p-8">
          <h2 className="text-2xl font-serif font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our customer support team is here to help.
          </p>
          <Link to="/contact">
            <Button size="lg">Contact Us</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
