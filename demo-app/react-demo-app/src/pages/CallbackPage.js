import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oidcSettings } from '../oidc-config';

const CallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating...');

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      setStatus('authorization_code not found in URL');
      return;
    }

    const fetchToken = async () => {
      try {

        const response = await fetch('https://cdpiapp.duckdns.org/proxyapp/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code: code,
            redirect_uri: oidcSettings.redirect_uri,
          })
        });

        const data = await response.json();

        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('id_token', data.id_token);
          setStatus('User Authenticated!!!!. Redirecting...');
          setTimeout(() => navigate('/profile'), 1000);
        } else {
          setStatus(data.error);
        }
      } catch (err) {
        console.error(err);
        setStatus('Error al intercambiar el código');
      }
    };

    fetchToken();
  }, [navigate]);

  return <div style={{ padding: 20 }}>{status}</div>;
};

export default CallbackPage;
