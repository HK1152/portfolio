import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/portfolio`);
        setCvData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ cvData, loading, error }}>
      {children}
    </PortfolioContext.Provider>
  );
};
