import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import popupArtworkAsset from "@/assets/big-sale-responsive.webp.asset.json";

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
      <div className="relative w-full max-w-5xl overflow-hidden rounded-md bg-foreground shadow-2xl">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={closePopup}
          className="absolute right-2 top-2 z-10 h-9 w-9 rounded-full shadow-lg sm:right-3 sm:top-3"
          aria-label="Close sale offer"
          title="Close"
        >
          <X className="h-5 w-5" />
        </Button>

        <Link to="/sale" onClick={closePopup} aria-label="Shop the Big Sale">
          <img
            src={popupArtworkAsset.url}
            alt="KK Outfits Big Sale — up to 50% off"
            className="block aspect-[2/1] h-auto w-full object-contain"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1774}
            height={887}
          />
        </Link>
      </div>
    </div>,
    document.body
  );
};