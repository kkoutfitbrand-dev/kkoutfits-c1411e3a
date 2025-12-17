import { Search, Heart, ShoppingBag, User, Menu, LogOut, UserCircle, Users, Shirt, Briefcase, Tag, Shield, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CategoryIconSection } from "@/components/CategoryIconSection";
import { MiniCart } from "@/components/MiniCart";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
const categories = ["Shirts", "T-Shirts", "Pants", "Jeans", "Casual Wear", "Formal Wear", "Accessories", "New Arrivals", "Sale"];
const moreLinks = [{
  label: "About Us",
  link: "/about"
}, {
  label: "Contact",
  link: "/contact"
}, {
  label: "Size Guide",
  link: "/size-guide"
}, {
  label: "Custom Tailoring",
  link: "/custom-tailoring"
}, {
  label: "Blog",
  link: "/blog"
}, {
  label: "FAQ",
  link: "/faq"
}, {
  label: "Track Order",
  link: "/track-order"
}];
const mainTabs = [{
  label: "HOME",
  link: "/",
  icon: Home
}, {
  label: "MEN",
  link: "/category/men",
  icon: UserCircle
}, {
  label: "WOMEN",
  link: "/category/women",
  icon: Users
}, {
  label: "CASUAL",
  link: "/category/casual",
  icon: Shirt
}, {
  label: "FORMAL",
  link: "/category/formal",
  icon: Briefcase
}, {
  label: "SALE",
  link: "/sale",
  icon: Tag
}];
export const Navigation = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    isAdmin
  } = useUserRole();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  return <header className="w-full border-b border-border bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-primary text-primary-foreground">
        
      </div>

      {/* Main Navigation */}
      <div className="container flex h-20 items-center justify-between px-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <div className="border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">CATEGORIES</h3>
                {categories.map(category => <Link key={category} to={`/category/${category.toLowerCase().replace(" ", "-")}`} className="block py-2 text-base font-medium hover:text-accent transition-colors">
                    {category}
                  </Link>)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">MORE</h3>
                {moreLinks.map(item => <Link key={item.label} to={item.link} className="block py-2 text-base font-medium hover:text-accent transition-colors">
                    {item.label}
                  </Link>)}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="md:text-xl lg:text-2xl font-serif font-bold tracking-wider text-sm">KK OUTFITS</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {categories.slice(0, 5).map(category => <Link key={category} to={`/category/${category.toLowerCase().replace(" ", "-")}`} className="text-sm font-medium hover:text-accent transition-colors">
              {category}
            </Link>)}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          <Link to="/search">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/wishlist">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">My Account</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>}
                <DropdownMenuItem asChild>
                  <Link to="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <Link to="/auth">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>}
          <MiniCart />
        </div>
      </div>

      {/* Main Category Tabs */}
      <div className="border-t border-border bg-background/40 backdrop-blur-xl">
        <div className="container px-2 md:px-4">
          <div className="flex items-center gap-1 md:gap-2 h-14 md:h-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-1 md:justify-center -mx-2 md:mx-0">
            {mainTabs.map(tab => {
            const Icon = tab.icon;
            return <Link 
              key={tab.label} 
              to={tab.link} 
              className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 snap-center shrink-0 px-3 md:px-5 py-2 md:py-2.5 rounded-full ${
                tab.label === "MEN" 
                  ? "bg-background/90 text-foreground shadow-lg shadow-primary/10 border border-white/30 scale-[1.02]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 md:h-4 md:w-4 transition-all duration-300 ${tab.label === "MEN" ? "scale-110 text-primary" : ""}`} />
              {tab.label}
            </Link>;
          })}
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="container px-4 py-3">
          <div className="max-w-2xl mx-auto relative">
            
            
          </div>
        </div>
      </div>

      {/* Category Icons Section */}
      <CategoryIconSection />
    </header>;
};