# E-Commerce API with React Frontend

This is a full-stack e-commerce application with a secure backend API and a modern React frontend.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (for the database)

## Project Structure

```
ecommerce-api/
├── frontend/           # React TypeScript frontend
├── models/            # Database models
├── routes/            # API routes
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── config/            # Configuration files
└── utils/             # Utility functions
```

## Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

3. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID

### Cart
- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:productId` - Update cart item
- DELETE `/api/cart/:productId` - Remove item from cart

### Orders
- POST `/api/checkout` - Create new order
- GET `/api/checkout` - Get user's orders

## Security Features

- JWT Authentication
- Rate Limiting
- XSS Protection
- NoSQL Injection Prevention
- CORS Configuration
- Request Body Size Limits
- Helmet Security Headers
- HTTP Parameter Pollution Prevention
- Content Security Policy
- Request Compression
- Secure Session Management
- Input Validation
- Error Handling with Stack Traces (Development Only)

## Frontend Features

- TypeScript Support
- Material-UI Components
- Responsive Design
- State Management
- Form Validation
- Error Handling
- Loading States

## Deployment Guide

### Backend Deployment

1. **Prepare for Production**
   - Set `NODE_ENV=production` in your environment variables
   - Update CORS settings to allow only your production frontend domain
   - Ensure all sensitive data is properly configured in environment variables

2. **Database Setup**
   - Use a managed MongoDB service (e.g., MongoDB Atlas)
   - Set up proper database backups
   - Configure database indexes for optimal performance

3. **Server Requirements**
   - Node.js v16 or higher
   - At least 1GB RAM
   - Process manager (PM2 recommended)

4. **Deployment Steps**
   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Build the application
   npm run build

   # Start the application with PM2
   pm2 start server.js --name "ecommerce-api"

   # Set up PM2 to start on system reboot
   pm2 startup
   pm2 save
   ```

5. **SSL/TLS Configuration**
   - Use Let's Encrypt for free SSL certificates
   - Configure your web server (Nginx/Apache) as a reverse proxy
   - Set up proper SSL redirects

### Frontend Deployment

1. **Build the Application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Static File Serving**
   - Use a CDN for static assets
   - Configure proper caching headers
   - Set up proper redirects for client-side routing

3. **Environment Configuration**
   - Update API endpoints to point to production backend
   - Configure proper CORS settings
   - Set up proper error tracking (e.g., Sentry)

### Monitoring and Maintenance

1. **Logging**
   - Set up proper logging (e.g., Winston)
   - Configure log rotation
   - Set up log aggregation (e.g., ELK Stack)

2. **Monitoring**
   - Set up application monitoring (e.g., New Relic)
   - Configure error tracking
   - Set up performance monitoring

3. **Backup Strategy**
   - Regular database backups
   - Configuration backups
   - Disaster recovery plan

4. **Security Updates**
   - Regular dependency updates
   - Security patch management
   - Regular security audits

### Scaling Considerations

1. **Horizontal Scaling**
   - Use load balancers
   - Configure session management
   - Set up proper caching

2. **Database Scaling**
   - Consider sharding for large datasets
   - Set up read replicas
   - Configure proper indexing

3. **Caching Strategy**
   - Implement Redis for session storage
   - Set up proper cache invalidation
   - Configure CDN caching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- MongoDB Atlas account
- Stripe account

### Backend Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   MONGODB_URI=your_mongodb_uri
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   VITE_API_URL=your_api_url
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

### Running the Application
1. Start the backend:
   ```bash
   npm start
   ```
2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### Deployment
The application is deployed on:
- Backend: AWS Lambda + API Gateway
- Frontend: [Your chosen hosting platform]

### Environment Variables
Required environment variables for the backend:
- `MONGODB_URI`: MongoDB connection string
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

Required environment variables for the frontend:
- `VITE_API_URL`: Backend API URL
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key

### Testing
1. Use Stripe test card numbers:
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002
2. Test webhook events in Stripe Dashboard

### Support
For issues or questions, please open an issue in the repository.
