import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { PortfolioProvider } from './context/PortfolioContext';
import ErrorBoundary from './components/ui/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    </ErrorBoundary>
  </StrictMode>,
);
