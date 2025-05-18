import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import BanUser from "./pages/BanUser";
import Roles from "./pages/Roles";
import UpdateUser from "./pages/UpdateUser";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import Home from "./pages/Home";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
         <Route path="/" element={<Home />} />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/update-user"
            element={
              <ProtectedRoute>
                <UpdateUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ban-user"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <BanUser />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Roles />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>404: Страница не найдена</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
