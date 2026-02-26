import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TickerItem {
  id: string;
  text: string;
  emoji: string | null;
}

const DEFAULT_ITEMS: TickerItem[] = [
  { id: "1", text: "FAST DELIVERY", emoji: "🚚" },
  { id: "2", text: "24/7 CUSTOMER SUPPORT", emoji: "📞" },
  { id: "3", text: "GRAND SALE!", emoji: "🔥" },
  { id: "4", text: "4.4/5 FROM 690+ REVIEWS", emoji: "⭐" },
  { id: "5", text: "BEST PRICE GUARANTEE", emoji: "💰" },
  { id: "6", text: "EASY RETURNS", emoji: "🔄" },
];

export const PromoTicker = () => {
  const [items, setItems] = useState<TickerItem[]>(DEFAULT_ITEMS);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await (supabase as any)
        .from("promo_ticker_items")
        .select("id, text, emoji")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setItems(data);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="w-full bg-black text-white overflow-hidden">
      <div className="flex whitespace-nowrap py-2 animate-marquee">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <span
            key={`${item.id}-${index}`}
            className="mx-6 text-xs md:text-sm font-medium tracking-wider uppercase inline-flex items-center gap-1.5 shrink-0"
          >
            {item.emoji && <span>{item.emoji}</span>}
            {item.text}
            <span className="ml-6 text-white/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
