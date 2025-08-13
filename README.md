# 🛒 E-Commerce Shop Backend

Backend API for an e-commerce shop built with **Node.js** and **Express**, providing product management, authentication, user management, seller request handling, orders, Stripe webhook integration, and real-time admin notifications via Socket.IO.

---

## 📂 Project Structure
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

.envCopy
Edit
