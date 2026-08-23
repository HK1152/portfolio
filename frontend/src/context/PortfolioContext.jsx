import React, { createContext, useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';

export const PortfolioContext = createContext();

const DEFAULT_PORTFOLIO = {
  personalInfo: {
    name: 'Kavya Patel',
    title: 'Frontend-focused Full Stack Developer',
    heroDescription: 'Frontend-focused Full Stack Developer building responsive and scalable web applications.',
    about: 'Frontend-focused Full Stack Developer building responsive and scalable web applications.',
    email: 'hk1152@gmail.com',
    location: 'Gandhinagar, India',
    github: 'https://github.com/HK1152',
    linkedin: 'https://linkedin.com/in/hk1152',
    cvUrl: '/kavya_cv.pdf',
  },
  skills: [],
  techLogos: [],
  educations: [],
  certifications: [],
  experiences: [],
  projects: [],
};

const CACHE_KEY = 'portfolio_cached_cv_data';

export const PortfolioProvider = ({ children }) => {
  const [cvData, setCvData] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (_) {}
    return DEFAULT_PORTFOLIO;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await portfolioService.getPortfolio();
      // Handle either direct object or { success: true, data: { ... } }
      const payload = data?.data || data;
      if (payload && Object.keys(payload).length > 0) {
        setCvData(payload);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        } catch (_) {}
      }
    } catch (err) {
      console.error('Backend portfolio fetch failed:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ cvData, loading, error, refreshPortfolio: fetchPortfolioData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioProvider;
