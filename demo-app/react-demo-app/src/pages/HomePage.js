import React from 'react';
import { oidcSettings } from '../oidc-config';
const HomePage = () => {
    
  const nonce = `${Math.floor(Date.now() / 1000)}-${Math.random()}`;
  
  const login = () => {
                     
    const authUrl = `http://localhost:3000/authorize?nonce=${nonce}&state=eree2311&client_id=${oidcSettings.client_id}&redirect_uri=${encodeURIComponent(oidcSettings.redirect_uri)}&scope=openid profile&response_type=code&acr_values=mosip:idp:acr:generated-code&claims={"userinfo":{"given_name":{"essential":true},"phone_number":{"essential":false},"email":{"essential":true},"picture":{"essential":false},"gender":{"essential":false},"birthdate":{"essential":false},"address":{"essential":false}},"id_token":{}}&claims_locales=en&display=page&ui_locales=en-US`;
    window.location.href = authUrl;

  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenido</h1>
      <button onClick={login}>Iniciar sesión con Esignet</button>
    </div>
  );
};

export default HomePage;
