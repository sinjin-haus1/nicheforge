'use client';

import { signIn } from 'next-auth/react';
import { Box, Button, Card, CardContent, Typography, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700}>
              NicheForge
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Find profitable faceless YouTube niches and generate viral hooks — powered by real YouTube data.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={() => signIn('google', { callbackUrl: '/' })}
            sx={{ fontWeight: 600, py: 1.5 }}
          >
            Continue with Google
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Free plan includes 5 niche searches + 10 hook generations per month.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
