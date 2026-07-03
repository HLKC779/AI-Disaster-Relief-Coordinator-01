import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { logError } from './services/loggingService';

// Global error handlers to catch issues outside of React's lifecycle
window.addEventListener('error', (event) => {
  if (event.error) {
    logError(event.error, { source: 'global-error-handler' });
  } else {
    logError(new Error(event.message || 'Unknown global error'), { source: 'global-error-handler', event });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason instanceof Error) {
    logError(event.reason, { source: 'unhandled-rejection-handler' });
  } else {
    logError(new Error('Unhandled promise rejection'), { source: 'unhandled-rejection-handler', reason: event.reason });
  }
});


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);