import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem'; 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const issuer = 'http://localhost:8088';
const clientId = 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwri_B';
const tokenEndpoint = issuer + '/v1/esignet/oauth/v2/token';
const userInfoEndpoint = issuer + '/v1/esignet/oidc/userinfo';

//this only for testing purposes
const privateKeyJWT = {"kty":"RSA","n":"wri_B6j-nUQaodBycHfpcX1wUgjB0KfuXGC8N_0rZeACoV7ddhYJZQYrTfVicUi9B064fgilcB52jSxcvd_8HHLQkW-Fi0s-YTtRO_O_5wiXJ--K7FNcW01vitglGaE48RBqaNAUe2a9K5lYNpTdLaSpRxNkU6JDBpZoLSQ6vRt3rCLhOz-iaagc4SxxMPwLjDtdVM-OC2UI19tmAsNusPvuG5tzCKllALfKHuakp7IqJny6XKSY9Uy9VGSk3Alf_R2hVl5c9ASmHNoDHkTlIBrlb04xz3Q2jpYrf3iR0T_BrmZuFjI4Vhuv75yTymBEEM_ceWlZAvT9uOfhuoxF-w","e":"AQAB","d":"qCvYyGva4sZD3gbiH2Jg2mSE0kS_505x3ZSqWgysI4Mxol8FE4x6tqZ6Vg0c5Uv1_c6uJiOfhlK4_roWquI8ofFDUqgnhSMKD_2j7gxZa9aOfa4zpGFmfXBGanq8qAMG46PS0w0K83zK2lHIzvMIhvgUPs9vsY-NJa5W8M2-cT06waRQiceXee1htfJWcHkJfJ-BJWIw6Z36Z0RUlmLGAe1SdzfCg6qqb9oZaRzgX5pOUvHbwqc2K9XAkoZx9uosDlzTOCJ03g3rafAr9IY8uCLJIMvzj4C_ozLZh3M-fNArcPm_zlwzuAYmkwu_fTX0fmlUA9oAq5BM6vSIjvpfgQ","p":"6NoZHMQq2Mr4SLTv5OIWpq5z0jxmaFPm9Koc35qI76j8587mQe3cPhSCe1H4oTArOFvLpxrA7fETjFrPwWeYUSI8uJBdMGZ89rHne0fnbUGqxdod6IFiTZuMgGDp5OUnAEc82zKIsjvagXq4BCNBZsp86T9B931HiQxu7HoCwME","q":"1hRDEAUDbE0hePefHRdaVDXG3a8NlIKjddzoaYL-Sk8tCL-kdC1czGrXl6ZTWebSwxLfJGWVhuIH3ON_Cm1Mo84LCrfJPU2mU1-D8SP_5vMIbjFEw62-6OitmzTcV8GJsgP03XLZBwIkyLjvBlHs6Q9IAd8YLVpFg1luIw6-ubs","dp":"lu1e351rJFATNJVK9TFyeyGSYw_RVQglKCrnQiwZXDZNjzc1WkCBxB9pH-PW4yukqAgf7bVSnifngs8N4I90VAp8DylLreaQUxqnLupBYDjzJwEk56KNhD4xiLjIghvh9rU2BeIwZk6TZ9-STORJLQZMhqcA7Bjg-Dz93PuMs0E","dq":"ARgja56K8O_H_wVNA-oNpSaNOK7fY-XzDfQuH_PydtDGyyenoIxm0Aivx2-rN2dtpl-fUmFOjVz0a1WiXZxHawLvnYNo_O47rmtrkjz73uNZJK8Nye5GboxZ7tQrWCt-F7Hbe5JNt7J0G66OUjry-hIA7TmFtx2iA1TeskEuCmc","qi":"qIaPy92AY5P_ghujZYJzqU-cAY22ksd2f_A8uiU7kYx8DqYSogtT6qnAtCPQ6rE_ZGtpPZQYiSLaMsqQF5nD9Tip3KyyoAh7H2bgmuq-RdXu_kQ_zn-i7xR_-WU5rUarBHffFOLT-xHS-IeECKBsa7Fz23ZInh4L5wZY8deb_OM"};
const audience = tokenEndpoint;
const privateKey = jwkToPem(privateKeyJWT, { private: true }); 
/////////

app.post('/token', async (req, res) => {

    try {
    
        const now = Math.floor(Date.now() / 1000);

const payload = { 
      sub: clientId,
      aud: audience,
      iss: clientId,      
      jti: `${now}-${Math.random()}`,
      exp: now + 300,
      iat: now,
      nbf: now,
      nonce: "973eieljzng",
      acr: "mosip:idp:acr:generated-code",
    };

    const signOptions = {
      algorithm: 'RS256',
      header: {
        typ: 'JWT'
      }
    };

    const clientAssertion = jwt.sign(payload, privateKey, signOptions);

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('token_endpoint_auth_method','private_key_jwt');
    params.append('response_type','code');
    params.append('code', req.body.code);
    params.append('redirect_uri', req.body.redirect_uri);
    params.append('client_id', clientId);
    params.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
    params.append('client_assertion', clientAssertion);

    console.log('params.toString():', params.toString());

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
      body: params.toString()
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    res.status(500).json({ error: 'Error al solicitar el token' });
  }
});

app.get('/userinfo', async (req, res) => {

  try {

    const authHeader = req.headers.authorization;

    const response = await fetch(userInfoEndpoint, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    });

    const text = await response.text(); 
    console.log('userinfo response:', text);
    
   try {
    
    //const data = JSON.parse(decodedPayload);
    
    const decodedPayload = getUserInfoFromJwt(text);
    
    console.log('decodedPayload:', decodedPayload);

    res.status(response.status).json(decodedPayload);
    } catch (err) {
        console.log('Error parsing JSON:', err);
    res.status(500).json({ error: 'Invalid JSON received from userinfo endpoint', raw: text });
    }

  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

function getUserInfoFromJwt(jwt) {

    console.log('jwt:', jwt);
  const parts = jwt.split('.');

  if (parts.length !== 3) {
    throw new Error('Token JWT inválido');
  }

  // Decodifica el payload (segunda parte)
  const payload = parts[1];

  // Añade padding si falta (base64url → base64 estándar)
  const padded = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=');

  // Decodifica el base64 a string
  const decoded = Buffer.from(padded, 'base64').toString('utf8');

  // Convierte el string en objeto JSON
  const userInfo = JSON.parse(decoded);

  return userInfo;
}


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Listening on  http://localhost:${PORT}`);
});
