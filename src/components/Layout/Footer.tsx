import React from 'react';
import { Heart, ExternalLink, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProtectedEmail } from '../../utils/emailProtection';

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
    }
  ];

  return (
    <footer className="bg-white border-t border-neutral-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-6">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm text-neutral-600 text-center sm:text-left">
              <span>© 2025 AwakNow</span>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-primary-500" />
                <span>Vision of</span>
                <a
                  href="https://linkedin.com/in/princebhalani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors inline-flex items-center space-x-1"
                >
                  <span>Prince Bhalani</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-center">
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
              <ProtectedEmail
                email="info@awaknow.org"
                subject="Contact AwakNow"
                className="text-neutral-600 hover:text-primary-600"
              >
                Contact Us
              </ProtectedEmail>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-sm text-neutral-600 font-medium">Follow Us</div>
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-neutral-500 ${social.color} transition-colors duration-300 transform hover:scale-110`}
                  aria-label={`Follow AwakNow on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 pt-4">
            <div className="text-center text-xs text-neutral-500">
              Transforming emotional wellness through AI-powered conversations
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};