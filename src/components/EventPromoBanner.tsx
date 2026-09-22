import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSaleCampaign } from '@/hooks/useSaleCampaign';
import { getSaleTheme } from '@/lib/saleThemes';

interface EventPromoBannerProps {
  /** strip = slim full-width banner, card = taller promotional block */
  variant?: 'strip' | 'card';
  className?: string;
}

/**
 * Reusable event promo banner driven by the active sale campaign.
 * Renders nothing when no campaign is live, so pages stay clean off-season.
 */
export const EventPromoBanner = ({ variant = 'strip', className = '' }: EventPromoBannerProps) => {
  const { campaign, loading } = useSaleCampaign();

  if (loading || !campaign) return null;

  const theme = getSaleTheme(campaign.theme_id);
  const image = campaign.banner_image_url || theme.heroImage;

  if (variant === 'strip') {
    return (
      <section className={`relative overflow-hidden ${className}`}>
        <div className="relative h-28 sm:h-32 md:h-40">
          <img
            src={image}
            alt={campaign.title}
            loading="lazy"
            width={1536}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
          <div className="container relative z-10 mx-auto flex h-full items-center justify-between gap-3 px-4">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="min-w-0 text-white"
            >
              <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-accent" />
                {campaign.name}
              </p>
              <h3 className="truncate text-base font-bold sm:text-lg md:text-2xl">
                Up to {campaign.discount_percentage}% Off — {theme.label}
              </h3>
            </motion.div>
            <Link to="/sale" className="shrink-0">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Shop Sale
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`container mx-auto px-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl shadow-lg"
      >
        <div className="relative h-52 sm:h-64 md:h-80">
          <img
            src={image}
            alt={campaign.title}
            loading="lazy"
            width={1536}
            height={1024}
            className="animate-kenburns absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-md px-5 sm:px-8 md:px-12 text-white">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm"
              >
                <Sparkles className="h-3 w-3 text-accent" />
                {campaign.name} · Up to {campaign.discount_percentage}% Off
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl"
              >
                {campaign.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="mt-2 hidden text-sm text-white/85 sm:block md:text-base"
              >
                {campaign.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
                className="mt-4"
              >
                <Link to="/sale">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md">
                    Shop the {campaign.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
