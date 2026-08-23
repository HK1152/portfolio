import React, { useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, ArrowRight, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ShinyText from '../effects/ShinyText';
import VariableProximity from '../effects/VariableProximity';
import { MaskContainer } from '../ui/svg-mask-effect';
import { PortfolioContext } from '../../context/PortfolioContext';
import SEO from '../ui/SEO';

export const Hero = () => {
  const containerRef = useRef(null);
  const { cvData } = useContext(PortfolioContext);

  const personalInfo = cvData?.personalInfo || {};
  const name = personalInfo.name || '';
  const title = personalInfo.title || '';
  const linkedin = personalInfo.linkedin ? (personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`) : '';
  const github = personalInfo.github ? (personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`) : '';
  const email = personalInfo.email || '';

  const getFileUrl = (path) => {
    if (!path) return '/kavya_cv.pdf';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const getDownloadFileName = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    return `kavya-patel-CV(Download-${day}${month}).pdf`;
  };

  const renderHeroContent = (isMaskLayer) => (
    <div className="w-full h-full flex flex-col items-center justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`font-medium tracking-wider uppercase mb-4 text-sm md:text-base ${isMaskLayer ? 'text-slate-800' : 'text-primary-400'}`}>
            Hello, I am
          </h2>
          
          <h1 className={`text-5xl md:text-7xl font-extrabold mb-6 tracking-tight ${isMaskLayer ? 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-primary-500 to-purple-500 bg-clip-text text-transparent' : 'text-white'}`}>
            <VariableProximity
              label={name}
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 900"
              containerRef={containerRef}
              radius={100}
              falloff='linear'
            />
          </h1>

          <div className="flex justify-center mb-8">
            <ShinyText
              text={title}
              disabled={isMaskLayer}
              speed={0.5}
              className={`text-xl md:text-3xl font-light ${isMaskLayer ? 'text-slate-900 font-medium' : 'text-neutral-300'}`}
            />
          </div>

          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${isMaskLayer ? 'text-slate-800' : 'text-neutral-400'}`}>
            {personalInfo.heroDescription || personalInfo.about || ''}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/projects"
              className={`cursor-pointer group flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all w-full sm:w-auto justify-center ${isMaskLayer ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'}`}
            >
              View My Work
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={getFileUrl(personalInfo.cvUrl)}
              download={getDownloadFileName()}
              className={`group flex items-center gap-2 border px-8 py-4 rounded-full font-semibold transition-all w-full sm:w-auto justify-center ${isMaskLayer ? 'border-neutral-300 text-black hover:bg-neutral-100' : 'border-neutral-700 text-white hover:bg-neutral-800'}`}
            >
              <Download size={18} aria-hidden="true" />
              Download Resume
            </a>
          </div>

          <div className="mt-12 flex justify-center space-x-6">
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className={`transition-colors ${isMaskLayer ? 'text-slate-800 hover:text-primary-600' : 'text-neutral-400 hover:text-primary-400'}`}>
              <span className="sr-only">LinkedIn</span>
              <FaLinkedin size={24} aria-hidden="true" />
            </a>
            <a href={github} target="_blank" rel="noopener noreferrer" className={`transition-colors ${isMaskLayer ? 'text-slate-800 hover:text-black' : 'text-neutral-400 hover:text-white'}`}>
              <span className="sr-only">GitHub</span>
              <FaGithub size={24} aria-hidden="true" />
            </a>
            <a href={`mailto:${email}`} target='_blank' rel="noopener noreferrer" className={`transition-colors ${isMaskLayer ? 'text-slate-800 hover:text-primary-600' : 'text-neutral-400 hover:text-primary-400'}`}>
              <span className="sr-only">Email</span>
              <Mail size={24} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <section ref={containerRef} id="home" className="min-h-screen relative bg-black flex flex-col justify-center overflow-hidden w-full">
      <SEO 
        title="Kavya Patel | Full Stack Developer & AI Automation Expert"
        description="Portfolio of Kavya Patel - Full Stack Developer based in Surat, Gujarat. Specialized in React.js, Node.js, and n8n."
      />
      <MaskContainer
        className="w-full flex-grow min-h-screen"
        revealText={renderHeroContent(false)}
      >
        {renderHeroContent(true)}
      </MaskContainer>
    </section>
  );
};

export default Hero;
