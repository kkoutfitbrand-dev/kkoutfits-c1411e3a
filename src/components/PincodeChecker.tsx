import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Truck } from "lucide-react";
import { toast } from "sonner";

export const PincodeChecker = () => {
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<{
    available: boolean;
    estimatedDays: number;
  } | null>(null);

  const checkDelivery = () => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    // Simulate API call
    const estimatedDays = Math.floor(Math.random() * 5) + 3;
    setDeliveryInfo({ available: true, estimatedDays });
    toast.success("Delivery available!");
  };

  const getEstimatedDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-IN", { 
      weekday: "short", 
      day: "numeric", 
      month: "short" 
    });
  };

  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Truck className="h-4 w-4" />
        <span>Delivery Options</span>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.slice(0, 6))}
            className="pl-9"
            maxLength={6}
          />
        </div>
        <Button onClick={checkDelivery} variant="outline">
          Check
        </Button>
      </div>

      {deliveryInfo?.available && (
        <div className="text-sm space-y-1">
          <p className="text-green-600 font-medium">
            ✓ Delivery by {getEstimatedDate(deliveryInfo.estimatedDays)}
          </p>
          <p className="text-muted-foreground text-xs">
            Free shipping on all orders
          </p>
        </div>
      )}
    </div>
  );
};
