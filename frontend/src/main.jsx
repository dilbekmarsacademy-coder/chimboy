import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './i18n';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '10px', background: '#212121', color: '#fff' },
          success: { iconTheme: { primary: '#2E7D32', secondary: '#fff' } },
          error: { iconTheme: { primary: '#C62828', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
