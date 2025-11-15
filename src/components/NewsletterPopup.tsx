import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("newsletter-popup-seen");
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (dontShowAgain = false) => {
    setIsOpen(false);
    if (dontShowAgain) {
      localStorage.setItem("newsletter-popup-seen", "true");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Welcome to KK OUTFIT!",
        description: "Check your email for a 10% discount code.",
      });
      localStorage.setItem("newsletter-popup-seen", "true");
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-background rounded-lg shadow-lg max-w-md w-full p-6 md:p-8 animate-in zoom-in-95 duration-300">
        <button
          onClick={() => handleClose(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
            Get 10% OFF
          </h2>
          <p className="text-muted-foreground">
            Subscribe to our newsletter and receive exclusive offers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Button type="submit" className="w-full" size="lg">
            Subscribe & Get 10% OFF
          </Button>
        </form>

        <button
          onClick={() => handleClose(true)}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Don't show this again
        </button>
      </div>
    </div>
  );
};
