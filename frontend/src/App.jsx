import React, { useState, useEffect, useContext } from 'react';
import Navbar from './components/Navbar';
import LiquidSideNav from './components/LiquidSideNav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

import ClickSpark from './components/ClickSpark';
import { AnimatePresence } from 'framer-motion';
import { PortfolioContext } from './context/PortfolioContext';

function App() {
  const { cvData, loading, error } = useContext(PortfolioContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-t-2 border-emerald-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-neutral-500 font-medium tracking-[0.2em] uppercase text-xs animate-pulse">
          Crafting Experience
        </p>
      </div>
    );
  }

  if (error || !cvData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-red-500 font-mono text-xl">
        Error loading portfolio data from backend.
      </div>
    );
  }

  return (
    <ClickSpark
      sparkColor='#fff'
      sparkSize={11}
      sparkRadius={50}
      sparkCount={8}
      duration={700}
      extraScale={0.7}
    >
      <div className="bg-neutral-950 min-h-screen text-white selection:bg-emerald-500/30 selection:text-emerald-200 font-sans relative">
        <LiquidSideNav />

        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}

export default App;
