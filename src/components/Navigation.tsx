import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const categories = [
  "Sarees",
  "Lehengas",
  "Salwar Kameez",
  "Indo Western",
  "Blouses",
  "Bridal",
  "Jewellery",
  "New Arrivals",
  "Sale",
];

export const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="container flex h-10 items-center justify-center px-4 text-sm">
          <p>Styled more than 100,000+ Clients | Free Shipping on Orders Above ₹999</p>
        </div>
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
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase().replace(" ", "-")}`}
                  className="text-lg font-medium hover:text-accent transition-colors"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-3xl font-serif font-bold tracking-wider">
            KK OUTFIT
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase().replace(" ", "-")}`}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {category}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for Sarees..."
                className="w-[300px] pl-9"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5 md:hidden" />
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

      {/* Secondary Navigation */}
      <div className="border-t border-border hidden lg:block">
        <div className="container flex h-12 items-center justify-center gap-8 px-4">
          {categories.slice(5).map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase().replace(" ", "-")}`}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};
