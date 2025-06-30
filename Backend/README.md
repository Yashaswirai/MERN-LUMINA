# 🚀 LUMINA E-commerce Backend API

> 💡 **A robust, scalable Node.js backend API built with Express, MongoDB, and JWT authentication.**

Welcome to the LUMINA Backend! ⚡ This RESTful API powers our e-commerce platform with secure authentication, product management, order processing, and comprehensive admin functionalities. Built for performance and scalability! 🛡️

## 🚀 Features

### 🔐 Authentication & Security
- **🔑 JWT Authentication**: Secure token-based authentication with HTTP-only cookies
- **🛡️ Password Hashing**: bcryptjs for secure password storage
- **🔒 Protected Routes**: Middleware-based route protection
- **👑 Admin Authorization**: Role-based access control
- **🍪 Cookie Management**: Secure cookie handling with cookie-parser

### 📦 Product Management
- **📝 CRUD Operations**: Complete product lifecycle management
- **🖼️ Image Upload**: Multer-based file upload with validation
- **🔍 Search & Filter**: Advanced product search and filtering
- **📊 Sorting**: Multiple sorting options (newest, popular, discounted)
- **📈 Inventory Management**: Stock tracking and management

### 🛒 Order System
- **📋 Order Creation**: Complete order processing pipeline
- **💳 Payment Integration**: Ready for payment gateway integration
- **📦 Order Tracking**: Status updates and order history
- **👤 User Orders**: User-specific order management
- **👑 Admin Dashboard**: Order management for administrators

### 🎯 Additional Features
- **🌐 CORS Support**: Cross-origin resource sharing
- **📝 Request Logging**: Morgan middleware for HTTP request logging
- **🔧 Environment Variables**: Secure configuration management
- **🗄️ MongoDB Integration**: Mongoose ODM for database operations

## 🛠️ Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</div>

- **🟢 Node.js**: JavaScript runtime environment
- **⚡ Express.js**: Fast, unopinionated web framework
- **🍃 MongoDB**: NoSQL database for flexible data storage
- **🔗 Mongoose**: Elegant MongoDB object modeling
- **🔐 JWT**: JSON Web Tokens for authentication
- **🛡️ bcryptjs**: Password hashing library
- **📁 Multer**: Middleware for handling multipart/form-data
- **🍪 cookie-parser**: Parse HTTP request cookies
- **🌐 cors**: Enable CORS with various options
- **📝 morgan**: HTTP request logger middleware
- **🔧 dotenv**: Environment variable management

## 📦 Installation

