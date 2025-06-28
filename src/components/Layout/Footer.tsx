import React from 'react';
import { ExternalLink, Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';
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
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm text-neutral-600 text-center sm:text-left">
            <span>© 2025 AwakNow |</span>
            <span>Vision of
            <a
              href="https://linkedin.com/in/princebhalani"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors inline-flex items-center space-x-1 ml-1"
            >
              <span>Prince Bhalani</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            </span>
          </div>

          {/* Legal Links & Social Media */}
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-8 text-center">
            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <button
                onClick={() => navigate('/privacy-policy')}
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate('/terms-conditions')}
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                Terms & Conditions
              </button>
            </div>

            {/* Social Media Icons */}
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
      </div>
    </footer>
  );
};