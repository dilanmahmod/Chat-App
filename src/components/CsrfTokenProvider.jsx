import { useEffect, useRef } from 'react';

const CsrfTokenProvider = ({ setCsrfToken }) => {
  const hasFetchedToken = useRef(false);

  useEffect(() => {
    if (!hasFetchedToken.current) {
      hasFetchedToken.current = true;

      fetch('https://chatify-api.up.railway.app/csrf', {
        method: 'PATCH',
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch CSRF token');
        return res.json();
      })
      .then(data => {
        console.log('Fetched CSRF Token:', data.csrfToken);
        setCsrfToken(data.csrfToken);
      })
      .catch(err => {
        console.error('Failed to fetch CSRF token', err);
      });
    }
  }, [setCsrfToken]);

  return null;
};

export default CsrfTokenProvider;