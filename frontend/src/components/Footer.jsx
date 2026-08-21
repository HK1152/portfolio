import React from 'react';
import { Heart } from 'lucide-react';
import { PortfolioContext } from '../context/PortfolioContext';
import { useContext } from 'react';
const Footer = () => {
  const { cvData } = useContext(PortfolioContext);
  return (
    <footer className="bg-neutral-950 py-8 border-t border-neutral-900 border-opacity-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-neutral-500 text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} {cvData.personalInfo.name}. All rights reserved.
        </div>
        
        <div className="flex items-center gap-1 text-sm text-neutral-400">
          Built with <Heart size={14} className="text-red-500 fill-current" /> using React & Tailwind
        </div>
      </div>
    </footer>
  );
};

export default Footer;
