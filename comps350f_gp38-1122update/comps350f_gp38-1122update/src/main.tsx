import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import './i18n';
import { LanguageProvider } from './contexts/LanguageContext';
import { VotingRulesProvider } from './contexts/VotingRulesContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <VotingRulesProvider>
        <App />
      </VotingRulesProvider>
    </LanguageProvider>
  </StrictMode>
);