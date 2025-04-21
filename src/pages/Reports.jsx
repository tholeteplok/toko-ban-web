import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { BarChart, LineChart } from '../components/Charts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Grid, Paper, Typography, Box, Tabs, Tab, TextField } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Reports() {
  const [value, setValue] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [productSales, setProductSales] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchDailyData();
    fetchMonthlyData();
    fetchYearlyData();
    fetchProductSales();
  }, [startDate, endDate]);

  const fetchDailyData = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('created_at, total')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });
    
    if (data) {
      const grouped = data.reduce((acc, transaction) => {
        const date = new Date(transaction.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + transaction.total;
        return acc;
      }, {});
      
      setDailyData(Object.entries(grouped).map(([date, total]) => ({ date, total }));
    }
  };

  const fetchMonthlyData = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('created_at, total');
    
    if (data) {
      const grouped = data.reduce((acc, transaction) => {
        const date = new Date(transaction.created_at);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        acc[monthYear] = (acc[monthYear] || 0) + transaction.total;
        return acc;
      }, {});
      
      setMonthlyData(Object.entries(grouped).map(([monthYear, total]) => ({ 
        month: monthYear.split('-')[1], 
        year: monthYear.split('-')[0], 
        total 
      }));
    }
  };

  const fetchYearlyData = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('created_at, total');
    
    if (data) {
      const grouped = data.reduce((acc, transaction) => {
        const year = new Date(transaction.created_at).getFullYear();
        acc[year] = (acc[year] || 0) + transaction.total;
        return acc;
      }, {});
      
      setYearlyData(Object.entries(grouped).map(([year, total]) => ({ year, total }));
    }
  };

  const fetchProductSales = async () => {
    const { data } = await supabase
      .from('transaction_items')
      .select('product_id, products(name, brand), quantity, price');
    
    if (data) {
      const grouped = data.reduce((acc, item) => {
        const product = item.products;
        if (!acc[product.name]) {
          acc[product.name] = {
            name: product.name,
            brand: product.brand,
            quantity: 0,
            revenue: 0
          };
        }
        acc[product.name].quantity += item.quantity;
        acc[product.name].revenue += item.quantity * item.price;
        return acc;
      }, {});
      
      setProductSales(Object.values(grouped));
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <DatePicker
                    label="Dari Tanggal"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    label="Sampai Tanggal"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Paper>
          
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="Harian" />
                <Tab label="Bulanan" />
                <Tab label="Tahunan" />
                <Tab label="Produk" />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Typography variant="h6" gutterBottom>
                Penjualan Harian
              </Typography>
              <div style={{ height: '400px' }}>
                <LineChart 
                  data={dailyData} 
                  xKey="date" 
                  yKey="total" 
                  xLabel="Tanggal" 
                  yLabel="Total Penjualan" 
                />
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Typography variant="h6" gutterBottom>
                Penjualan Bulanan
              </Typography>
              <div style={{ height: '400px' }}>
                <BarChart 
                  data={monthlyData} 
                  xKey="month" 
                  yKey="total" 
                  xLabel="Bulan" 
                  yLabel="Total Penjualan" 
                  groupBy="year"
                />
              </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Typography variant="h6" gutterBottom>
                Penjualan Tahunan
              </Typography>
              <div style={{ height: '400px' }}>
                <BarChart 
                  data={yearlyData} 
                  xKey="year" 
                  yKey="total" 
                  xLabel="Tahun" 
                  yLabel="Total Penjualan" 
                />
              </div>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Typography variant="h6" gutterBottom>
                Penjualan per Produk
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Jumlah Terjual
                    </Typography>
                    <div style={{ height: '300px' }}>
                      <BarChart 
                        data={productSales} 
                        xKey="name" 
                        yKey="quantity" 
                        xLabel="Produk" 
                        yLabel="Jumlah Terjual" 
                        colorBy="brand"
                      />
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Pendapatan per Produk
                    </Typography>
                    <div style={{ height: '300px' }}>
                      <BarChart 
                        data={productSales} 
                        xKey="name" 
                        yKey="revenue" 
                        xLabel="Produk" 
                        yLabel="Pendapatan (Rp)" 
                        colorBy="brand"
                      />
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </Box>
      </div>
    </div>
  );
}
