import { useState, useEffect } from "react";
import { X, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters")
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" }
  });

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

  const onSubmit = async (data: NewsletterFormData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast({
      title: "Welcome to KK OUTFIT!",
      description: "Check your email for a 10% discount code.",
    });
    localStorage.setItem("newsletter-popup-seen", "true");
    setIsOpen(false);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              className="w-full"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
