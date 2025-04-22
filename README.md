# LUMINA E-Commerce Store

## Internship Project for Euphoria GenX

This project was completed as part of an internship and training program with **Euphoria GenX**. It demonstrates proficiency in full-stack development using the MERN stack (MongoDB, Express, React, Node.js) with Razorpay payment integration.

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

## Internship Details

**Organization**: Euphoria GenX
**Position**: Full Stack Developer Intern
**Duration**: 3 months
**Project**: LUMINA E-Commerce Store
**Technologies**: MERN Stack (MongoDB, Express, React, Node.js), Razorpay Integration

## Key Learnings

- Developed a complete e-commerce solution from scratch
- Implemented secure user authentication and authorization
- Created responsive UI with Tailwind CSS and dark/light theme support
- Integrated Razorpay payment gateway for secure transactions
- Built an interactive admin dashboard for product and order management
- Gained experience in state management using React Context API
- Implemented proper error handling and user feedback mechanisms

## Certification

Upon successful completion of this internship project, Euphoria GenX awarded a certificate of completion recognizing the skills and knowledge gained during the training program. The project met all the requirements and standards set by the organization, demonstrating proficiency in full-stack web development.

## Acknowledgments

- [Euphoria GenX](https://euphoriagenx.com/) for the opportunity and guidance
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Razorpay](https://razorpay.com/)

## Conclusion

This internship project with Euphoria GenX has been an invaluable learning experience, providing hands-on experience with modern web development technologies and best practices. The LUMINA E-Commerce Store project demonstrates the ability to build a complete, production-ready web application with features comparable to commercial e-commerce platforms.

The skills and knowledge gained during this internship have laid a strong foundation for a career in full-stack web development, with practical experience in both frontend and backend technologies, as well as third-party integrations like payment gateways.
