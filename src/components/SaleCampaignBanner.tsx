import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSaleCampaign } from '@/hooks/useSaleCampaign';
import bigSaleBanner from '@/assets/big-sale-banner.webp';

export const SaleCampaignBanner = () => {
  const { campaign, loading } = useSaleCampaign();

  if (loading || !campaign) return null;

  return (
    <section className="relative overflow-hidden bg-foreground">
      <Link to="/sale" aria-label={`Shop the ${campaign.name}`} className="group block">
        <motion.img
          src={bigSaleBanner}
          alt={campaign.title}
          loading="lazy"
          width={1774}
          height={887}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />
      </Link>
    </section>
  );
};
