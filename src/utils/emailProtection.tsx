// Email protection utilities to prevent bot harvesting
export const obfuscateEmail = (email: string): string => {
  return email.replace('@', ' [at] ').replace('.', ' [dot] ');
};

export const createProtectedEmailLink = (email: string, subject?: string): string => {
  const parts = email.split('@');
  const user = parts[0];
  const domain = parts[1];
  
  // Use JavaScript to construct the mailto link
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${user}@${domain}${subjectParam}`;
};

// Component for protected email display
export const ProtectedEmail: React.FC<{ 
  email: string; 
  subject?: string; 
  className?: string;
  children?: React.ReactNode;
}> = ({ email, subject, className = '', children }) => {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = createProtectedEmailLink(email, subject);
    window.location.href = link;
  };

  return (
    <button
      onClick={handleEmailClick}
      className={`hover:underline transition-colors ${className}`}
      aria-label={`Send email to ${obfuscateEmail(email)}`}
    >
      {children || obfuscateEmail(email)}
    </button>
  );
};