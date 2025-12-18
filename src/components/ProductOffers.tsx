import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const offers = [
  {
    id: 1,
    title: "10% Instant Discount",
    description: "Get 10% instant discount on HDFC Bank Credit Cards",
    code: "HDFC10",
  },
  {
    id: 2,
    title: "Flat ₹200 Off",
    description: "Flat ₹200 off on orders above ₹1999",
    code: "SAVE200",
  },
  {
    id: 3,
    title: "Buy 2 Get 5% Off",
    description: "Buy 2 or more items and get 5% off",
    code: "BUY2GET5",
  },
  {
    id: 4,
    title: "Free Shipping",
    description: "Free shipping on all orders",
    code: null,
  },
];

export const ProductOffers = () => {
  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const displayedOffers = expanded ? offers : offers.slice(0, 2);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Tag className="h-4 w-4" />
        <span>Available Offers</span>
      </div>

      <div className="space-y-3">
        {displayedOffers.map((offer) => (
          <div key={offer.id} className="flex gap-3 text-sm">
            <Badge variant="secondary" className="h-fit mt-0.5">
              {offer.code ? "CODE" : "OFFER"}
            </Badge>
            <div className="flex-1 space-y-1">
              <p className="font-medium">{offer.title}</p>
              <p className="text-muted-foreground text-xs">{offer.description}</p>
              {offer.code && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => copyCode(offer.code!)}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      {offer.code}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {offers.length > 2 && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="h-auto p-0 text-primary"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              View All {offers.length} Offers <ChevronDown className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};
