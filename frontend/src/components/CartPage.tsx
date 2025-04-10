import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, quantity: string) => {
    const newQuantity = parseInt(quantity, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 50, height: 50, marginRight: 16 }}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    inputProps={{ min: 1 }}
                    size="small"
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell align="right">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => removeItem(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" gutterBottom>
            Total: ${(total / 100).toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CartPage; 