import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sizeData = [
  { size: "S", chest: "36-38", waist: "30-32", length: "27" },
  { size: "M", chest: "38-40", waist: "32-34", length: "28" },
  { size: "L", chest: "40-42", waist: "34-36", length: "29" },
  { size: "XL", chest: "42-44", waist: "36-38", length: "30" },
  { size: "XXL", chest: "44-46", waist: "38-40", length: "31" },
];

export const SizeGuideModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 text-primary">
          <Ruler className="h-4 w-4 mr-1" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">All measurements are in inches.</p>
            <p>Model is wearing size M (Height: 6'0", Chest: 39")</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead>Chest</TableHead>
                <TableHead>Waist</TableHead>
                <TableHead>Length</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizeData.map((row) => (
                <TableRow key={row.size}>
                  <TableCell className="font-medium">{row.size}</TableCell>
                  <TableCell>{row.chest}</TableCell>
                  <TableCell>{row.waist}</TableCell>
                  <TableCell>{row.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
            <p className="font-medium">How to Measure</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Chest: Measure around the fullest part of your chest</li>
              <li>Waist: Measure around your natural waistline</li>
              <li>Length: Measure from highest point of shoulder to hem</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
