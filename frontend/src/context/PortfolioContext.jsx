import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PortfolioContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const PortfolioProvider = ({ children }) => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_URL}/api/portfolio`);
      setCvData(data);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
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
