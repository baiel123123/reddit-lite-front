import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import BanUser from "./features/users/components/BanUser";
import UpdateUser from "./features/users/components/UpdateUser";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar"; // 👈 Новый компонент
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import ActivateAccount from "./features/users/components/ActivateAccount";
import UserSearch from "./pages/UserSearch";
import RoleUpdate from "./features/users/components/RoleUpdate";
import DeleteMyAccount from "./features/users/components/DeleteMyAccount";
import DeleteUserById from "./features/users/components/DeleteUserById";
import AdminTools from "./features/users/AdminTools";
import UserProfilePage from "./features/users/Profile";
import MyProfile from "./pages/MyProfile";
import EditPost from "./features/posts/components/EditPost";
import PostPage from "./features/posts/PostPage";
import SubredditManagerPage from "./features/subreddits/SubredditManagerPage";
import SubredditDetailPage from "./features/subreddits/components/SubredditDetailPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: "flex", height: "100vh" }}>
          
          <Navbar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <SearchBar />

            <main style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
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
                <Route path="/edit-post/:postId" element={<EditPost />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/subreddits" element={<SubredditManagerPage />} />
                <Route path="/subreddit/:subredditId" element={<SubredditDetailPage />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<div>404: Страница не найдена</div>} />
              </Routes>
            </main>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
