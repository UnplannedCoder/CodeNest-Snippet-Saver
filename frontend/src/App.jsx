import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./redux/authSlice";
import { fetchUserSnippets, resetAllCodeNest } from "./redux/Slice";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CodeNest from "./components/CodeNest";
import ViewCodeNest from "./components/ViewCodeNest";
import Login from "./components/Login";
import Signup from "./components/Signup";

// Protected Route component (requires logged in user)
const ProtectedRoute = ({ children, isDarkMode, setIsDarkMode }) => {
  const { isAuthenticated, token, loading } = useSelector(
    (state) => state.auth,
  );
  const hasLocalToken = !!localStorage.getItem("codenest_token");

  // Only show full-screen loader if there is NO token or auth state cached and we are actively validating
  if (loading && !isAuthenticated && !hasLocalToken) {
    return (
      <div
        className={`min-h-screen w-full flex items-center justify-center ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated && !token && !hasLocalToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col overflow-x-hidden transition-colors duration-300 ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      {children}
    </div>
  );
};

// Public Only Route component (for login/signup when already logged in)
const PublicOnlyRoute = ({ children, isDarkMode, setIsDarkMode }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col overflow-x-hidden transition-colors duration-300 ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      {children}
    </div>
  );
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("codenest_token");
    if (token) {
      dispatch(fetchCurrentUser());
    } else {
      // Pre-warm backend API server silently so login/signup is instantaneous
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      fetch(`${baseUrl}/api/auth/me`).catch(() => {});
    }
  }, [dispatch]);

  // Fetch user snippets from MongoDB when user logs in, reset when logged out
  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      dispatch(fetchUserSnippets());
    } else if (!isAuthenticated && !localStorage.getItem("codenest_token")) {
      dispatch(resetAllCodeNest());
    }
  }, [isAuthenticated, user, dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
          <Home isDarkMode={isDarkMode} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/codenest",
      element: (
        <ProtectedRoute isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
          <CodeNest isDarkMode={isDarkMode} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/codenest/:id",
      element: (
        <ProtectedRoute isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
          <ViewCodeNest isDarkMode={isDarkMode} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicOnlyRoute isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
          <Login isDarkMode={isDarkMode} />
        </PublicOnlyRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <PublicOnlyRoute isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
          <Signup isDarkMode={isDarkMode} />
        </PublicOnlyRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
