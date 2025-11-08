import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CategoryIconSection } from "@/components/CategoryIconSection";
const categories = ["Kurtas", "Sherwanis", "Bandhgalas", "Indo Western", "Accessories", "Bridal", "Ethnic Wear", "New Arrivals", "Sale"];
const mainTabs = [{
  label: "MEN",
  link: "/"
}, {
  label: "WOMEN",
  link: "/women"
}, {
  label: "FESTIVE",
  link: "/festive"
}, {
  label: "BRIDAL",
  link: "/bridal"
}, {
  label: "LUXE",
  link: "/luxe"
}];
export const Navigation = () => {
  return <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
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
              {categories.map(category => <Link key={category} to={`/category/${category.toLowerCase().replace(" ", "-")}`} className="text-lg font-medium hover:text-accent transition-colors">
                  {category}
                </Link>)}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-base md:text-xl lg:text-2xl font-serif font-bold tracking-wider">
            KK OUTFIT
          </h1>
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
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-accent text-[10px] font-semibold text-accent-foreground flex items-center justify-center">
              0
            </span>
          </Button>
        </div>
      </div>

      {/* Main Category Tabs */}
      <div className="border-t border-border bg-background">
        <div className="container px-4">
          <div className="flex items-center justify-center md:justify-start gap-4 md:gap-8 h-12 overflow-x-auto scrollbar-hide">
            {mainTabs.map(tab => <Link key={tab.label} to={tab.link} className={`text-sm md:text-base font-medium whitespace-nowrap transition-colors ${tab.label === "MEN" ? "text-foreground border-b-2 border-accent" : "text-muted-foreground hover:text-accent"}`}>
                {tab.label}
              </Link>)}
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="container px-4 py-3">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search for Kurtas, Sherwanis..." className="w-full pl-10" />
          </div>
        </div>
      </div>

      {/* Category Icons Section */}
      <CategoryIconSection />
    </header>;
};