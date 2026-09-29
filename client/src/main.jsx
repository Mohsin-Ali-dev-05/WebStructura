import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { applyTheme, DEFAULT_THEME } from './theme/index.js';
import { router } from './router.jsx';
import './styles/theme.css';
import './styles/index.css';

applyTheme(DEFAULT_THEME);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#073834',
            color: '#fff',
            fontFamily: 'Instrument Sans, system-ui, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#86efac',
              secondary: '#073834',
            },
          },
          error: {
            iconTheme: {
              primary: '#fecaca',
              secondary: '#073834',
            },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
);
