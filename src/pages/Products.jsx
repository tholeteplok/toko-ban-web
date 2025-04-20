import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'Bridgestone',
    size: '',
    price: 0,
    stock: 0
  });

  const columns = [
    { field: 'name', headerName: 'Nama Produk', width: 200 },
    { field: 'brand', headerName: 'Merek', width: 150 },
    { field: 'size', headerName: 'Ukuran', width: 100 },
    { field: 'price', headerName: 'Harga', width: 150, valueFormatter: (params) => `Rp${params.value.toLocaleString()}` },
    { field: 'stock', headerName: 'Stok', width: 100 },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 200,
      renderCell: (params) => (
        <>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => handleUpdateStock(params.row)}
            sx={{ mr: 1 }}
          >
            Update Stok
          </Button>
        </>
      )
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) console.error(error);
    else setProducts(data);
  };

  const handleAddProduct = async () => {
    const { error } = await supabase
      .from('products')
      .insert([newProduct]);
    
    if (error) console.error(error);
    else {
      fetchProducts();
      setOpenDialog(false);
      setNewProduct({
        name: '',
        brand: 'Bridgestone',
        size: '',
        price: 0,
        stock: 0
      });
    }
  };

  const handleUpdateStock = async (product) => {
    const newStock = prompt(`Update stok untuk ${product.name} (current: ${product.stock})`, product.stock);
    
    if (newStock && !isNaN(newStock)) {
      // For admin, create verification request
      // For owner, update directly
      const user = supabase.auth.user();
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (userData.role === 'admin') {
        const { error } = await supabase
          .from('stock_verifications')
          .insert([{
            product_id: product.id,
            admin_id: user.id,
            old_stock: product.stock,
            new_stock: parseInt(newStock),
            status: 'pending'
          }]);
        
        if (error) console.error(error);
        else alert('Permintaan verifikasi stok telah dikirim ke owner');
      } else {
        const { error } = await supabase
          .from('products')
          .update({ stock: parseInt(newStock) })
          .eq('id', product.id);
        
        if (error) console.error(error);
        else fetchProducts();
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div style={{ height: 400, width: '100%', padding: '20px' }}>
          <Button 
            variant="contained" 
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 2 }}
          >
            Tambah Produk
          </Button>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
        
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nama Produk"
              fullWidth
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
            <Select
              margin="dense"
              label="Merek"
              fullWidth
              value={newProduct.brand}
              onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
              sx={{ mt: 2 }}
            >
              <MenuItem value="Bridgestone">Bridgestone</MenuItem>
              <MenuItem value="Dunlop">Dunlop</MenuItem>
              <MenuItem value="GT">Gajah Tunggal</MenuItem>
            </Select>
            <TextField
              margin="dense"
              label="Ukuran"
              fullWidth
              value={newProduct.size}
              onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}
              sx={{ mt: 2 }}
            />
            <TextField
              margin="dense"
              label="Harga"
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
              sx={{ mt: 2 }}
            />
            <TextField
              margin="dense"
              label="Stok Awal"
              type="number"
              fullWidth
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Batal</Button>
            <Button onClick={handleAddProduct}>Simpan</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
