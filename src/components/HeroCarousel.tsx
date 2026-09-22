import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import heroStore from "@/assets/hero-store.png";
import { useSaleCampaign } from "@/hooks/useSaleCampaign";
import { getSaleTheme } from "@/lib/saleThemes";

/** Ambient themed particles (glow / confetti / stars) floating over the hero. */
const ThemeParticles = ({ particle, motif }: { particle: string; motif: string }) => {
  const items = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 13) % 100}%`,
        delay: (i % 5) * 0.9,
        duration: 6 + (i % 4) * 2,
        size: 10 + (i % 3) * 4,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((p) => (
        <span
          key={p.id}
          className={`theme-particle theme-particle-${particle}`}
          style={{
            left: p.left,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: p.size,
          }}
        >
          {motif}
        </span>
      ))}
    </div>
  );
};

export const HeroCarousel = () => {
  const ref = useRef(null);
  const { campaign } = useSaleCampaign();
  const theme = getSaleTheme(campaign?.theme_id);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const isCampaign = Boolean(campaign);
  const image = campaign?.banner_image_url || (isCampaign ? theme.heroImage : heroStore);
  const badge = isCampaign ? `${campaign!.name} · ${campaign!.discount_percentage}% OFF` : "NEW COLLECTION 2026";
  const title = isCampaign ? campaign!.title : "Welcome to Our Store";
  const subtitle = isCampaign ? campaign!.subtitle : "Discover Our Latest Collection";
  const ctaTo = isCampaign ? "/sale" : "/shop";
  const ctaLabel = isCampaign ? `Shop the ${campaign!.name}` : "Shop Now";

  return (
    <div ref={ref} className="relative h-[320px] md:h-[420px] lg:h-[500px] overflow-hidden bg-muted">
      {/* Parallax Background Image */}
      <motion.div style={{ y: backgroundY, scale }} className="absolute inset-0 w-full h-[130%]">
        <img
          src={image}
          alt={isCampaign ? campaign!.title : "Our Store"}
          className="w-full h-full object-cover object-center"
          width={1536}
          height={1024}
        />
      </motion.div>

      {/* Gradient Overlays — heavier at bottom for mobile-first legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

      {/* Themed floating particles when a campaign is live */}
      {isCampaign && <ThemeParticles particle={theme.particle} motif={theme.motif} />}

      {/* Content with Parallax — bottom-anchored editorial stack */}
      <motion.div style={{ y: textY, opacity }} className="absolute inset-0 flex items-end md:items-center z-10">
        <div className="container px-4 pb-8 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl text-white"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sale-theme-mark inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] bg-white/15 backdrop-blur-sm rounded-full border border-white/30"
            >
              {isCampaign && <Sparkles className="h-3 w-3 text-accent" />}
              {badge}
            </motion.span>

            {/* Staggered line-by-line headline reveal */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-3 leading-[1.02] tracking-tight">
              {title.split(" — ").map((line, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.4 + i * 0.14 }}
                  className="block"
                >
                  {line}
                  {i === 0 && title.includes(" — ") && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.75 + i * 0.14 }}
                      className="mt-1 block h-1 w-16 origin-left rounded-full bg-accent"
                    />
                  )}
                </motion.span>
              ))}
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="text-sm md:text-lg mb-4 md:mb-6 text-white/90 max-w-md"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link to={ctaTo}>
                <Button
                  size="lg"
                  className="group bg-white text-foreground hover:bg-white/90 font-bold rounded-full px-7 md:px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade into page background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"
      />
    </div>
  );
};
