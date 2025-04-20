import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import { Notifications, AccountCircle } from '@mui/icons-material';

export default function Header({ user }) {
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Toko Ban Maju Jaya
        </Typography>
        <IconButton color="inherit">
          <Notifications />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <Typography variant="subtitle1">{user?.email}</Typography>
      </Toolbar>
    </AppBar>
  );
}
