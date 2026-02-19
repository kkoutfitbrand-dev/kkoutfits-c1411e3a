import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  images: string[];
  title: string;
  selectedImage: number;
  onImageChange: (index: number) => void;
}

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds
const MANUAL_PAUSE_DURATION = 10000; // 10 seconds pause after manual interaction

export const ProductImageCarousel = ({
  images,
  title,
  selectedImage,
  onImageChange
}: ProductImageCarouselProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalImages = images.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      const nextIndex = (index % totalImages + totalImages) % totalImages;
      onImageChange(nextIndex);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [totalImages, onImageChange, isTransitioning]
  );

  const goNext = useCallback(() => goToSlide(selectedImage + 1), [goToSlide, selectedImage]);
  const goPrev = useCallback(() => goToSlide(selectedImage - 1), [goToSlide, selectedImage]);

  // Manual interaction pauses auto-slide for 10s
  const handleManualInteraction = useCallback(() => {
    setIsPaused(true);
    setIsZoomed(false);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), MANUAL_PAUSE_DURATION);
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (isPaused || totalImages <= 1) {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
      return;
    }
    autoSlideRef.current = setInterval(goNext, AUTO_SLIDE_INTERVAL);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [isPaused, goNext, totalImages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setTouchDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    setTouchDelta(e.touches[0].clientX - touchStart);
  };

  const handleTouchEnd = () => {
    if (touchStart === null) return;
    if (Math.abs(touchDelta) > 50) {
      handleManualInteraction();
      if (touchDelta > 0) goPrev();else
      goNext();
    }
    setTouchStart(null);
    setTouchDelta(0);
  };

  const handleArrowClick = (direction: "prev" | "next") => {
    handleManualInteraction();
    if (direction === "prev") goPrev();else
    goNext();
  };

  const handleThumbnailClick = (index: number) => {
    handleManualInteraction();
    goToSlide(index);
  };

  const handleDotClick = (index: number) => {
    handleManualInteraction();
    goToSlide(index);
  };

  return (
    <div className="flex flex-col gap-3" id="product-image-gallery">
      {/* Main Image Slider */}
      <div className="relative rounded-xl overflow-hidden bg-muted group">
        {/* Slide container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[3/4] overflow-hidden cursor-zoom-in"
          onClick={() => setIsZoomed(!isZoomed)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>

          <div
            className="flex h-full transition-transform duration-400 ease-in-out"
            style={{
              width: `${totalImages * 100}%`,
              transform: `translateX(calc(-${selectedImage * 100 / totalImages}% + ${touchDelta}px))`,
              transition: touchStart !== null ? "none" : "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)"
            }}>

            {images.map((image, index) =>
            <div
              key={index}
              className="h-full flex-shrink-0"
              style={{ width: `${100 / totalImages}%` }}>

                <img
                src={image}
                alt={`${title} ${index + 1}`}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  isZoomed && selectedImage === index && "scale-150"
                )}
                draggable={false} />

              </div>
            )}
          </div>
        </div>

        {/* Zoom icon */}
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4 text-foreground" />
        </div>

        {/* Arrow buttons */}
        {totalImages > 1 &&
        <>
            






            






          </>
        }

        {/* Dot indicators */}
        {totalImages > 1 &&
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-background/70 backdrop-blur-sm rounded-full px-3 py-1.5">
            {images.map((_, index) =>
          <button
            key={index}
            onClick={(e) => {e.stopPropagation();handleDotClick(index);}}
            className={cn(
              "rounded-full transition-all duration-300",
              selectedImage === index ?
              "w-6 h-2 bg-primary" :
              "w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            )}
            aria-label={`Go to image ${index + 1}`} />

          )}
          </div>
        }

        {/* Image counter */}
        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground">
          {selectedImage + 1} / {totalImages}
        </div>

        {/* Auto-slide indicator */}
        {!isPaused && totalImages > 1 &&
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-muted-foreground/20">
            <div
            className="h-full bg-primary animate-[progress_5s_linear_infinite]"
            key={selectedImage} />

          </div>
        }
      </div>

      {/* Thumbnail strip - vertical on desktop, horizontal scroll on mobile */}
      {totalImages > 1 &&
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide md:grid md:grid-cols-5 lg:grid-cols-6 md:overflow-visible">
          {images.map((image, index) =>
        <button
          key={index}
          onClick={() => handleThumbnailClick(index)}
          className={cn(
            "relative flex-shrink-0 w-16 h-20 md:w-auto md:h-auto rounded-lg overflow-hidden border-2 transition-all duration-200",
            selectedImage === index ?
            "border-primary ring-2 ring-primary/20 scale-[1.03]" :
            "border-border hover:border-muted-foreground/50 opacity-70 hover:opacity-100"
          )}>

              <img
            src={image}
            alt={`${title} thumbnail ${index + 1}`}
            className="w-full aspect-[3/4] object-cover"
            draggable={false} />

              {selectedImage === index &&
          <div className="absolute inset-0 bg-primary/10" />
          }
            </button>
        )}
        </div>
      }
    </div>);

};