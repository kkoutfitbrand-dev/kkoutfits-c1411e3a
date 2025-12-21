import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
const qas = [{
  id: 1,
  question: "What is the fabric composition?",
  answer: "This product is made from 100% premium silk with intricate embroidery work using metallic threads.",
  askedBy: "Customer",
  answeredBy: "KK Outfit Team",
  date: "3 days ago"
}, {
  id: 2,
  question: "Is dry cleaning required?",
  answer: "Yes, we recommend professional dry cleaning to maintain the quality and longevity of the embroidery work.",
  askedBy: "Verified Buyer",
  answeredBy: "KK Outfit Team",
  date: "1 week ago"
}, {
  id: 3,
  question: "How long does customization take?",
  answer: "Custom alterations typically take 5-7 business days. Rush orders can be accommodated with additional charges.",
  askedBy: "Customer",
  answeredBy: "KK Outfit Team",
  date: "2 weeks ago"
}];
export const ProductQA = () => {
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Questions & Answers</h3>
        
      </div>

      <div className="space-y-6">
        {qas.map(qa => <div key={qa.id} className="border-b border-border pb-6 last:border-0">
            <div className="mb-3">
              <div className="flex items-start gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-accent mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-1">{qa.question}</p>
                  <p className="text-xs text-muted-foreground">
                    Asked by {qa.askedBy} • {qa.date}
                  </p>
                </div>
              </div>
            </div>
            <div className="ml-7 bg-muted/30 rounded-lg p-4">
              <p className="text-muted-foreground mb-2">{qa.answer}</p>
              <p className="text-xs text-muted-foreground">
                Answered by {qa.answeredBy}
              </p>
            </div>
          </div>)}
      </div>

      
    </div>;
};