import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Ruler } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type GarmentType = "shirt" | "tshirt" | "pant" | "chudidar";

interface SizeResult {
  size: string;
  fit: string;
}

const sizeCharts = {
  shirt: [
    { size: "S", minChest: 36, maxChest: 38, minShoulder: 15.5, maxShoulder: 16.5 },
    { size: "M", minChest: 38, maxChest: 40, minShoulder: 16.5, maxShoulder: 17.5 },
    { size: "L", minChest: 40, maxChest: 42, minShoulder: 17.5, maxShoulder: 18.5 },
    { size: "XL", minChest: 42, maxChest: 44, minShoulder: 18.5, maxShoulder: 19.5 },
    { size: "XXL", minChest: 44, maxChest: 46, minShoulder: 19.5, maxShoulder: 20.5 },
  ],
  tshirt: [
    { size: "S", minChest: 36, maxChest: 38, minShoulder: 15.5, maxShoulder: 16.5 },
    { size: "M", minChest: 38, maxChest: 40, minShoulder: 16.5, maxShoulder: 17.5 },
    { size: "L", minChest: 40, maxChest: 42, minShoulder: 17.5, maxShoulder: 18.5 },
    { size: "XL", minChest: 42, maxChest: 44, minShoulder: 18.5, maxShoulder: 19.5 },
    { size: "XXL", minChest: 44, maxChest: 46, minShoulder: 19.5, maxShoulder: 20.5 },
  ],
  pant: [
    { size: "28", minWaist: 27, maxWaist: 29, minHip: 35, maxHip: 37 },
    { size: "30", minWaist: 29, maxWaist: 31, minHip: 37, maxHip: 39 },
    { size: "32", minWaist: 31, maxWaist: 33, minHip: 39, maxHip: 41 },
    { size: "34", minWaist: 33, maxWaist: 35, minHip: 41, maxHip: 43 },
    { size: "36", minWaist: 35, maxWaist: 37, minHip: 43, maxHip: 45 },
  ],
  chudidar: [
    { size: "S", minWaist: 25, maxWaist: 28, minHip: 33, maxHip: 36 },
    { size: "M", minWaist: 28, maxWaist: 30, minHip: 36, maxHip: 38 },
    { size: "L", minWaist: 30, maxWaist: 32, minHip: 38, maxHip: 40 },
    { size: "XL", minWaist: 32, maxWaist: 34, minHip: 40, maxHip: 42 },
    { size: "XXL", minWaist: 34, maxWaist: 36, minHip: 42, maxHip: 44 },
  ],
};

