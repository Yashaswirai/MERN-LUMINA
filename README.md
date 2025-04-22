# LUMINA E-Commerce Store

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with Razorpay payment integration.

## Features

- User authentication (register, login, profile management)
- Product browsing and searching
- Shopping cart functionality
- Checkout process with Razorpay payment integration
- Order management
- Admin dashboard for product and order management
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- React Icons
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Razorpay for payment processing

## Project Structure

### Frontend
```
Frontend/
├── public/                  # Static files
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Reusable components
│   │   ├── common/          # Shared UI components
│   │   ├── layout/          # Layout components
│   │   └── features/        # Feature-specific components
│   ├── config/              # Configuration files
│   ├── constants/           # Constants and enums
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin pages
│   │   ├── auth/            # Authentication pages
│   │   ├── cart/            # Cart and checkout pages
│   │   ├── product/         # Product pages
│   │   └── user/            # User profile pages
│   ├── routes/              # Route definitions and guards
│   ├── services/            # API services
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript types/interfaces
│   └── utils/               # Utility functions
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global CSS
```

### Backend
```
Backend/
├── config/                  # Configuration files
├── controllers/             # Route controllers
├── middleware/              # Express middleware
├── models/                  # Database models
├── routes/                  # API routes
├── services/                # Business logic
├── utils/                   # Utility functions
├── validations/             # Request validation schemas
├── .env                     # Environment variables
└── index.js                 # Entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Razorpay account for payment integration

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/lumina-store.git
cd lumina-store
```

2. Install backend dependencies
```bash
cd Backend
npm install
```

3. Install frontend dependencies
```bash
cd ../Frontend
npm install
```

4. Create a `.env` file in the Backend directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

5. Start the backend server
```bash
npm start
```

6. Start the frontend development server
```bash
cd ../Frontend
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## Deployment

The application can be deployed to various platforms:

- Frontend: Vercel, Netlify, or any static hosting service
- Backend: Heroku, AWS, DigitalOcean, or any Node.js hosting service
- Database: MongoDB Atlas

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Razorpay](https://razorpay.com/)
