'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import { useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

export function AuthButton() {
  const { data: session, status } = useSession();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  if (status === 'loading') return null;

  if (!session) {
    return (
      <Button
        color="inherit"
        variant="outlined"
        size="small"
        startIcon={<LoginIcon />}
        onClick={() => signIn('google')}
        sx={{ borderColor: 'rgba(255,255,255,0.4)', ml: 1 }}
      >
        Sign in
      </Button>
    );
  }

  return (
    <>
      <Box
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 1 }}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        <Avatar
          src={session.user?.image || undefined}
          alt={session.user?.name || ''}
          sx={{ width: 32, height: 32 }}
        />
      </Box>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2">{session.user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {session.user?.email}
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            <Chip label="Free plan" size="small" color="default" />
          </Box>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchor(null);
            signOut({ callbackUrl: '/' });
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
