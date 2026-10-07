import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type EditorialFashionBannerProps = {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  to: string;
  eager?: boolean;
};

export const EditorialFashionBanner = ({
  image,
  eyebrow,
  title,
  description,
  cta,
  to,
  eager = false,
}: EditorialFashionBannerProps) => (
  <section className="container px-3 py-6 sm:px-4 md:py-10">
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="group relative min-h-[420px] overflow-hidden rounded-md bg-foreground sm:min-h-[360px] lg:min-h-[430px]"
    >
      <img
        src={image}
        alt=""
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        width={1536}
        height={768}
        className="absolute inset-0 h-full w-full object-cover object-[68%_center] transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent sm:via-foreground/70" />

      <div className="relative z-10 flex min-h-[420px] max-w-[72%] flex-col justify-center px-5 py-9 text-background sm:min-h-[360px] sm:max-w-md sm:px-9 lg:min-h-[430px] lg:px-14">
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22 }}
          className="font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-background/80 sm:text-base">
          {description}
        </p>
        <div className="mt-6">
          <Button asChild variant="secondary" className="group/button">
            <Link to={to}>
              {cta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  </section>
);