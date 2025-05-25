import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import BanUser from "./pages/BanUser";
import UpdateUser from "./pages/UpdateUser";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import ActivateAccount from "./pages/ActivateAccount";
import UserSearch from "./pages/UserSearch";
import RoleUpdate from "./pages/RoleUpdate";
import DeleteMyAccount from "./pages/DeleteMyAccount";
import DeleteUserById from "./pages/DeleteUserById";
import AdminTools from "./pages/AdminTools";
import UserProfilePage from "./pages/Profile"
import MyProfile from "./pages/MyProfile";
import CreatePost from "./pages/CreatePost.jsx";
import EditPost from "./pages/EditPost.jsx";
import PostPage from "./pages/PostPage.jsx"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<ProtectedRoute><UserSearch /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/update-user" element={<ProtectedRoute><UpdateUser /></ProtectedRoute>} />
          <Route path="/ban-user" element={<ProtectedRoute><AdminRoute><BanUser /></AdminRoute></ProtectedRoute>} />
          <Route path="/activate" element={<ProtectedRoute><ActivateAccount /></ProtectedRoute>} />

          <Route path="/role-update" element={
            <ProtectedRoute>
              <AdminRoute>
                <RoleUpdate />
              </AdminRoute>
            </ProtectedRoute>
          } />

          <Route path="/delete-account" element={<ProtectedRoute><DeleteMyAccount /></ProtectedRoute>} />

          <Route path="/delete-user-by-id" element={
            <ProtectedRoute>
                <AdminRoute>
                  <DeleteUserById />
                </AdminRoute>
            </ProtectedRoute>
          } />

          <Route path="/admin-tools" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminTools />
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
          <Route path="/post/:postId" element={<PostPage />} />


          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>404: Страница не найдена</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
