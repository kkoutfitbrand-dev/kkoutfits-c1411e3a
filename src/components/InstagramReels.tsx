import { Instagram, Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

// Mock reels data - in production, this would come from Instagram API
const instagramReels = [
  { 
    id: 1, 
    thumbnail: product1, 
    views: "12.4K",
    reelUrl: "https://www.instagram.com/reel/example1",
    caption: "New Arrivals - Wedding Collection 🎊"
  },
  { 
    id: 2, 
    thumbnail: product2, 
    views: "21.8K",
    reelUrl: "https://www.instagram.com/reel/example2",
    caption: "Festival Vibes ✨"
  },
  { 
    id: 3, 
    thumbnail: product3, 
    views: "9.5K",
    reelUrl: "https://www.instagram.com/reel/example3",
    caption: "Traditional Elegance 🌟"
  },
  { 
    id: 4, 
    thumbnail: product4, 
    views: "15.4K",
    reelUrl: "https://www.instagram.com/reel/example4",
    caption: "Party Essentials 🎉"
  },
  { 
    id: 5, 
    thumbnail: product5, 
    views: "32K",
    reelUrl: "https://www.instagram.com/reel/example5",
    caption: "Casual Collection 👔"
  },
  { 
    id: 6, 
    thumbnail: product6, 
    views: "17.8K",
    reelUrl: "https://www.instagram.com/reel/example6",
    caption: "Style Goals 💫"
  },
];

const INSTAGRAM_PROFILE = "https://www.instagram.com/kk_out_fits?igsh=aWt6cGo1b2lxaGN1";

export const InstagramReels = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedReel, setSelectedReel] = useState<typeof instagramReels[0] | null>(null);
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
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleReelClick = (reel: typeof instagramReels[0]) => {
    setSelectedReel(reel);
  };

  const openInInstagram = () => {
    window.open(INSTAGRAM_PROFILE, '_blank');
  };

  return (
    <section className="bg-gradient-to-b from-background to-muted/30 py-12 md:py-16">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold">
              Follow Us on Instagram
            </h2>
          </div>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Watch our latest reels and get inspired by #KKOUTFIT
          </p>
          <Button 
            onClick={openInInstagram}
            className="gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white border-0"
            size="lg"
          >
            <Instagram className="h-5 w-5" />
            @kk_out_fits
          </Button>
        </div>

        {/* Reels Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/90 shadow-lg border border-border hover:bg-muted transition-colors -ml-4 hidden md:flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/90 shadow-lg border border-border hover:bg-muted transition-colors -mr-4 hidden md:flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {instagramReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => handleReelClick(reel)}
                className="flex-shrink-0 w-40 md:w-48 lg:w-56 cursor-pointer group snap-start"
              >
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-muted shadow-lg border border-border">
                  {/* Thumbnail */}
                  <img
                    src={reel.thumbnail}
                    alt={`Instagram reel ${reel.id}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                  
                  {/* Views Count */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm font-medium">
                    <Play className="h-4 w-4 fill-white" />
                    {reel.views}
                  </div>
                  
                  {/* Instagram Icon */}
                  <div className="absolute top-3 right-3">
                    <Instagram className="h-5 w-5 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reel Modal */}
      <Dialog open={!!selectedReel} onOpenChange={() => setSelectedReel(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-black border-0">
          <div className="relative aspect-[9/16] max-h-[80vh]">
            {/* Thumbnail as placeholder */}
            <img
              src={selectedReel?.thumbnail}
              alt={selectedReel?.caption}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">@kk_out_fits</p>
                    <p className="text-white/70 text-sm">{selectedReel?.views} views</p>
                  </div>
                </div>
              </div>
              
              {/* Center Play Button */}
              <div className="flex-1 flex items-center justify-center">
                <Button
                  onClick={openInInstagram}
                  size="lg"
                  className="gap-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white border-0"
                >
                  <Play className="h-6 w-6 fill-white" />
                  Watch on Instagram
                </Button>
              </div>
              
              {/* Caption */}
              <div>
                <p className="text-white text-lg">{selectedReel?.caption}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
