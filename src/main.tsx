
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Set a flag to help identify PWA mode in the app
if (window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone === true) {
  document.documentElement.setAttribute('data-app-mode', 'standalone');
}

createRoot(document.getElementById("root")!).render(<App />);
