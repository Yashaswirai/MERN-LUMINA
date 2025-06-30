# 🌟 LUMINA E-commerce Frontend

> 💡 **A modern, feature-rich e-commerce frontend application built with React, Vite, and TailwindCSS.**

Welcome to LUMINA! ✨ This application provides a complete shopping experience with user authentication, product browsing, cart management, and comprehensive admin functionalities. Perfect for building your next e-commerce platform! 🛍️

## 🚀 Features

### 👤 User Features
- **🔐 User Authentication**: Login/Register with secure JWT token authentication
- **🔍 Product Browsing**: Browse products with search, filter, and sort functionality
- **🛒 Shopping Cart**: Add/remove products with quantity management
- **📦 Order Management**: Place orders and view order history
- **👨‍💼 User Profile**: Manage user account information
- **📱 Responsive Design**: Mobile-first design with TailwindCSS

### 🔧 Admin Features
- **📊 Admin Dashboard**: Overview of products, orders, and users
- **📝 Product Management**: Add, edit, and delete products with image upload
- **🎯 Order Management**: View and manage customer orders
- **⚙️ Admin Profile**: Manage admin account settings

## 🛠️ Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
</div>

- **⚛️ React 19**: Frontend framework
- **⚡ Vite**: Build tool and development server
- **🛣️ React Router DOM**: Client-side routing
- **🎨 TailwindCSS**: Utility-first CSS framework
- **📡 Axios**: HTTP client for API requests
- **🎯 React Context API**: State management for auth and cart
- **🔄 Redux Toolkit**: Advanced state management
- **🔗 React Redux**: React bindings for Redux

## 📦 Installation

