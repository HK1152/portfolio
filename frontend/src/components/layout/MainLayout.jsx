import React, { Suspense, lazy, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LiquidSideNav from './LiquidSideNav';
import Footer from './Footer';
import ErrorBoundary from '../ui/ErrorBoundary';

const ClickSpark = lazy(() => import('../effects/ClickSpark'));

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="bg-neutral-950 min-h-screen text-white selection:bg-primary-500/30 selection:text-primary-200 font-sans relative flex flex-col">
            <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <LiquidSideNav isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="flex-grow flex flex-col w-full">
              <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center text-primary-500">Loading...</div>}>
                <Outlet />
              </Suspense>
            </main>

            <Footer />
          </div>
        </ClickSpark>
      </Suspense>
    </ErrorBoundary>
  );
};

export default MainLayout;
