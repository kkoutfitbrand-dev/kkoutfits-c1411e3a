import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import popupArtwork from "@/assets/big-sale-popup.webp";

export const BigSaleEntryPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground/75 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Big Sale offer"
    >
      <div className="relative flex max-h-[94dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-lg bg-foreground shadow-2xl">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={closePopup}
          className="absolute right-2 top-2 z-10 h-9 w-9 rounded-full shadow-lg"
          aria-label="Close sale offer"
          title="Close"
        >
          <X className="h-5 w-5" />
        </Button>

        <img
          src={popupArtwork}
          alt="KK Outfits Big Sale — up to 50% off"
          className="min-h-0 w-full flex-1 object-contain"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={768}
          height={1536}
        />

        <div className="shrink-0 p-3 sm:p-4">
          <Button asChild size="lg" className="w-full font-bold" onClick={closePopup}>
            <Link to="/sale">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};