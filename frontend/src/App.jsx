import React, { useContext, lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import LiquidSideNav from './components/layout/LiquidSideNav';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SectionLoader from './components/ui/SectionLoader';
import { PortfolioContext } from './context/PortfolioContext';

// Lazy Loaded Sections
const Hero = lazy(() => import('./components/sections/Hero'));
const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Contact = lazy(() => import('./components/sections/Contact'));

// Lazy Loaded Effects
const ClickSpark = lazy(() => import('./components/effects/ClickSpark'));

function App() {
  const { cvData, loading, error, refreshPortfolio } = useContext(PortfolioContext);

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

  if (error && !cvData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 max-w-lg bg-neutral-900 border border-red-500/30 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-3">Portfolio Offline</h2>
          <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
            Unable to connect to the backend server. Please verify your connection or restart the backend.
          </p>
          <button
            onClick={refreshPortfolio}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-full transition-all active:scale-95 cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="bg-neutral-950 min-h-screen" />}>
        <ClickSpark
          sparkColor='#fff'
          sparkSize={11}
          sparkRadius={50}
          sparkCount={8}
          duration={700}
          extraScale={0.7}
        >
          <div className="bg-neutral-950 min-h-screen text-white selection:bg-emerald-500/30 selection:text-emerald-200 font-sans relative">
            <Navbar />
            <LiquidSideNav />

            <main>
              {/* Hero Section */}
              <ErrorBoundary isSection={true}>
                <Suspense fallback={<SectionLoader title="Loading Hero" minHeight="100vh" />}>
                  <Hero />
                </Suspense>
              </ErrorBoundary>

              {/* About Section */}
              <ErrorBoundary isSection={true}>
                <Suspense fallback={<SectionLoader title="Loading About" minHeight="600px" />}>
                  <About />
                </Suspense>
              </ErrorBoundary>

              {/* Skills Section */}
              <ErrorBoundary isSection={true}>
                <Suspense fallback={<SectionLoader title="Loading Skills" minHeight="600px" />}>
                  <Skills />
                </Suspense>
              </ErrorBoundary>

              {/* Experience Section */}
              <ErrorBoundary isSection={true}>
                <Suspense fallback={<SectionLoader title="Loading Experience" minHeight="500px" />}>
                  <Experience />
                </Suspense>
              </ErrorBoundary>

              {/* Projects Section */}
              <ErrorBoundary isSection={true}>
                <Suspense fallback={<SectionLoader title="Loading Projects" minHeight="700px" />}>
                  <Projects />
                </Suspense>
              </ErrorBoundary>

              {/* Contact Section */}
              <ErrorBoundary isSection={true}>
                <Suspense fallback={<SectionLoader title="Loading Contact" minHeight="600px" />}>
                  <Contact />
                </Suspense>
              </ErrorBoundary>
            </main>

            <Footer />
          </div>
        </ClickSpark>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