export const SizeCalculator = () => {
  const [garmentType, setGarmentType] = useState<GarmentType>("shirt");
  const [chest, setChest] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState<SizeResult | null>(null);

  const isUpperBody = garmentType === "shirt" || garmentType === "tshirt";

  const calculateSize = () => {
    const chart = sizeCharts[garmentType];
    let recommendedSize: SizeResult | null = null;

    if (isUpperBody) {
      const chestVal = parseFloat(chest);
      const shoulderVal = parseFloat(shoulder);

      if (isNaN(chestVal) || isNaN(shoulderVal)) {
        setResult({ size: "Invalid", fit: "Please enter valid measurements" });
        return;
      }

      for (const entry of chart) {
        if ('minChest' in entry && 'minShoulder' in entry) {
          if (chestVal >= entry.minChest && chestVal <= entry.maxChest) {
            if (shoulderVal >= entry.minShoulder && shoulderVal <= entry.maxShoulder) {
              recommendedSize = { size: entry.size, fit: "Perfect Fit" };
              break;
            } else if (shoulderVal < entry.minShoulder) {
              recommendedSize = { size: entry.size, fit: "Slightly loose on shoulders" };
            } else {
              recommendedSize = { size: entry.size, fit: "Slightly tight on shoulders" };
            }
          }
        }
      }
    } else {
      const waistVal = parseFloat(waist);
      const hipVal = parseFloat(hip);

      if (isNaN(waistVal) || isNaN(hipVal)) {
        setResult({ size: "Invalid", fit: "Please enter valid measurements" });
        return;
      }

      for (const entry of chart) {
        if ('minWaist' in entry && 'minHip' in entry) {
          if (waistVal >= entry.minWaist && waistVal <= entry.maxWaist) {
            if (hipVal >= entry.minHip && hipVal <= entry.maxHip) {
              recommendedSize = { size: entry.size, fit: "Perfect Fit" };
              break;
            } else if (hipVal < entry.minHip) {
              recommendedSize = { size: entry.size, fit: "Slightly loose on hips" };
            } else {
              recommendedSize = { size: entry.size, fit: "Slightly tight on hips" };
            }
          }
        }
      }
    }

    if (!recommendedSize) {
      const firstEntry = chart[0];
      const lastEntry = chart[chart.length - 1];
      
      if (isUpperBody) {
        const chestVal = parseFloat(chest);
        if ('minChest' in firstEntry && 'maxChest' in lastEntry) {
          if (chestVal < firstEntry.minChest) {
            recommendedSize = { size: "XS or smaller", fit: "Below our smallest size" };
          } else {
            recommendedSize = { size: "3XL or larger", fit: "Above our largest size" };
          }
        }
      } else {
        const waistVal = parseFloat(waist);
        if ('minWaist' in firstEntry && 'maxWaist' in lastEntry) {
          if (waistVal < firstEntry.minWaist) {
            recommendedSize = { size: "26 or smaller", fit: "Below our smallest size" };
          } else {
            recommendedSize = { size: "38 or larger", fit: "Above our largest size" };
          }
        }
      }
    }

    setResult(recommendedSize);
  };

  const handleGarmentChange = (value: GarmentType) => {
    setGarmentType(value);
    setResult(null);
    setChest("");
    setShoulder("");
    setWaist("");
    setHip("");
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-full">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold">Find My Size</h2>
          <p className="text-muted-foreground">Enter your measurements to get your perfect size</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label htmlFor="garment">Select Garment Type</Label>
            <Select value={garmentType} onValueChange={handleGarmentChange}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select garment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shirt">Shirt</SelectItem>
                <SelectItem value="tshirt">T-Shirt</SelectItem>
                <SelectItem value="pant">Pant</SelectItem>
                <SelectItem value="chudidar">Chudidar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence mode="wait">
            {isUpperBody ? (
              <motion.div
                key="upper"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="chest">Chest (inches)</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="chest"
                      type="number"
                      placeholder="e.g., 40"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className="pl-10"
                    />
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="shoulder">Shoulder (inches)</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="shoulder"
                      type="number"
                      placeholder="e.g., 17"
                      value={shoulder}
                      onChange={(e) => setShoulder(e.target.value)}
                      className="pl-10"
                    />
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="lower"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="waist">Waist (inches)</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="waist"
                      type="number"
                      placeholder="e.g., 32"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="pl-10"
                    />
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="hip">Hip (inches)</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="hip"
                      type="number"
                      placeholder="e.g., 40"
                      value={hip}
                      onChange={(e) => setHip(e.target.value)}
                      className="pl-10"
                    />
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button onClick={calculateSize} className="w-full" size="lg">
            <Calculator className="mr-2 h-4 w-4" />
            Calculate My Size
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center p-8 bg-card border border-border rounded-xl shadow-lg w-full"
              >
                <p className="text-sm text-muted-foreground mb-2">Your Recommended Size</p>
                <div className="text-6xl font-bold text-primary mb-3">{result.size}</div>
                <p className={`text-sm font-medium ${
                  result.fit === "Perfect Fit" ? "text-green-600" : "text-amber-600"
                }`}>
                  {result.fit}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-8 bg-muted/30 border border-dashed border-border rounded-xl w-full"
              >
                <Ruler className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Enter your measurements and click calculate to find your perfect size
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
