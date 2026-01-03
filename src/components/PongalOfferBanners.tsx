import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import pongalOffer1 from '@/assets/pongal-offer-1.jpg';
import pongalOffer2 from '@/assets/pongal-offer-2.jpg';
import pongalOffer3 from '@/assets/pongal-offer-3.jpg';

const banners = [
  {
    id: 1,
    image: pongalOffer1,
    title: 'Festive Offers',
    subtitle: 'Up to 50% Off',
    link: '/shop',
  },
  {
    id: 2,
    image: pongalOffer2,
    title: 'Traditional Collection',
    subtitle: 'New Arrivals',
    link: '/shop',
  },
  {
    id: 3,
    image: pongalOffer3,
    title: 'Pongal Special',
    subtitle: 'Shop Now',
    link: '/shop',
  },
];

export const PongalOfferBanners = () => {
  return (
    <section className="container px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={banner.link} className="block group">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-lg">
                    {banner.title}
                  </h3>
                  <p className="text-amber-300 text-sm font-medium">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PongalOfferBanners;
