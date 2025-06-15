import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-neutral-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <span>© 2025 AwakNow</span>
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
            <a
              href="mailto:info@awaknow.org"
              className="text-neutral-600 hover:text-primary-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};