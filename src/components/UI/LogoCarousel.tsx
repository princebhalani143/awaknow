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
      alt: 'Bolt - Development Platform'
    },
    {
      name: 'Tavus',
      logo: '/Tavus.png',
      alt: 'Tavus - AI Video Technology'
    },
    {
      name: 'ElevenLabs',
      logo: '/ElevenLabs.png',
      alt: 'ElevenLabs - Voice AI'
    },
    {
      name: 'Supabase',
      logo: '/Supabase.png',
      alt: 'Supabase - Backend Infrastructure'
    },
    {
      name: 'RevenueCat',
      logo: '/revenuecat.png',
      alt: 'RevenueCat - Subscription Management'
    },
    {
      name: 'Stripe',
      logo: '/stripe.jpg',
      alt: 'Stripe - Payment Processing'
    },
    {
      name: 'Netlify',
      logo: '/netlify.png',
      alt: 'Netlify - Web Hosting'
    },
    {
      name: 'Entri',
      logo: '/entri.png',
      alt: 'Entri - Domain Management'
    }
  ];

  // Triple the logos for seamless infinite scroll
  const tripleLogos = [...logos, ...logos, ...logos];

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
        <div className="relative overflow-hidden bg-white rounded-2xl py-8">
          {/* Gradient Overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling Logos */}
          <div className="flex items-center">
            <motion.div
              className="flex items-center space-x-8 sm:space-x-12 md:space-x-16"
              animate={{
                x: [0, -100 / 3 + '%'] // Move by exactly one-third (one set of logos)
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
              style={{ 
                width: 'max-content',
                willChange: 'transform'
              }}
            >
              {tripleLogos.map((logo, index) => (
                <motion.div
                  key={`${logo.name}-${index}`}
                  className="flex-shrink-0 w-24 h-12 sm:w-32 sm:h-16 md:w-36 md:h-18 flex items-center justify-center group"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={logo.logo}
                    alt={logo.alt}
                    className="max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0"
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(85%)'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-neutral-100 rounded-lg">
                            <span class="text-sm font-semibold text-neutral-600">${logo.name}</span>
                          </div>
                        `;
                      }
                    }}
                  />
                </motion.div>
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