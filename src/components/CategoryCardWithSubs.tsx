import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface CategoryCardWithSubsProps {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  subcategories: Subcategory[];
}

export const CategoryCardWithSubs = ({ 
  name, 
  slug, 
  image_url, 
  subcategories 
}: CategoryCardWithSubsProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/category/${slug}`} 
        className="block relative overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      >
        <div className="aspect-square overflow-hidden">
          {image_url ? (
            <img 
              src={image_url} 
              alt={name} 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-lg font-medium">{name.charAt(0)}</span>
            </div>
          )}
        </div>
        {/* Elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-all duration-300" />
        {/* Professional text with border accent */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-widest">
              {name}
            </h3>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
              {subcategories.length > 0 ? (
                <ChevronDown className={`w-3 h-3 text-white transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
              ) : (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </span>
          </div>
        </div>
      </Link>

      {/* Subcategories Dropdown */}
      {subcategories.length > 0 && (
        <div 
          className={`absolute left-0 right-0 top-full z-50 mt-1 bg-card rounded-lg shadow-xl border border-border overflow-hidden transition-all duration-300 ${
            isHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="py-2 max-h-48 overflow-y-auto">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/category/${sub.slug}`}
                className="block px-4 py-2 text-sm text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
          <Link
            to={`/category/${slug}`}
            className="block px-4 py-2 text-sm font-medium text-accent border-t border-border hover:bg-accent/5 transition-colors"
          >
            View All {name} →
          </Link>
        </div>
      )}
    </div>
  );
};
