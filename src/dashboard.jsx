import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import { Grid, Box } from '@mui/material';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    monthlySales: 0,
    lowStock: 0,
    pendingVerifications: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Get today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: todayData } = await supabase
      .from('transactions')
      .select('total')
      .gte('created_at', today.toISOString());
    
    const todaySales = todayData.reduce((sum, t) => sum + t.total, 0);
    
    // Get monthly sales
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const { data: monthlyData } = await supabase
      .from('transactions')
      .select('total')
      .gte('created_at', firstDayOfMonth.toISOString());
    
    const monthlySales = monthlyData.reduce((sum, t) => sum + t.total, 0);
    
    // Get low stock products
    const { data: lowStockData } = await supabase
      .from('products')
      .select('*')
      .lt('stock', 5);
    
    // Get pending verifications
    const { data: verificationsData } = await supabase
      .from('stock_verifications')
      .select('*')
      .eq('status', 'pending');
    
    setStats({
      todaySales,
      monthlySales,
      lowStock: lowStockData.length,
      pendingVerifications: verificationsData.length
    });
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                title="Penjualan Hari Ini" 
                value={`Rp${stats.todaySales.toLocaleString()}`} 
                color="red" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                title="Penjualan Bulan Ini" 
                value={`Rp${stats.monthlySales.toLocaleString()}`} 
                color="blue" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                title="Stok Menipis" 
                value={stats.lowStock} 
                color="yellow" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                title="Verifikasi Pending" 
                value={stats.pendingVerifications} 
                color="grey" 
              />
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
}
