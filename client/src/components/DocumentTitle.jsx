import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDocumentTitle } from '../utils/authGate.js';

/**
 * Keeps the browser tab title in sync with the current route.
 */
export default function DocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    document.title = formatDocumentTitle(location.pathname);
  }, [location.pathname]);

  return null;
}
