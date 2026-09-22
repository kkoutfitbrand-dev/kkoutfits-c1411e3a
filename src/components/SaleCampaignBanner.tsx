import { motion } from 'framer-motion';
import { ArrowRight, Clock, Sparkles, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSaleCampaign, useSaleCountdown } from '@/hooks/useSaleCampaign';
import { getSaleTheme } from '@/lib/saleThemes';

export const SaleCampaignBanner = () => {
  const { campaign, loading } = useSaleCampaign();
  const countdown = useSaleCountdown(campaign);

  if (loading || !campaign) return null;

  const theme = getSaleTheme(campaign.theme_id);
  const image = campaign.banner_image_url || theme.heroImage;
  const isScheduled = countdown.status === 'scheduled';
  const countdownLabel = isScheduled ? 'Sale starts in' : 'Sale ends in';

  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <motion.img
        src={image}
        alt={campaign.title}
        loading="lazy"
        width={1536}
        height={1024}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-foreground/20" />
      <div className="container relative z-10 mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="sale-theme-mark mb-5 inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-accent" />
            {campaign.name}
            <span className="text-background/60">·</span>
            Up to {campaign.discount_percentage}% off
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="max-w-2xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            {campaign.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-5 max-w-xl text-base text-background/80 sm:text-lg">
            {campaign.subtitle}
          </motion.p>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to="/shop">
              <Button size="lg" className="group w-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 sm:w-auto">
                Shop the {campaign.name}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-background/75">
              <Clock className="h-4 w-4" />
              <span>{countdownLabel}</span>
              <span className="font-semibold text-background">
                {countdown.days}d {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m
              </span>
            </div>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm font-medium text-background/70">
            <Tag className="h-4 w-4 text-accent" />
            {campaign.promotional_text}
          </p>
        </div>
      </div>
    </section>
  );
};
