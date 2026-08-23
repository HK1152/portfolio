import React, { useContext } from 'react';
import { Heart } from 'lucide-react';
import { PortfolioContext } from '../../context/PortfolioContext';

export const Footer = () => {
  const { cvData } = useContext(PortfolioContext);
  const name = cvData?.personalInfo?.name || 'Kavya Patel';

  return (
    <footer className="w-full transition-all duration-300 bg-white/[0.03] backdrop-blur-md py-5 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-neutral-400 text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </div>
          
          <div className="flex items-center gap-1 text-sm font-medium text-neutral-400 tracking-wide">
            Built with <Heart size={14} className="text-primary-500 fill-primary-500/20" /> using React & Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
