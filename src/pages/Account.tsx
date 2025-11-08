import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MapPin, Heart, User } from "lucide-react";

const Account = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">My Account</h1>
        
        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">My Orders</h2>
              
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold">Order #KK12345</p>
                      <p className="text-sm text-muted-foreground">Placed on 15 Nov 2024</p>
                    </div>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                      Delivered
                    </span>
                  </div>
                  <p className="text-sm mb-2">Cream Embroidered Kurta Pajama Set</p>
                  <p className="font-semibold mb-4">₹5,999</p>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold">Order #KK12344</p>
                      <p className="text-sm text-muted-foreground">Placed on 10 Nov 2024</p>
                    </div>
                    <span className="px-3 py-1 bg-secondary/20 text-secondary-foreground text-sm font-medium rounded-full">
                      In Transit
                    </span>
                  </div>
                  <p className="text-sm mb-2">Burgundy Velvet Bandhgala Jacket</p>
                  <p className="font-semibold mb-4">₹12,999</p>
                  <Button variant="outline" size="sm">Track Order</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Profile Information</h2>
              <form className="space-y-6 max-w-2xl">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" className="mt-2" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" className="mt-2" />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+91 98765 43210" className="mt-2" />
                </div>
                
                <Button>Save Changes</Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="addresses">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold">Saved Addresses</h2>
                <Button>Add New Address</Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Home</h3>
                    <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                      Default
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    123 Street Name<br />
                    City Name, State - 123456<br />
                    Phone: +91 98765 43210
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Delete</Button>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Office</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    456 Business Park<br />
                    City Name, State - 654321<br />
                    Phone: +91 98765 43210
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">My Wishlist</h2>
              <p className="text-muted-foreground">
                View and manage your wishlist items. <a href="/wishlist" className="text-accent hover:underline">Go to Wishlist →</a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
