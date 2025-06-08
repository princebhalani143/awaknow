import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-neutral-200 shadow-soft
        ${paddingClasses[padding]}
        ${onClick ? 'cursor-pointer' : ''}
        ${hover ? 'hover:shadow-medium transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};