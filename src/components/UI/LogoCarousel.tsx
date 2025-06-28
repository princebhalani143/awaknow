import React from 'react';
import { motion } from 'framer-motion';

interface LogoCarouselProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export const LogoCarousel: React.FC<LogoCarouselProps> = ({
  className = '',
  title = 'Trusted by Industry Leaders',
  subtitle = 'Powered by cutting-edge technology partners'
}) => {
  const logos = [
    {
      name: 'Bolt',
      logo: '/bolt.jpg',
      alt: 'Bolt - Development Platform',
      fallbackColor: 'bg-blue-100 text-blue-700'
    },
    {
      name: 'Tavus',
      logo: '/Tavus.png',
      alt: 'Tavus - AI Video Technology',
      fallbackColor: 'bg-purple-100 text-purple-700'
    },
    {
      name: 'ElevenLabs',
      logo: '/ElevenLabs.png',
      alt: 'ElevenLabs - Voice AI',
      fallbackColor: 'bg-green-100 text-green-700'
    },
    {
      name: 'Supabase',
      logo: '/Supabase.png',
      alt: 'Supabase - Backend Infrastructure',
      fallbackColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      name: 'RevenueCat',
      logo: '/revenuecat.png',
      alt: 'RevenueCat - Subscription Management',
      fallbackColor: 'bg-orange-100 text-orange-700'
    },
    {
      name: 'Stripe',
      logo: '/stripe.jpg',
      alt: 'Stripe - Payment Processing',
      fallbackColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      name: 'Netlify',
      logo: '/netlify.png',
      alt: 'Netlify - Web Hosting',
      fallbackColor: 'bg-teal-100 text-teal-700'
    },
    {
      name: 'Entri',
      logo: '/entri.png',
      alt: 'Entri - Domain Management',
      fallbackColor: 'bg-pink-100 text-pink-700'
    }
  ];

  // Triple the logos for seamless infinite scroll
  const tripleLogos = [...logos, ...logos, ...logos];

  const LogoItem: React.FC<{ logo: typeof logos[0]; index: number }> = ({ logo, index }) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);

    return (
      <motion.div
        key={`${logo.name}-${index}`}
        className="flex-shrink-0 w-28 h-16 sm:w-32 sm:h-18 md:w-36 md:h-20 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full h-full flex items-center justify-center bg-white rounded-lg shadow-sm border border-neutral-100 group-hover:shadow-md transition-all duration-300">
          {!imageError ? (
            <img
              src={logo.logo}
              alt={logo.alt}
              className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                imageLoaded 
                  ? 'opacity-70 group-hover:opacity-100 filter grayscale group-hover:grayscale-0' 
                  : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              style={{ maxWidth: '80%', maxHeight: '60%' }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center rounded-lg ${logo.fallbackColor} transition-all duration-300 group-hover:scale-105`}>
              <span className="text-sm font-bold tracking-wide">
                {logo.name}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <section className={`py-16 sm:py-20 md:py-24 ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Logo Carousel Container */}
        <div className="relative overflow-hidden bg-gradient-to-r from-neutral-50 via-white to-neutral-50 rounded-2xl py-8 border border-neutral-100">
          {/* Gradient Overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-neutral-50 via-neutral-50/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-neutral-50 via-neutral-50/80 to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling Logos */}
          <div className="flex items-center">
            <motion.div
              className="flex items-center space-x-6 sm:space-x-8 md:space-x-10"
              animate={{
                x: [0, `-${100/3}%`] // Move by exactly one-third (one set of logos)
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              style={{ 
                width: 'max-content',
                willChange: 'transform'
              }}
            >
              {tripleLogos.map((logo, index) => (
                <LogoItem key={`${logo.name}-${index}`} logo={logo} index={index} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-neutral-500 max-w-3xl mx-auto leading-relaxed">
            Built with enterprise-grade infrastructure and cutting-edge AI technology to deliver 
            the most advanced emotional wellness platform available today.
          </p>
        </motion.div>
      </div>
    </section>
  );
};