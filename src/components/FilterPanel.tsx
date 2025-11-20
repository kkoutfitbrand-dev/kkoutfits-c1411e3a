import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface FilterPanelProps {
  priceRange: [number, number];
  selectedColors: string[];
  selectedSizes: string[];
  selectedBrands: string[];
  onPriceChange: (range: [number, number]) => void;
  onColorToggle: (color: string) => void;
  onSizeToggle: (size: string) => void;
  onBrandToggle: (brand: string) => void;
  onClearAll: () => void;
  availableColors: string[];
  availableSizes: string[];
  availableBrands: string[];
}

export const FilterPanel = ({
  priceRange,
  selectedColors,
  selectedSizes,
  selectedBrands,
  onPriceChange,
  onColorToggle,
  onSizeToggle,
  onBrandToggle,
  onClearAll,
  availableColors,
  availableSizes,
  availableBrands,
}: FilterPanelProps) => {
  const [openSections, setOpenSections] = useState({
    price: true,
    colors: true,
    sizes: true,
    brands: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const colorMap: Record<string, string> = {
    Red: "bg-red-500",
    Blue: "bg-blue-500",
    Green: "bg-green-500",
    Black: "bg-black",
    White: "bg-white border border-border",
    Yellow: "bg-yellow-400",
    Pink: "bg-pink-500",
    Purple: "bg-purple-500",
    Orange: "bg-orange-500",
    Gray: "bg-gray-500",
  };

  const totalFilters =
    selectedColors.length + selectedSizes.length + selectedBrands.length;

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {totalFilters > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Filters:</span>
          {[...selectedColors, ...selectedSizes, ...selectedBrands].map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  if (selectedColors.includes(filter)) onColorToggle(filter);
                  if (selectedSizes.includes(filter)) onSizeToggle(filter);
                  if (selectedBrands.includes(filter)) onBrandToggle(filter);
                }}
              />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7">
            Clear All
          </Button>
        </div>
      )}

      {/* Price Range */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          <span>Price</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections.price ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceChange(value as [number, number])}
            min={0}
            max={10000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Colors */}
      <Collapsible open={openSections.colors} onOpenChange={() => toggleSection("colors")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          <span>Colors {selectedColors.length > 0 && `(${selectedColors.length})`}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections.colors ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          {availableColors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => onColorToggle(color)}
              />
              <Label
                htmlFor={`color-${color}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className={`w-5 h-5 rounded-full ${colorMap[color] || "bg-gray-300"}`} />
                {color}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Sizes */}
      <Collapsible open={openSections.sizes} onOpenChange={() => toggleSection("sizes")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          <span>Sizes {selectedSizes.length > 0 && `(${selectedSizes.length})`}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections.sizes ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          {availableSizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={() => onSizeToggle(size)}
              />
              <Label htmlFor={`size-${size}`} className="cursor-pointer">
                {size}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Brands */}
      {availableBrands.length > 0 && (
        <Collapsible open={openSections.brands} onOpenChange={() => toggleSection("brands")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
            <span>Brands {selectedBrands.length > 0 && `(${selectedBrands.length})`}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openSections.brands ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            {availableBrands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => onBrandToggle(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
