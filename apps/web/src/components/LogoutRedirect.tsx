import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // If opened as a popup, notify the opener and close
    if (window.opener && window.opener !== window) {
      try {
        window.opener.postMessage({ type: 'logout-callback', success: true }, window.location.origin);
      } catch (e) {
        // Fallback: ignore errors
      }
      window.close();
    } else {
      // Fallback: redirect in same window
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return null;
};

export default LogoutRedirect;
