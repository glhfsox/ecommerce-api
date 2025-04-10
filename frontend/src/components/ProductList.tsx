import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Alert, Box } from '@mui/material';
import { useCart } from '../context/CartContext';
import { Product } from '../types'; // Assuming you have a Product type defined

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        console.log(`Fetching products from: ${apiUrl}/products`);
        const response = await fetch(`${apiUrl}/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched products:', data);
        if (Array.isArray(data)) {
            setProducts(data);
        } else {
            console.error('Fetched data is not an array:', data);
            setProducts([]); // Set to empty array if data is not as expected
            setError('Unexpected data format received from server.');
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const itemToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image || '',
    };
    addItem(itemToAdd);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load products: {error}</Alert>;
  }

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item key={product._id} xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              sx={{ height: 140 }}
              image={product.image || 'https://via.placeholder.com/150'}
              alt={product.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                ${product.price.toFixed(2)}
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, mt: 'auto' }}>
              <Button size="small" variant="contained" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </Button>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList; 