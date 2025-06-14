import React from 'react';

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'span' 
}) => {
  // For now, just render the original text
  // In the future, this component can be enhanced to use language files
  return (
    <Component className={className}>
      {children}
    </Component>
  );
};