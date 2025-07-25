import React from 'react';
import { ExternalLink, Facebook, Instagram, Twitter, Linkedin, Mail, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/awaknow',
      icon: Facebook,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/awak.now/',
      icon: Instagram,
      color: 'hover:text-pink-600'
    },
    {
      name: 'Twitter',
      url: 'https://x.com/awak_now',
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/awaknow',
      icon: Linkedin,
      color: 'hover:text-blue-700'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@Awak_Now',
      icon: Youtube,
      color: 'hover:text-red-600'
    },
    {
      name: 'Email',
      url: 'mailto:info@awaknow.org',
      icon: Mail,
      color: 'hover:text-green-600'
    }
  ];

  return (
    <footer className="bg-white border-t border-neutral-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left Section - Copyright and Links in one line */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="text-sm text-neutral-600">© 2025 AwakNow</span>
            <button
              onClick={() => navigate('/privacy-policy')}
              className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms-conditions')}
              className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              Terms & Conditions
            </button>
          </div>
          
          {/* Right Section - Social Media Icons */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-neutral-500 ${social.color} transition-all duration-300 transform hover:scale-110`}
                aria-label={social.name === 'Email' ? 'Email us at info@awaknow.org' : `Follow AwakNow on ${social.name}`}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};