'use client';

import { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Container,
  Paper,
} from '@mui/material';

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

    const login = () => {
      const authUrl = `https://cdpiesignet.duckdns.org/authorize?nonce=${nonce}&state=eree2311&client_id=${oidcSettings.client_id}&redirect_uri=${encodeURIComponent(oidcSettings.redirect_uri)}&scope=openid profile&response_type=code&acr_values=mosip:idp:acr:generated-code&claims=${encodeURIComponent('{"userinfo":{"given_name":{"essential":true},"phone_number":{"essential":false},"email":{"essential":true},"picture":{"essential":false},"gender":{"essential":false},"birthdate":{"essential":false},"address":{"essential":false}},"id_token":{}}')}&claims_locales=en&display=page&ui_locales=en-US`; 
      window.location.href = authUrl;
    };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      setStatus('No se encontró el código de autorización');
      return;
    }

    const fetchInfo = async () => {
      try {

      const response = await fetch('https://cdpiapp.duckdns.org/proxyapp/userinfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('response:', response);

        const data = await response.json();

        if (data) {
          setUserInfo(data);
        } else {
          setUserInfo(data.error);
        }
      } catch (err) {
        console.error(err);
        setUserInfo('Error getting user info');
      }
    };

    fetchInfo();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo) {
    return <div>Loding user info...</div>;
  }

   return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            alt={userInfo.name}
            src={userInfo.picture}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {userInfo.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {userInfo.email}
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">{userInfo.phone_number}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  DOB
                </Typography>
                <Typography variant="body1">{userInfo.birthdate}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Gender
                </Typography>
                <Typography variant="body1">{userInfo.gender}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  (sub)
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {userInfo.sub}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
}
