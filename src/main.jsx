import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Pastikan ini diimpor
import App from './App';
import './styles/main.css';
import './styles/colors.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ef5350', // Warna merah untuk Bridgestone
    },
    secondary: {
      main: '#42a5f5', // Warna biru untuk GT
    },
    bridgestone: {
      main: '#e31937', // Merah khas Bridgestone
    },
    dunlop: {
      main: '#ffd700', // Kuning khas Dunlop
    },
    gt: {
      main: '#005baa', // Biru khas Gajah Tunggal
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter basename="/"> {/* Tambahkan BrowserRouter di sini */}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
