import React, { createContext, useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [cvData, setCvData] = useState({});
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