> 🚨 **Prerequisites**: Make sure you have [Node.js](https://nodejs.org/) (v16+) and [npm](https://www.npmjs.com/) installed.

1. **📥 Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **📦 Install dependencies**
   ```bash
   npm install
   ```

3. **🚀 Start the development server**
   ```bash
   npm run dev
   ```
   
   🎉 Your app will be running at `http://localhost:5173`

4. **🏗️ Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

<details>
<summary>📁 Click to expand project structure</summary>

```
Frontend/
├── 📁 public/
│   ├── 🖼️ icon.png
│   └── ⚡ vite.svg
├── 📁 src/
│   ├── 🎨 assets/
│   │   └── ⚛️ react.svg
│   ├── 🧩 components/
│   │   ├── 📦 common/
│   │   │   ├── ⏳ LoadingSpinner.jsx
│   │   │   ├── 🌙 ThemeToggle.jsx
│   │   │   └── 🍞 Toast.jsx
│   │   ├── 🏠 layout/
│   │   │   └── 🧭 Navbar.jsx
│   │   ├── 📝 AddEditProductPage.jsx
│   │   ├── 📊 AdminOrderDashboard.jsx
│   │   ├── 👤 AdminProfilePage.jsx
│   │   ├── ✅ CheckoutSteps.jsx
│   │   ├── 📄 OrderSummary.jsx
│   │   ├── 💳 PaymentMethodSelector.jsx
│   │   ├── 💰 RazorpayPayment.jsx
│   │   └── 📮 ShippingAddressForm.jsx
│   ├── ⚙️ config/
│   │   └── 🔧 appConfig.js
│   ├── 📋 constants/
│   │   └── 🔗 apiEndpoints.js
│   ├── 🎯 context/
│   │   ├── 🔐 AuthContext.jsx
│   │   ├── 🛒 CartContext.jsx
│   │   ├── 💳 CheckoutContext.jsx
│   │   ├── 🌙 ThemeContext.jsx
│   │   └── 🍞 ToastContext.jsx
│   ├── 🪝 hooks/
│   │   └── 🔑 useAuth.js
│   ├── 📄 pages/
│   │   ├── 👑 admin/
│   │   │   └── 📊 DashboardPage.jsx
│   │   ├── 🔐 auth/
│   │   │   └── 🚪 LoginRegisterPage.jsx
│   │   ├── 🛒 cart/
│   │   │   ├── 🛍️ CartPage.jsx
│   │   │   ├── 💳 PaymentPage.jsx
│   │   │   └── 📮 ShippingPage.jsx
│   │   ├── 📦 order/
│   │   │   ├── 📋 OrderPage.jsx
│   │   │   └── ✅ PlaceOrderPage.jsx
│   │   ├── 🛍️ product/
│   │   │   ├── 📱 ProductDetailPage.jsx
│   │   │   └── 🏪 ShopPage.jsx
│   │   ├── 👤 user/
│   │   │   └── 👨‍💼 ProfilePage.jsx
│   │   └── 🔒 ProtectedRoute.jsx
│   ├── 🛣️ routes/
│   │   ├── 👑 AdminRoute.jsx
│   │   └── 🔒 PrivateRoute.jsx
│   ├── 📡 services/
│   │   ├── 🌐 api.js
│   │   └── 💰 razorpay.js
│   ├── 📱 App.jsx
│   ├── 🎨 index.css
│   └── 🚀 main.jsx
├── ✅ eslint.config.js
├── 🌐 index.html
├── 📦 package.json
├── 🎨 tailwind.config.js
└── ⚡ vite.config.js
```

</details>

## 🔧 Configuration

### 🌍 Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

<details>
<summary>⚡ Vite Configuration</summary>

The `vite.config.js` includes proxy configuration for API routes:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

</details>

### 🎨 TailwindCSS Configuration
Custom theme configuration in `tailwind.config.js` with extended colors and utilities.

## 🔐 Authentication

The application uses JWT tokens stored in HTTP-only cookies for secure authentication:

- **🚪 Login/Register**: User credentials are validated on the backend
- **🔒 Protected Routes**: `PrivateRoute` component protects user-specific pages
- **👑 Admin Routes**: `AdminRoute` component restricts admin-only pages
- **🔄 Token Management**: Automatic token refresh and logout on expiration

## 🛒 State Management

### 🎯 Context API
- **🔐 AuthContext**: Manages user authentication state
- **🛒 CartContext**: Handles shopping cart state and operations
- **🌙 ThemeContext**: Manages dark/light theme switching
- **🍞 ToastContext**: Global notification system

### 🔄 Redux Toolkit
- **👤 User Slice**: Advanced user state management
- **📦 Product Slice**: Product data and filtering
- **📋 Order Slice**: Order history and management

## 🎨 Styling

### 🎨 TailwindCSS
- ⚡ Utility-first CSS framework
- 🌈 Custom theme with brand colors
- 📱 Responsive design utilities
- 🌙 Dark mode support

### 🧩 Components
- ♻️ Reusable UI components
- 📐 Consistent design system
- ♿ Accessibility considerations

## 🔄 API Integration

<details>
<summary>📡 Click to see API details</summary>

### 🌐 Axios Configuration
- 🔗 Base URL configuration
- 🔄 Request/response interceptors
- ❌ Error handling
- 🔐 Token attachment

### 📋 API Endpoints
- `/api/auth` - 🔐 Authentication routes
- `/api/products` - 📦 Product management
- `/api/orders` - 📋 Order operations
- `/api/users` - 👤 User management

</details>

## 🚦 Routing

### 🌍 Public Routes
| Route | Description | Icon |
|-------|-------------|------|
| `/` | Home page | 🏠 |
| `/shop` | Product listing | 🏪 |
| `/login` | Authentication | 🚪 |
| `/product/:id` | Product details | 📱 |

### 🔒 Protected Routes
| Route | Description | Icon |
|-------|-------------|------|
| `/profile` | User profile | 👤 |
| `/cart` | Shopping cart | 🛒 |
| `/checkout` | Checkout process | 💳 |
| `/orders` | Order history | 📦 |

### 👑 Admin Routes
| Route | Description | Icon |
|-------|-------------|------|
| `/admin/dashboard` | Admin overview | 📊 |
| `/admin/products` | Product management | 📝 |
| `/admin/orders` | Order management | 🎯 |
| `/admin/profile` | Admin profile | ⚙️ |

## 📱 Responsive Design

The application is fully responsive with:
- 📱 Mobile-first approach
- 💻 Tablet and desktop optimization
- 👆 Touch-friendly interface
- 🧭 Adaptive navigation

## 🧪 Development

### ⚡ Available Scripts
| Script | Command | Description |
|--------|---------|-------------|
| 🚀 Dev | `npm run dev` | Start development server |
| 🏗️ Build | `npm run build` | Build for production |
| 👀 Preview | `npm run preview` | Preview production build |
| ✅ Lint | `npm run lint` | Run ESLint |

### 🔍 Code Quality
- ✅ ESLint configuration for React
- 🎨 Prettier for code formatting
- 🪝 Git hooks for pre-commit validation

## 🚀 Deployment

### 📦 Build Process
1. ⚡ Run `npm run build`
2. 📁 Deploy `dist` folder to hosting service
3. 🌍 Configure environment variables
4. 🛣️ Set up proper routing for SPA

### 🌐 Hosting Options
| Platform | Description | Recommended |
|----------|-------------|-------------|
| 🟢 **Vercel** | Easy deployment & great DX | ⭐ **Recommended** |
| 🎯 **Netlify** | Simple static hosting | ✅ |
| ☁️ **AWS S3 + CloudFront** | Scalable solution | ✅ |
| 🔥 **Firebase Hosting** | Google's platform | ✅ |

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. ✨ Make your changes
4. 🧪 Run tests and linting
5. 📬 Submit a pull request

> 💡 **Tip**: Please ensure your PR includes proper commit messages and follows our coding standards!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  
**Built with ❤️ by Yashaswi Rai**

⭐ **Star this repo if you like it!** ⭐

[🐛 Report Bug](https://github.com/your-repo/issues) • [✨ Request Feature](https://github.com/your-repo/issues) • [💬 Discussions](https://github.com/your-repo/discussions)

</div>
