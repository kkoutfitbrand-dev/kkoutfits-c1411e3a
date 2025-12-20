import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MapPin, Phone, Clock, Navigation as NavigationIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const store = {
  name: "KK Outfit",
  address: "Your Store Address, City - Pincode",
  phone: "+91 98765 43210",
  hours: "10:00 AM - 9:00 PM (All Days)",
  mapUrl: "https://www.google.com/maps/place//data=!4m2!3m1!1s0x3bad2500097992a1:0x1ab8b329143f9b2b",
  embedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15551.0!2d0!3d0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad2500097992a1%3A0x1ab8b329143f9b2b!2z!5e0!3m2!1sen!2sin!4v1"
};

const StoreLocator = () => {
  const handleGetDirections = () => {
    window.open(store.mapUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
              Visit Our Store
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
              Experience our exclusive collection in person
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Store Details & Map */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Store Info Card */}
              <ScrollReveal>
                <div className="bg-card p-8 rounded-xl border border-border h-full">
                  <h2 className="text-2xl font-serif font-bold mb-6">{store.name}</h2>
                  
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Address</h3>
                        <p className="text-muted-foreground">{store.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Phone</h3>
                        <a 
                          href={`tel:${store.phone}`} 
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {store.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Store Hours</h3>
                        <p className="text-muted-foreground">{store.hours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      onClick={handleGetDirections}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      size="lg"
                    >
                      <NavigationIcon className="w-5 h-5 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Google Map */}
              <ScrollReveal delay={0.1}>
                <div className="bg-card rounded-xl border border-border overflow-hidden h-full min-h-[400px]">
                  <iframe
                    src={store.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Store Location"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoreLocator;
