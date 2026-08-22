import React, { createContext, useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { cvData as fallbackData } from '../data/cvData';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [cvData, setCvData] = useState(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await portfolioService.getPortfolio();
      // Handle either direct object or { success: true, data: { ... } }
      const payload = data?.data || data;
      // Only update if there's actual data to avoid blanking out fallback data
      if (payload && Object.keys(payload).length > 0) {
        setCvData(payload);
      }
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
