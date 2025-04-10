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
      const apiUrl = import.meta.env.VITE_API_URL;
      const productsUrl = `${apiUrl}/products`;
      console.log(`Attempting to fetch products from: ${productsUrl}`);

      try {
        setLoading(true);
        setError(null); // Reset error before fetching
        const response = await fetch(productsUrl);
        console.log(`Fetch response status: ${response.status}`);

        if (!response.ok) {
          let errorBody = 'Unknown error';
          try {
            // Try to parse error response from backend
            const errorData = await response.json();
            errorBody = errorData.message || JSON.stringify(errorData);
            console.error('Backend error response:', errorData);
          } catch (parseError) {
            // If parsing fails, use the status text
            errorBody = response.statusText;
            console.error('Could not parse error response, status text:', errorBody);
          }
          throw new Error(`HTTP error ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        console.log('Successfully fetched data:', data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setProducts([]);
          setError('Unexpected data format received from server. Expected an array.');
        }
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'An unknown network error occurred');
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
              sx={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
              image={product.image || 'https://via.placeholder.com/300x300?text=Sneaker'}
              alt={product.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {product.description}
              </Typography>
              <Typography variant="h6" component="p">
                ${product.price.toFixed(2)}
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
              <Button fullWidth size="medium" variant="contained" onClick={() => handleAddToCart(product)}>
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