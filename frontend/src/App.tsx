import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import CheckoutPage from './components/CheckoutPage';
import CartPage from './components/CartPage';
import OrderHistory from './components/OrderHistory';
import { CartProvider } from './context/CartContext';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/products" element={<div>Products Page</div>} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/login" element={<div>Login Page</div>} />
              <Route path="/register" element={<div>Register Page</div>} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App; 