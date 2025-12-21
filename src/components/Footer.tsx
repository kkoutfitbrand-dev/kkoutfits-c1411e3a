import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const footerLinks = {
  "Shop": [{
    label: "Sarees",
    path: "/category/sarees"
  }, {
    label: "Lehengas",
    path: "/category/lehengas"
  }, {
    label: "Kurtas",
    path: "/category/kurtas"
  }, {
    label: "Sherwani",
    path: "/category/sherwani"
  }, {
    label: "Salwar Kameez",
    path: "/category/salwar-kameez"
  }, {
    label: "Bandhgala",
    path: "/category/bandhgala"
  }],
  "Customer Care": [{
    label: "Contact Us",
    path: "/contact"
  }, {
    label: "Shipping Policy",
    path: "/shipping-policy"
  }, {
    label: "Returns & Exchange",
    path: "/returns-exchange"
  }, {
    label: "Refund Policy",
    path: "/refund-policy"
  }, {
    label: "Size Guide",
    path: "/size-guide"
  }],
  "About": [{
    label: "Our Story",
    path: "/about"
  }, {
    label: "Sustainability",
    path: "/sustainability"
  }, {
    label: "Store Locator",
    path: "/store-locator"
  }],
  "Legal": [{
    label: "Privacy Policy",
    path: "/privacy-policy"
  }, {
    label: "Terms & Conditions",
    path: "/terms-conditions"
  }, {
    label: "FAQ",
    path: "/faq"
  }, {
    label: "Payment Options",
    path: "/payment-options"
  }]
};
export const Footer = () => {
  return <footer className="bg-muted mt-16">
      <div className="container px-4 py-12">
        {/* Newsletter */}
        <div className="border-b border-border pb-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-serif font-semibold mb-2">
              Subscribe to our Newsletter
            </h3>
            <p className="text-muted-foreground mb-4">
              Get exclusive access to new collections and special offers
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-background" />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {Object.entries(footerLinks).map(([title, links]) => <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => <li key={link.label}>
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hover:text-accent">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-accent">
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-accent">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-accent">
              <Youtube className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 KKOUTFITS. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};