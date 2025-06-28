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

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className={`py-16 sm:py-20 md:py-24 ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Logo Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Scrolling Logos */}
          <motion.div
            className="flex items-center space-x-12 sm:space-x-16 md:space-x-20"
            animate={{
              x: [0, -50 * logos.length * 4] // Move by half the total width for seamless loop
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            style={{ width: `${duplicatedLogos.length * 200}px` }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex-shrink-0 w-32 h-16 sm:w-36 sm:h-18 md:w-40 md:h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <img
                  src={logo.logo}
                  alt={logo.alt}
                  className="max-w-full max-h-full object-contain filter brightness-0 contrast-100"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-lg font-bold text-neutral-400">${logo.name}</span>`;
                    }
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Optional: Add a subtle description */}
        <div className="text-center mt-8">
          <p className="text-sm text-neutral-500 max-w-3xl mx-auto">
            Built with enterprise-grade infrastructure and cutting-edge AI technology to deliver 
            the most advanced emotional wellness platform available today.
          </p>
        </div>
      </div>
    </section>
  );
};