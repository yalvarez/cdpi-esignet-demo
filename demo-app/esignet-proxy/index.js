import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem'; 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const issuer = 'http://146.190.122.50:8088';
const clientId = 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoVh41';
const tokenEndpoint = issuer + '/v1/esignet/oauth/v2/token';
const userInfoEndpoint = issuer + '/v1/esignet/oidc/userinfo';

//this only for testing purposes
const privateKeyJWT = {"kty":"RSA","n":"oVh41yh5KGF7V9zO5DyRWKhIU79GWpjWXUoNLNctoWrXa6rdXjyhZBpqBnD4oTY-SnUBZ4TovhHAgqV3HhQAcsglXKrtaa6M6H0wghsg6afkTkKYz3xGg10UVhsJNIJXCiDDSE0_BWuqJrrkEjJ8FYyyiPpgjNJYdCMj2E4i0yWd4Dww5Z8j6ml8QKOr6DN1OQbgV-VHsUlUgyf0rAb24-8yF4b4_QZx9PotF01UoX-38lE-4lWdMGz6ZktiEfvQFYds4qTQ_5k_RkMiU6xUaEbzQ_LbKE0VEzQyUiaksgGh6PIyt741HRXBHa3w_ohbh-XYm7UWVxFQsMqeuVskNw","e":"AQAB","d":"gL18ZonX6v2lkp0QxJMDks9sLs7Pz1hmq7d7vczQjx0WWMXUru4IBT0CXrNj4BbNK1IjVbt6jrbRei2XV3u0Q-Ip1cBZgdsSeivyOc51u5sIk92V2vEZvpXVtUMLXEeoNd-gkp94atXWxeKYO2DnG7bRenT190eb5sdnQaBPL1RpcVH1cqqFNxGywF0mOku7x5aWoqP4rvyNwzglBvUs4KcDPICaJ9Wk6M5tlD4EBfhM8ZcVv9ceDv0G225oKQBUzomxq36OawJg_82_IQzBZFsbBu8lTwyBakiNqn6SYdNeQQQR4ec3pF_qJZsYtGvZw7S0U-CK5UZeHy7cTncyiQ","p":"9aLEvvP7rH3CPr8u2K-KzIDn5BD8P62QbCAzlHvT0NEfF9mstcgscGp_EqUg44gj_lzKT0DXusCIS2HqChZ-9bFBbpI6W0p38qVnbFus3naPga5yX9kN0-ipaNMuHuJ-1bkHfXAY4MdkOdwicy2EOa3ES8b3YOCz8NsMHgpkDqs","q":"qCc-dTJDm8LCse9UzkAOXNAi8yBObNeh4C2Lk6OwOXcjA1uI5W5f5iTAOcxgAnYDgjJv8fYhbIEPtf2uknO_e0_kGiTiT8oHqV4fxy_rb50hO8DB8qplrVBEV1j4hzfynDqi6UysScRyRWi7a_XHUIrlLIEkL_LP0Hj-hgXZEKU","dp":"W2ZfkzYyFbMNzk9RXSukmAf3QXPYiNFKhhFNYBjbbj4CNdu3WkTL1GCsPAHZxRBpZEKevPLB0ynFDVe3wF0yjLWSRVSABmwlSdKmMznBj13KdFS3FlcrwAg40VqTNMbOrzQUR2aouys2bhktcHIlW1j_S7sTXab_DcZUMfFn3dU","dq":"g23pC4E2BtC7jIgcKPk4QKMOLinaIoiIJchzh_oxCzlrTHyHC4yxuBiRhpuPj1zecS0rAlv20_Asb3rQr_d4etF-4FBj8yldw6ul-vIheyO9jg6jiSBWSJisUflgh4_bOPE71E3xe9bn2gh6NW_tUa6-YYKu3itS8wcfKXH4r2E","qi":"rCDoXzNVxrzvy_0AEweW2oxLIDvoif0E9iB0ZXGFfwRvWmKNLVjR-lQmD6NvlO03DPbEbo2T9SCAluSV0SZphal57W7hHvrGzfIkehulwt1r7fUVwK4YX9cKGeiEvzHcpKfSslcamaHXA9JTNNkuvRsSoveLJkFrfTf_kA8AlS8"};
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
    
   try {
    
    const decodedPayload = getUserInfoFromJwt(text);
    
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
  console.log(`Listening on  http://146.190.122.50:${PORT}`);
});
