import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
          credentials: 'include',
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          No orders found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
        >
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>

      {orders.map((order) => (
        <Paper key={order.id} sx={{ mb: 3, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Order #{order.id}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={order.status.toUpperCase()}
                color={getStatusColor(order.status)}
              />
              {order.trackingNumber && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank')}
                >
                  Track Order
                </Button>
              )}
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
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
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </Typography>
              <Typography>{order.shippingAddress.address}</Typography>
              <Typography>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </Typography>
              <Typography>{order.shippingAddress.country}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" gutterBottom>
                Order Total
              </Typography>
              <Typography variant="h6">
                ${(order.total / 100).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ordered on {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default OrderHistory; 