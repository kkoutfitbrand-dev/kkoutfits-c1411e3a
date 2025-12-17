import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MapPin, Phone, Clock, Navigation as NavigationIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const stores = [
  {
    id: 1,
    name: "KK Outfit - Mumbai Flagship",
    address: "123 Linking Road, Bandra West, Mumbai - 400050",
    phone: "+91 22 2640 1234",
    hours: "10:00 AM - 9:00 PM",
    type: "Flagship Store"
  },
  {
    id: 2,
    name: "KK Outfit - Delhi",
    address: "45 South Extension Part 2, New Delhi - 110049",
    phone: "+91 11 4150 5678",
    hours: "10:00 AM - 8:30 PM",
    type: "Experience Store"
  },
  {
    id: 3,
    name: "KK Outfit - Bangalore",
    address: "78 Commercial Street, Bangalore - 560001",
    phone: "+91 80 2558 9012",
    hours: "10:30 AM - 9:00 PM",
    type: "Store"
  },
  {
    id: 4,
    name: "KK Outfit - Kolkata",
    address: "22 Park Street, Kolkata - 700016",
    phone: "+91 33 2249 3456",
    hours: "10:00 AM - 8:00 PM",
    type: "Store"
  },
  {
    id: 5,
    name: "KK Outfit - Chennai",
    address: "156 Anna Salai, Chennai - 600002",
    phone: "+91 44 2852 7890",
    hours: "10:00 AM - 9:00 PM",
    type: "Store"
  },
  {
    id: 6,
    name: "KK Outfit - Hyderabad",
    address: "89 Jubilee Hills, Hyderabad - 500033",
    phone: "+91 40 2355 1234",
    hours: "10:30 AM - 9:00 PM",
    type: "Experience Store"
  }
];

const StoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="container px-4 relative">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
              Find a Store Near You
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg mb-8">
              Visit our stores for an exclusive shopping experience
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by city or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-card"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Store Count */}
      <section className="py-8 border-b border-border">
        <div className="container px-4">
          <p className="text-center text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredStores.length}</span> stores
          </p>
        </div>
      </section>

      {/* Stores List */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredStores.map((store, index) => (
              <ScrollReveal key={store.id} delay={index * 0.1}>
                <div className="group bg-card p-6 rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {store.type}
                      </span>
                      <h3 className="text-lg font-semibold mt-2 group-hover:text-primary transition-colors">
                        {store.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{store.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <a href={`tel:${store.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{store.hours}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <ScrollReveal>
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No stores found</h3>
                <p className="text-muted-foreground">Try searching for a different location</p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-xl border border-border h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoreLocator;
