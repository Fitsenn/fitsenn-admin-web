import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import '@/lib/i18n';

import App from './app/app-root';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
