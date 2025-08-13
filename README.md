# 🛒 E-Commerce Shop Backend

Backend API for an e-commerce shop built with **Node.js** and **Express**, providing product management, authentication, user management, seller request handling, orders, Stripe webhook integration, and real-time admin notifications via Socket.IO.

---

## 📂 Project Structure
   ```bash
middlewares/
├── auth.middleware.js
└── multer.middleware.js

modules/
├── authentication/
│ ├── authenicationschema.js
│ ├── authentication.controller.js
│ └── authentication.routes.js
├── Order/
│ ├── order.controller.js
│ └── order.routes.js
├── Products/
│ ├── product.controller.js
│ └── product.routes.js
├── seller-requests/
│ ├── seller-request.controller.js
│ └── seller-request.routes.js
├── Users/
│ ├── user.controller.js
│ └── user.routes.js
└── WebHook/
└── WebHoo.controller.js
utils/
├── AppError.js
├── sendEmail.js
├── socket.io.js
└── verfiytoken.js

.env
```
---
## 🚀 Features
- **Authentication**
  - User signup & login
  - Refresh token
  - Logout
  - Password reset (forget password, verify reset code, reset password)

- **Products**
  - Create product (with image upload)
  - Get all products
  - Get product by ID
  - Update product (Admin only)
  - Delete product (Admin only)
  - Get products by seller
  - Rate a product (User only)

- **Orders**
  - Create order

- **Seller Requests**
  - Create seller request (User only)
  - Get all seller requests (Admin only)
  - Handle seller request (Admin only)

- **Users**
  - Get all users
  - Get user by ID
  - Update user
  - Delete user

- **Stripe Webhook**
  - Handles payment success/failure events
  - Updates order payment status

- **Real-Time Notifications (Socket.IO)**
  - Admin connection tracking
  - Send notifications to all connected admins

---

## 📦 Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdelrhmanabdelhay/ecommrce-shop-backend.git
   cd ecommrce-shop-backend
   ```
   
2.Install dependencies

```bash
npm install
```
Setup environment variables
Create a .env file in the root directory:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```
Run the server
```bash
npm run dev
```
📡 API Endpoints:
```bash
Authentication
Method	Endpoint	Middleware	Description
POST	/signup	validateSignup	Register new user
POST	/login	validateLogin	Login user
POST	/refresh-token	-	Refresh token
POST	/logout	-	Logout user
POST	/forget-password	-	Send reset code
POST	/verify-reset-code	-	Verify reset code
POST	/reset-password	-	Reset password

Products
Method	Endpoint	Middleware	Description
POST	/create-product	verfiyToken, upload	Create new product
GET	/get-allproduct	-	Get all products
GET	/get-product-byid/:id	-	Get product by ID
PUT	/update-product/:id	verfiyToken, isAdmin	Update product
DELETE	/delete-prdouct/:id	verfiyToken, isAdmin	Delete product
GET	/get-products-by-seller/:sellerId	verfiyToken, isSeller	Get seller's products
POST	/rate-product/:id	verfiyToken, isUser	Rate a product

Orders
Method	Endpoint	Middleware	Description
POST	/create	-	Create new order

Seller Requests
Method	Endpoint	Middleware	Description
POST	/create-seller-request	verfiyToken, isUser	Create seller request
GET	/get-all-seller-requests	verfiyToken, isAdmin	Get all requests
PATCH	/handle-seller-request/:id	verfiyToken, isAdmin	Handle request

Users
Method	Endpoint	Middleware	Description
GET	/get-all-users	verfiyToken	Get all users
GET	/get-user/:id	verfiyToken	Get user by ID
PUT	/update-user/:id	verfiyToken	Update user
DELETE	/delete-user/:id	verfiyToken	Delete user

Stripe Webhook
Method	Endpoint	Middleware	Description
POST	/webhook	express.raw({ type: "application/json" })	Handle Stripe payment events
```
🔔 Socket.IO Real-Time Notifications
```bash
The backend includes Socket.IO to handle real-time admin notifications.
Connection
Admins emit an adminConnected event upon connection.
Admin socket IDs are stored in memory.
Notifications
notfiyAdmin(message, data) function sends a notification event to all connected admins.
```
Example:
```bash
notfiyAdmin('New order received', { orderId: '12345' });
```
Disconnection
When an admin disconnects, their socket ID is removed from the list.
