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

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    // if (!code) {
    //   setStatus('No se encontró el código de autorización');
    //   return;
    // }

    const fetchInfo = async () => {
      try {

      const response = await fetch('http://localhost:4000/userinfo', {
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
        setUserInfo('Error al intercambiar el código');
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
