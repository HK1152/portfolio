import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';
import { Home, User, Code, Briefcase, Mail, Cpu, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', to: 'home', icon: Home },
  { name: 'About', to: 'about', icon: User },
  { name: 'Skills', to: 'skills', icon: Cpu },
  { name: 'Experience', to: 'experience', icon: Briefcase },
  { name: 'Projects', to: 'projects', icon: Code },
  { name: 'Contact', to: 'contact', icon: Mail },
];

const LiquidSideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button (3 Lines / Hamburger) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 right-5 z-[150] p-3 bg-neutral-900/80 backdrop-blur-md rounded-xl text-white md:hidden border border-neutral-800 shadow-2xl transition-all active:scale-95"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Background Overlay for Mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[140] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* The Liquid Sidebar */}
      <motion.div
        className="fixed top-0 left-0 h-screen z-[145] md:z-[140] flex items-center justify-start pointer-events-none"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.nav 
          className="pointer-events-auto flex flex-col h-auto max-h-[95vh] py-8 bg-neutral-950/90 backdrop-blur-2xl border-y border-r border-neutral-800/50 rounded-r-3xl relative ml-0 p-3 justify-center items-start overflow-hidden shadow-[20px_0_60px_rgba(0,0,0,0.7)]"
          initial={isMobile ? "hidden" : "collapsed"}
          animate={isOpen ? "expanded" : (isMobile ? "hidden" : "collapsed")}
          whileHover={!isMobile ? "expanded" : undefined}
          variants={{
            hidden: { width: "0px", padding: "0px", opacity: 0, x: -50 },
            collapsed: { width: "75px", padding: "12px", opacity: 1, x: 0 },
            expanded: { width: "220px", padding: "12px", opacity: 1, x: 0 }
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {/* Subtle liquid blob effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

          <div className="w-full flex flex-col gap-3 items-start relative z-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                smooth={true}
                duration={500}
                spy={true}
                offset={-20}
                activeClass="text-emerald-400 bg-neutral-800/80 scale-105 shadow-xl shadow-emerald-900/20"
                onClick={() => isMobile && setIsOpen(false)}
                className="group relative flex items-center gap-4 w-full cursor-pointer px-4 py-3.5 rounded-2xl transition-all duration-300 text-neutral-400 hover:text-white hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700/50 overflow-hidden"
              >
                <div className="flex items-center justify-center min-w-[24px]">
                  <item.icon size={22} className="relative z-10 transition-transform duration-300 group-hover:scale-115" />
                </div>
                
                <motion.span 
                  className="whitespace-nowrap relative z-10 font-bold tracking-tight text-sm"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    collapsed: { opacity: 0, x: -20, transition: { duration: 0.1 } },
                    expanded: { opacity: 1, x: 0, transition: { delay: 0.1 } }
                  }}
                >
                  {item.name}
                </motion.span>

                {/* Hover indicator */}
                <div className="absolute left-0 w-1 h-0 bg-emerald-500 rounded-r-full transition-all duration-300 group-hover:h-6" />
              </Link>
            ))}
          </div>
        </motion.nav>
      </motion.div>
    </>
  );
};

export default LiquidSideNav;
