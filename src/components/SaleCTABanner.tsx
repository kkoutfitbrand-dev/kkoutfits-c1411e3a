import { Link } from 'react-router-dom';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useSaleCampaign } from '@/hooks/useSaleCampaign';
import wideBanner from '@/assets/big-sale-wide-banner.png.asset.json';

export const SaleCTABanner = () => {
  const { campaign, loading } = useSaleCampaign();
  if (loading || !campaign) return null;

  return (
    <section className="bg-background py-8 md:py-12">
      <div className="container px-3 sm:px-4">
        <ScrollReveal>
          <Link
            to="/sale"
            aria-label={`Shop the ${campaign.name}`}
            className="group block overflow-hidden rounded-lg shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <img
              src={wideBanner.url}
              alt="KK Outfits Big Sale — up to 50% off"
              loading="lazy"
              width={1536}
              height={768}
              className="aspect-[2/1] w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};
