import { Link } from "react-router-dom";
import { Tag, Zap, Gift, Clock } from "lucide-react";

const deals = [
  {
    icon: Tag,
    title: "FLAT ₹200 OFF",
    subtitle: "On First Order",
    gradient: "from-myntra-pink to-myntra-orange",
    code: "NEW200",
  },
  {
    icon: Zap,
    title: "BUY 2 GET 1",
    subtitle: "On All Products",
    gradient: "from-myntra-orange to-myntra-yellow",
    code: "BUY2GET1",
  },
  {
    icon: Gift,
    title: "EXTRA 15% OFF",
    subtitle: "On ₹2999+",
    gradient: "from-myntra-yellow to-myntra-green",
    code: "SAVE15",
  },
  {
    icon: Clock,
    title: "FLASH SALE",
    subtitle: "Ending Soon",
    gradient: "from-myntra-green to-myntra-blue",
    code: "FLASH",
  },
];

export const DealsBanner = () => {
  return (
    <section className="bg-muted py-4">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {deals.map((deal, index) => (
            <Link
              key={index}
              to="/category/all"
              className="group"
            >
              <div className={`relative overflow-hidden rounded-sm bg-gradient-to-r ${deal.gradient} p-4 text-white transition-transform hover:scale-105`}>
                <div className="flex items-center gap-3">
                  <deal.icon className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold uppercase">{deal.title}</p>
                    <p className="text-xs opacity-90">{deal.subtitle}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs font-mono bg-white/20 rounded px-2 py-1 inline-block">
                  CODE: {deal.code}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
