import React, { createContext, useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { cvData as fallbackData } from '../data/cvData';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await portfolioService.getPortfolio();
      // Handle either direct object or { success: true, data: { ... } }
      const payload = data?.data || data;
      setCvData(payload || fallbackData);
    } catch (err) {
      console.warn('Backend portfolio fetch warning, using fallback local data:', err.message);
      // Seamless graceful fallback
      setCvData(fallbackData);
      setError(null);
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
