# 🪹 CodeNest - Code Snippet Saver & Manager

**CodeNest** is a full-stack web application designed to help developers seamlessly create, store, organize, search, and share code snippets. Built with a modern, high-performance tech stack utilizing **React 19, Redux Toolkit, Tailwind CSS v4** on the frontend, and **Node.js, Express, MongoDB, and JWT Authentication** on the backend.

---

## ✨ Features

- 🔐 **User Authentication**: Secure user registration, login, and session persistence using JSON Web Tokens (JWT) & `bcryptjs` password hashing.
- ⚡ **Full CRUD Capabilities**: Create, read, edit, view, and delete code snippets with ease.
- 🔍 **Real-Time Search & Filtering**: Instant search across titles and snippet content.
- 🌓 **Dark / Light Mode**: Beautiful UI with a toggleable theme system built for high visual comfort.
- 📋 **One-Click Copy & Share**: Easily copy snippet code to clipboard or share snippets with single-click link copy and web sharing.
- 🛡️ **Protected Routes & Multi-User Support**: Dedicated user-level data isolation where each user manages their private collection of snippets.
- 📱 **Responsive Design**: Designed for optimal viewing across desktop, tablet, and mobile displays.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React-Redux](https://react-redux.js.org/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Notifications**: [Lucide React](https://lucide.dev/) & [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ORM](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://github.com/dperini/bcryptjs)
- **Utilities**: `dotenv`, `cors`, `express-async-handler`, `nodemon`

---

## 📁 Repository Structure

```text
CodeNest/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection script
│   │   ├── controllers/
│   │   │   ├── authController.js     # Signup, Login, Profile controllers
│   │   │   └── snippetController.js  # Snippet CRUD operations
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # Protect routes via JWT token verification
│   │   │   └── errorMiddleware.js    # 404 & centralized error handler
│   │   ├── models/
│   │   │   ├── userModel.js          # Mongoose schema for Users (with pre-save hashing)
│   │   │   └── snippetModel.js       # Mongoose schema for Snippets
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Express routes for /api/auth
│   │   │   └── snippetRoutes.js      # Express routes for /api/snippets
│   │   └── server.js                 # Entry point for backend server
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Home, CodeNest (Create/Edit), ViewCodeNest, Login, Signup
│   │   ├── redux/                    # Redux slices (authSlice, Slice)
│   │   ├── services/                 # Axios/Fetch API wrappers (authService, snippetService)
│   │   ├── App.jsx                   # Router setup & Protected route configurations
│   │   └── index.css                 # Tailwind CSS styles & global rules
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local system:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (Local instance running at `mongodb://localhost:27017` or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` folder (you can copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Fill in your environment parameters:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/codenest
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173`.

---

## 🔗 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated user details |

### Snippets (`/api/snippets`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/snippets` | Private | Fetch all code snippets for the logged-in user |
| `GET` | `/api/snippets/:id` | Private | Fetch a single snippet by ID |
| `POST` | `/api/snippets` | Private | Create a new code snippet |
| `PUT` | `/api/snippets/:id` | Private | Update an existing code snippet |
| `DELETE` | `/api/snippets/:id` | Private | Delete a snippet by ID |

---

## 📜 License

This project is open source and available under the [ISC License](LICENSE).