> 🚨 **Prerequisites**: Make sure you have [Node.js](https://nodejs.org/) (v16+), [npm](https://www.npmjs.com/), and [MongoDB](https://www.mongodb.com/) installed.

1. **📥 Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **📦 Install dependencies**
   ```bash
   npm install
   ```

3. **🌍 Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **🗄️ Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGO_URI in .env file
   ```

5. **🚀 Start the development server**
   ```bash
   npm run dev
   ```
   
   🎉 Your API will be running at `http://localhost:5000`

6. **🏗️ Set up admin user (optional)**
   ```bash
   node setAdmin.mjs
   ```

## 🏗️ Project Structure

<details>
<summary>📁 Click to expand project structure</summary>

```
Backend/
├── 📁 config/
│   ├── 🗄️ db.js                 # MongoDB connection
│   └── 💳 razorpay.js           # Razorpay configuration
├── 📁 controllers/
│   ├── 📦 productController.js   # Product CRUD operations
│   ├── 👤 userController.js      # User management
│   ├── 📋 orderController.js     # Order processing
│   └── 💳 paymentController.js   # Payment handling
├── 📁 middleware/
│   └── 🔐 authMiddleware.js      # Authentication & authorization
├── 📁 models/
│   ├── 📦 Product.js            # Product schema
│   ├── 👤 User.js               # User schema
│   └── 📋 Order.js              # Order schema
├── 📁 routes/
│   ├── 📦 productRoutes.js      # Product API routes
│   ├── 👤 userRoutes.js         # User API routes
│   ├── 📋 orderRoutes.js        # Order API routes
│   └── 💳 paymentRoutes.js      # Payment API routes
├── 📁 utils/
│   ├── 🔑 generateToken.js      # JWT token generation
│   └── 📁 upload.js             # File upload configuration
├── 🔧 .env                      # Environment variables
├── 📦 package.json              # Dependencies & scripts
├── 🚀 index.js                  # Main server file
└── 👑 setAdmin.mjs              # Admin user setup script
```

</details>

## 🔧 Configuration

### 🌍 Environment Variables
Create a `.env` file in the root directory:
```env
# Database
MONGO_URI=mongodb://localhost:27017/lumina_ecommerce

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=5000
NODE_ENV=development

# Payment (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

<details>
<summary>🗄️ Database Configuration</summary>

The `config/db.js` handles MongoDB connection:
```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
```

</details>

## 🔐 Authentication & Security

### 🔑 JWT Token Management
- **🍪 HTTP-Only Cookies**: Secure token storage
- **⏰ Token Expiration**: 7-day expiration by default
- **🔄 Automatic Refresh**: Seamless token management
- **🚪 Logout**: Secure token invalidation

### 🛡️ Security Middleware
```javascript
// Protected route example
router.get('/profile', protect, getUserProfile);

// Admin-only route example
router.post('/products', protect, isAdmin, addProduct);
```

### 👑 Admin Setup
Run the admin setup script to create an admin user:
```bash
node setAdmin.mjs
```

## 📡 API Endpoints

### 🔐 Authentication Routes (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| 🟢 POST | `/register` | Register new user | ❌ |
| 🟢 POST | `/login` | User login | ❌ |
| 🟢 POST | `/logout` | User logout | ✅ |
| 🔵 GET | `/me` | Get current user profile | ✅ |
| 🟡 PUT | `/profile` | Update user profile | ✅ |

### 📦 Product Routes (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| 🔵 GET | `/` | Get all products (with filters) | ❌ |
| 🔵 GET | `/:id` | Get single product | ❌ |
| 🔵 GET | `/:id/image` | Get product image | ❌ |
| 🟢 POST | `/` | Create new product | 👑 Admin |
| 🟡 PUT | `/:id` | Update product | 👑 Admin |
| 🔴 DELETE | `/:id` | Delete product | 👑 Admin |

### 📋 Order Routes (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| 🟢 POST | `/` | Create new order | ✅ |
| 🔵 GET | `/myorders` | Get user's orders | ✅ |
| 🔵 GET | `/:id` | Get single order | ✅ |
| 🟡 PUT | `/:id/pay` | Update order to paid | ✅ |
| 🔵 GET | `/` | Get all orders | 👑 Admin |

### 💳 Payment Routes (`/api/payments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| 🟢 POST | `/create-order` | Create payment order | ✅ |
| 🟢 POST | `/verify` | Verify payment | ✅ |

## 🗄️ Database Models

<details>
<summary>👤 User Model</summary>

```javascript
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
}, { timestamps: true });
```

</details>

<details>
<summary>📦 Product Model</summary>

```javascript
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String,
  },
  countInStock: { type: Number, required: true, default: 0 },
  iisNewCollection: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  numOrders: { type: Number, default: 0 },
}, { timestamps: true });
```

</details>

<details>
<summary>📋 Order Model</summary>

```javascript
const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
}, { timestamps: true });
```

</details>

## 🔍 API Usage Examples

### 🔐 Authentication
```javascript
// Register user
POST /api/users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

// Login user
POST /api/users/login
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### 📦 Product Management
```javascript
// Get products with filters
GET /api/products?search=laptop&sort=newest&filter=discounted

// Create product (Admin only)
POST /api/products
Content-Type: multipart/form-data
{
  "name": "Gaming Laptop",
  "price": 1299.99,
  "description": "High-performance gaming laptop",
  "countInStock": 10,
  "discount": 15,
  "image": <file>
}
```

### 📋 Order Processing
```javascript
// Create order
POST /api/orders
{
  "orderItems": [
    {
      "name": "Gaming Laptop",
      "qty": 1,
      "image": "/api/products/123/image",
      "price": 1299.99,
      "product": "product_id_here"
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "PayPal",
  "taxPrice": 130.00,
  "shippingPrice": 0.00,
  "totalPrice": 1429.99
}
```

## 🧪 Development

### ⚡ Available Scripts
| Script | Command | Description |
|--------|---------|-------------|
| 🚀 Start | `npm start` | Start production server |
| 🔧 Dev | `npm run dev` | Start development server with nodemon |
| 👑 Admin | `node setAdmin.mjs` | Create admin user |

### 🔍 Code Quality
- ✅ ESLint configuration for Node.js
- 🎨 Prettier for code formatting
- 🧪 Jest for testing (recommended)
- 📝 JSDoc for documentation

### 🐛 Debugging
```javascript
// Enable debug logging
DEBUG=app:* npm run dev

// MongoDB debug
MONGOOSE_DEBUG=true npm run dev
```

## 📊 Performance & Scalability

### 🚀 Optimization Features
- **📦 Compression**: Gzip compression for responses
- **🔄 Connection Pooling**: MongoDB connection optimization
- **📝 Request Logging**: Performance monitoring with Morgan
- **🛡️ Rate Limiting**: API rate limiting (recommended)
- **📈 Caching**: Redis caching (future enhancement)

### 📈 Monitoring
- **📊 Health Checks**: API health monitoring endpoints
- **📝 Error Logging**: Structured error logging
- **⚡ Performance Metrics**: Response time monitoring

## 🚀 Deployment

### 📦 Build Process
1. ⚙️ Set up production environment
2. 🌍 Configure environment variables
3. 🗄️ Set up MongoDB (Atlas recommended)
4. 🚀 Deploy to hosting service

### 🌐 Hosting Options
| Platform | Description | Recommended |
|----------|-------------|-------------|
| 🟢 **Heroku** | Easy deployment & scaling | ⭐ **Recommended** |
| ☁️ **AWS EC2** | Full control & scalability | ✅ |
| 🔷 **DigitalOcean** | Developer-friendly VPS | ✅ |
| 🌐 **Railway** | Modern deployment platform | ✅ |

### 🐳 Docker Support
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

### 🔧 Test Setup
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

### 📝 Test Examples
```javascript
// Example test for user registration
describe('POST /api/users/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });
});
```

## 🔒 Security Best Practices

### 🛡️ Implemented Security
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ HTTP-only cookies
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Environment variable management

### 🚨 Additional Recommendations
- 🔐 Implement rate limiting
- 🛡️ Add helmet.js for security headers
- 📝 Set up request logging
- 🔍 Implement API versioning
- 🚫 Add request validation middleware

## 📚 API Documentation

> 💡 **Tip**: Consider using Swagger/OpenAPI for interactive API documentation!

### 📖 Postman Collection
Import our Postman collection for easy API testing:
```bash
# Collection URL (if available)
https://documenter.getpostman.com/view/your-collection-id
```

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. ✨ Make your changes
4. 🧪 Run tests and ensure they pass
5. 📝 Update documentation if needed
6. 📬 Submit a pull request

### 📋 Development Guidelines
- 📝 Follow existing code style
- 🧪 Write tests for new features
- 📖 Update documentation
- 🔍 Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  
**Built with ❤️ for the LUMINA E-commerce Platform**

⭐ **Star this repo if you find it helpful!** ⭐

[🐛 Report Bug](https://github.com/your-repo/issues) • [✨ Request Feature](https://github.com/your-repo/issues) • [💬 Discussions](https://github.com/your-repo/discussions)

**Happy Coding! 🚀**

</div>
