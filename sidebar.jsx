import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Inventory, Receipt, Assessment, Settings } from '@mui/icons-material';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="/assets/logo.png" alt="Logo Toko Ban" className="logo" />
      </div>
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/products">
          <ListItemIcon><Inventory /></ListItemIcon>
          <ListItemText primary="Produk" />
        </ListItem>
        <ListItem button component={Link} to="/transactions">
          <ListItemIcon><Receipt /></ListItemIcon>
          <ListItemText primary="Transaksi" />
        </ListItem>
        <ListItem button component={Link} to="/reports">
          <ListItemIcon><Assessment /></ListItemIcon>
          <ListItemText primary="Laporan" />
        </ListItem>
        <ListItem button component={Link} to="/settings">
          <ListItemIcon><Settings /></ListItemIcon>
          <ListItemText primary="Pengaturan" />
        </ListItem>
      </List>
    </div>
  );
}
