import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oidcSettings } from '../oidc-config';

const CallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Procesando autenticación...');

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      setStatus('No se encontró el código de autorización');
      return;
    }

    const fetchToken = async () => {
      try {

        //let client_assertion ='eyJhbGciOiJSUzI1NiIsImtpZCI6ImVzaWduZXQtdWktY2xpZW50LWtleSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlc2lnbmV0LXVpLWNsaWVudCIsInN1YiI6ImVzaWduZXQtdWktY2xpZW50IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDg4L3YxL2VzaWduZXQvb2F1dGgvdjIvdG9rZW4iLCJleHAiOjE3MTY3NDEyMjEsImlhdCI6MTcxNjc0MDkyMSwianRpIjoiZmFhM2FkZDUtNTVkMi00NjY0LTk4ZjUtNmIxMmI4NDgxZjY3In0.QQ2s5wAFw3L8kD6Rx9Q9EEUs1AjUjUspAzYZxctSuGiLyFqcoPtLVFwCswxWkOS_O9HglilfBUE8KeRZ0v0vE6FKuAwfUDoKl1zvJmvqKYP_cW7Q_JD_PcIG8FbgO-QnRHE_GtdZJZTySkhCyqZABmOwJXqPt2KmnUV4B6ZTSt6tCOOfwGHkAHIVY6ZdLqXodWDQeCluPIGoGRJHgw8ROkTZAZs95_0nRk_3zY3FydFViQt_lDO9pB_kcDYPee6fd_vlCUMYzeYtyAJxvJMcOaAmD6HuImFv5vIcsL7XKVm7c5zqYbqYK41JPapfopOoxXm93utqtzUwHuLD_j8oMiQ';

        const response = await fetch('http://localhost:4000/token', {
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
          setStatus('Autenticado con éxito. Redirigiendo...');
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
