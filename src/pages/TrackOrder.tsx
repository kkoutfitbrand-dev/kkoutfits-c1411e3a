import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Truck, CheckCircle2, MapPin } from "lucide-react";
import { useState } from "react";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTracking(true);
  };

  const trackingSteps = [
    { label: "Order Placed", date: "15 Nov 2024, 10:30 AM", completed: true, icon: CheckCircle2 },
    { label: "Processing", date: "15 Nov 2024, 2:15 PM", completed: true, icon: Package },
    { label: "Shipped", date: "16 Nov 2024, 9:00 AM", completed: true, icon: Truck },
    { label: "Out for Delivery", date: "18 Nov 2024, 8:00 AM", completed: false, icon: MapPin },
    { label: "Delivered", date: "Expected: 18 Nov 2024", completed: false, icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">Track Your Order</h1>
        
        {!showTracking ? (
          <div className="max-w-md mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <form onSubmit={handleTrack} className="space-y-6">
                <div>
                  <Label htmlFor="orderId">Order ID *</Label>
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g., KK12345"
                    required
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email or Phone *</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="mt-2"
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  Track Order
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Order Info */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif font-bold mb-2">Order #KK12345</h2>
                  <p className="text-muted-foreground">Placed on 15 Nov 2024</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="px-4 py-2 bg-secondary/20 text-secondary-foreground font-medium rounded-full">
                    In Transit
                  </span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-sm text-muted-foreground">
                    John Doe<br />
                    123 Street Name, City Name<br />
                    State - 123456<br />
                    Phone: +91 98765 43210
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Courier Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Provider: BlueDart<br />
                    Tracking ID: BD123456789<br />
                    Expected: 18 Nov 2024
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-8">Tracking History</h2>
              
              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex gap-4 mb-8 last:mb-0">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {index < trackingSteps.length - 1 && (
                          <div className={`absolute left-6 top-12 w-0.5 h-8 ${
                            step.completed ? "bg-accent" : "bg-border"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className={`font-semibold mb-1 ${step.completed ? "" : "text-muted-foreground"}`}>
                          {step.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setShowTracking(false)}>
                Track Another Order
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
