import { Play, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

// Mock reels data - represents influencer picks with product counts
const influencerReels = [
  { 
    id: 1, 
    thumbnail: product1, 
    views: "1.6L",
    productCount: 4,
    reelUrl: "https://www.instagram.com/reel/DOvNueZEpYB/",
    caption: "Wedding Outfit Glow Up ✨"
  },
  { 
    id: 2, 
    thumbnail: product2, 
    views: "2.1L",
    productCount: 3,
    reelUrl: "https://www.instagram.com/p/DIgh7dBhw6-/",
    caption: "Festival Ready Look 🎊"
  },
  { 
    id: 3, 
    thumbnail: product3, 
    views: "95K",
    productCount: 5,
    reelUrl: "https://www.instagram.com/reel/DOvNueZEpYB/",
    caption: "Traditional Elegance 🌟"
  },
  { 
    id: 4, 
    thumbnail: product4, 
    views: "1.2L",
    productCount: 2,
    reelUrl: "https://www.instagram.com/p/DIgh7dBhw6-/",
    caption: "Party Essentials 🎉"
  },
  { 
    id: 5, 
    thumbnail: product5, 
    views: "3.2L",
    productCount: 4,
    reelUrl: "https://www.instagram.com/reel/DOvNueZEpYB/",
    caption: "Casual Collection 👔"
  },
  { 
    id: 6, 
    thumbnail: product6, 
    views: "1.8L",
    productCount: 3,
    reelUrl: "https://www.instagram.com/p/DIgh7dBhw6-/",
    caption: "Style Goals 💫"
  },
];

const INSTAGRAM_PROFILE = "https://www.instagram.com/kk_out_fits?igsh=aWt6cGo1b2lxaGN1";

export const InstagramReels = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedReel, setSelectedReel] = useState<typeof influencerReels[0] | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleReelClick = (reel: typeof influencerReels[0]) => {
    setSelectedReel(reel);
  };

  const openInInstagram = (url?: string) => {
    window.open(url || INSTAGRAM_PROFILE, '_blank');
  };

  return (
    <section className="bg-gradient-to-b from-pink-50/50 to-background py-10 md:py-14">
      <div className="container px-4">
        {/* Header - Myntra Style */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-emerald-600 underline underline-offset-8 decoration-2">
            Top influencer picks
          </h2>
        </div>

        {/* Reels Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors -ml-5 hidden md:flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors -mr-5 hidden md:flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {influencerReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => handleReelClick(reel)}
                className="flex-shrink-0 w-44 md:w-52 lg:w-60 cursor-pointer group snap-start"
              >
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
                  {/* Thumbnail */}
                  <img
                    src={reel.thumbnail}
                    alt={`Influencer pick ${reel.id}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Top-left: Play icon with view count */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <Play className="h-3.5 w-3.5 text-white fill-white" />
                    <span className="text-white text-xs font-medium">{reel.views}</span>
                  </div>
                  
                  {/* Bottom: Product count badge */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                      <ShoppingBag className="h-4 w-4 text-gray-700" />
                      <span className="text-gray-800 text-sm font-medium">{reel.productCount} Products</span>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reel Modal */}
      <Dialog open={!!selectedReel} onOpenChange={() => setSelectedReel(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden bg-black border-0 rounded-2xl">
          <div className="relative aspect-[9/16] max-h-[85vh]">
            {/* Thumbnail as placeholder */}
            <img
              src={selectedReel?.thumbnail}
              alt={selectedReel?.caption}
              className="w-full h-full object-cover"
            />
            
            {/* Top overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-white fill-white" />
                <span className="text-white text-sm font-medium">{selectedReel?.views}</span>
              </div>
            </div>
            
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={() => openInInstagram(selectedReel?.reelUrl)}
                size="lg"
                className="gap-3 bg-white hover:bg-gray-100 text-gray-900 rounded-full px-6 shadow-xl"
              >
                <Play className="h-5 w-5 fill-gray-900" />
                Watch Reel
              </Button>
            </div>
            
            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white/95 rounded-full px-3 py-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-gray-700" />
                  <span className="text-gray-800 text-xs font-medium">{selectedReel?.productCount} Products</span>
                </div>
                <p className="text-white text-sm">{selectedReel?.caption}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
