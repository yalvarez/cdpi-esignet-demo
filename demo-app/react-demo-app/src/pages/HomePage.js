import React, { useEffect } from 'react';
import { oidcSettings } from '../oidc-config';

const HomePage = () => {

  const nonce = `${Math.floor(Date.now() / 1000)}-${Math.random().toString(36).substring(2)}`;

  // const login = () => {
  //   const authUrl = `http://20.94.41.164:3000/authorize?nonce=${nonce}&state=eree2311&client_id=${oidcSettings.client_id}&redirect_uri=${encodeURIComponent(oidcSettings.redirect_uri)}&scope=openid profile&response_type=code&acr_values=mosip:idp:acr:generated-code&claims=${encodeURIComponent('{"userinfo":{"given_name":{"essential":true},"phone_number":{"essential":false},"email":{"essential":true},"picture":{"essential":false},"gender":{"essential":false},"birthdate":{"essential":false},"address":{"essential":false}},"id_token":{}}')}&claims_locales=en&display=page&ui_locales=en-US`; 
  //   window.location.href = authUrl;
  // };

  useEffect(() => {

    const renderEsignetButton = () => {

        window.SignInWithEsignetButton?.init({
          signInElement: window.document.getElementById('sign-in-with-esignet-standard'),
          buttonConfig: {
            labelText: 'Sign in with e-Signet',
            shape: 'soft_edges',
            theme: 'filled_orange',
            type: 'standard'
          },
          oidcConfig: {
            acr_values: 'mosip:idp:acr:generated-code mosip:idp:acr:biometrics mosip:idp:acr:static-code',
            authorizeUri: 'https://cdpiesignet.duckdns.org/authorize',
            //claims:{"userinfo":{"name":{"essential":true},"email":null,"phone_number":{"essential":true}},"id_token":{"auth_time":{"essential":true}}},
            claims_locales: 'en',
            client_id: oidcSettings.client_id,
            display: 'page',
            max_age: 21,
            nonce: nonce,
            prompt: 'consent',
            redirect_uri: 'https://cdpiapp.duckdns.org/callback',
            scope: 'openid profile',
            state: 'eree2311',
            ui_locales: 'en'
          }
        });

    };
    renderEsignetButton();
  }, []);


  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <h1>Welcome to CDPI Demo</h1>
        <div id="sign-in-with-esignet-standard"></div> 
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',   
    minHeight: '100vh',     
    width: '100vw',     
    backgroundColor: '#f0f2f5',
  },
  contentWrapper: {
    textAlign: 'center',     
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  button: {
    marginTop: '20px', 
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
};

export default HomePage;