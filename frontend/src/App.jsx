import React, { useContext, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Navbar from './components/layout/Navbar';
import LiquidSideNav from './components/layout/LiquidSideNav';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SectionLoader from './components/ui/SectionLoader';
import { PortfolioContext } from './context/PortfolioContext';

import Hero from './components/sections/Hero';

// Lazy Loaded Sections
const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Contact = lazy(() => import('./components/sections/Contact'));

// Lazy Loaded Effects
const ClickSpark = lazy(() => import('./components/effects/ClickSpark'));

// Admin Pages
import Login from './components/pages/admin/Login';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import ProtectedRoute from './components/ui/ProtectedRoute';

// LazySection Component using Intersection Observer
const LazySection = ({ children, fallback, minHeight }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '300px 0px', // Load 300px before scrolling into view
  });

  return (
    <div ref={ref} style={{ minHeight: inView ? 'auto' : minHeight, width: '100%' }}>
      {inView ? (
        <ErrorBoundary isSection={true}>
          <Suspense fallback={fallback}>
            {children}
          </Suspense>
        </ErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
};

const Portfolio = () => {
  const { cvData, error, refreshPortfolio } = useContext(PortfolioContext);

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
              <Hero />

              {/* About Section */}
              <LazySection fallback={<SectionLoader title="Loading About" minHeight="600px" />} minHeight="600px">
                <About />
              </LazySection>

              {/* Skills Section */}
              <LazySection fallback={<SectionLoader title="Loading Skills" minHeight="600px" />} minHeight="600px">
                <Skills />
              </LazySection>

              {/* Experience Section */}
              <LazySection fallback={<SectionLoader title="Loading Experience" minHeight="500px" />} minHeight="500px">
                <Experience />
              </LazySection>

              {/* Projects Section */}
              <LazySection fallback={<SectionLoader title="Loading Projects" minHeight="700px" />} minHeight="700px">
                <Projects />
              </LazySection>

              {/* Contact Section */}
              <LazySection fallback={<SectionLoader title="Loading Contact" minHeight="600px" />} minHeight="600px">
                <Contact />
              </LazySection>
            </main>

            <Footer />
          </div>
        </ClickSpark>
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
