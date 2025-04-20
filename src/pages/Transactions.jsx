import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Grid } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useReactToPrint } from 'react-to-print';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receiptRef, setReceiptRef] = useState();
  
  const columns = [
    { field: 'id', headerName: 'ID Transaksi', width: 200 },
    { field: 'created_at', headerName: 'Tanggal', width: 200, valueFormatter: (params) => new Date(params.value).toLocaleString() },
    { field: 'total', headerName: 'Total', width: 150, valueFormatter: (params) => `Rp${params.value.toLocaleString()}` },
    { field: 'payment_method', headerName: 'Metode Pembayaran', width: 150 },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => handlePrintReceipt(params.row)}
        >
          Cetak
        </Button>
      )
    }
  ];

  const handlePrint = useReactToPrint({
    content: () => receiptRef,
  });

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error(error);
    else setTransactions(data);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) console.error(error);
    else setProducts(data);
  };

  const handleAddToCart = (product) => {
    const existingItem = selectedProducts.find(p => p.id === product.id);
    
    if (existingItem) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id ? {...p, quantity: p.quantity + 1} : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, {
        ...product,
        quantity: 1
      }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    
    setSelectedProducts(selectedProducts.map(p => 
      p.id === productId ? {...p, quantity: quantity} : p
    ));
  };

  const handleCheckout = async () => {
    const user = supabase.auth.user();
    const total = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        user_id: user.id,
        total,
        payment_method: paymentMethod
      }])
      .select()
      .single();
    
    if (transactionError) {
      console.error(transactionError);
      return;
    }
    
    // Create transaction items
    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(selectedProducts.map(p => ({
        transaction_id: transaction.id,
        product_id: p.id,
        quantity: p.quantity,
        price: p.price
      })));
    
    if (itemsError) {
      console.error(itemsError);
      return;
    }
    
    // Update product stocks
    for (const item of selectedProducts) {
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: item.stock - item.quantity })
        .eq('id', item.id);
      
      if (stockError) console.error(stockError);
    }
    
    setSelectedProducts([]);
    setPaymentMethod('cash');
    setOpenDialog(false);
    fetchTransactions();
  };

  const handlePrintReceipt = (transaction) => {
    // Implement receipt printing logic
    // This would involve fetching transaction details and showing a printable receipt
    console.log('Printing receipt for transaction:', transaction);
    // For actual implementation, you would create a receipt component and use react-to-print
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
            Transaksi Baru
          </Button>
          <DataGrid
            rows={transactions}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
        
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Transaksi Baru</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <h3>Produk</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {products.map(product => (
                    <div key={product.id} style={{ 
                      border: '1px solid #ddd', 
                      padding: '10px', 
                      borderRadius: '5px',
                      backgroundColor: product.brand === 'Bridgestone' ? '#ffebee' : 
                                      product.brand === 'Dunlop' ? '#fff8e1' : '#e3f2fd'
                    }}>
                      <h4>{product.name}</h4>
                      <p>Merek: {product.brand}</p>
                      <p>Ukuran: {product.size}</p>
                      <p>Harga: Rp{product.price.toLocaleString()}</p>
                      <p>Stok: {product.stock}</p>
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        Tambah
                      </Button>
                    </div>
                  ))}
                </div>
              </Grid>
              <Grid item xs={12} md={5}>
                <h3>Keranjang</h3>
                {selectedProducts.length === 0 ? (
                  <p>Keranjang kosong</p>
                ) : (
                  <div>
                    {selectedProducts.map(item => (
                      <div key={item.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '10px',
                        padding: '10px',
                        border: '1px solid #eee'
                      }}>
                        <div>
                          <p>{item.name} ({item.brand})</p>
                          <p>Rp{item.price.toLocaleString()} x {item.quantity}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Button 
                            size="small" 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                          <Button 
                            size="small" 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </Button>
                          <Button 
                            size="small" 
                            color="error"
                            onClick={() => handleRemoveFromCart(item.id)}
                            style={{ marginLeft: '10px' }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: '20px' }}>
                      <h4>Total: Rp{selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}</h4>
                      <Select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        fullWidth
                        style={{ marginTop: '10px' }}
                      >
                        <MenuItem value="cash">Tunai</MenuItem>
                        <MenuItem value="transfer">Transfer</MenuItem>
                        <MenuItem value="credit">Kredit</MenuItem>
                      </Select>
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Batal</Button>
            <Button 
              onClick={handleCheckout} 
              disabled={selectedProducts.length === 0}
              variant="contained"
              color="primary"
            >
              Checkout
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
