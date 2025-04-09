# E-commerce API with Stripe Integration

A full-stack e-commerce application with secure payment processing using Stripe.

## Features

- Secure backend API with Node.js
- TypeScript frontend with React
- MongoDB database integration
- Stripe payment processing
- AWS Lambda webhook handling
- JWT authentication

## Prerequisites

- Node.js (v18 or later)
- MongoDB Atlas account
- Stripe account
- AWS account (for Lambda deployment)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecommerce-api.git
cd ecommerce-api
```

2. Install dependencies:
```bash
npm install
cd frontend
npm install
cd ..
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your credentials

4. Start the development servers:
```bash
# Backend
npm start

# Frontend (in a new terminal)
cd frontend
npm run dev
```

## Deployment

### Backend (AWS Lambda)
1. Create a new Lambda function
2. Upload the `lambda.zip` file
3. Set environment variables
4. Configure API Gateway

### Frontend
Deploy to your preferred platform (Vercel, Netlify, etc.)

## Environment Variables

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `JWT_SECRET`: Secret for JWT tokens
- `FRONTEND_URL`: Frontend application URL

## Testing

Use Stripe test card numbers:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

## Security

- All sensitive data is stored in environment variables
- JWT authentication for API endpoints
- Secure Stripe webhook handling
- CORS configuration for frontend access

## License

ISC
