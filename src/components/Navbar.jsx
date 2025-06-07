import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav style={{
      width: "220px",
      background: "#fff",
      borderRight: "1px solid #ddd",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      height: "100vh",
      position: "sticky",
      top: 0
    }}>
      <Link to="/" style={{ fontWeight: "bold", color: "#ff4500", fontSize: "24px" }}>Reddit Lite</Link>

      {user ? (
        <>
          <Link to="/my-profile">Мой профиль</Link>
          <Link to="/settings">Настройки</Link>
          <Link to="/search">Поиск</Link>
          <Link to="/create-post">Создать пост</Link>
          <Link to="/subreddits">Сообщества</Link>
          {(user.role_id === 2 || user.role_id === 3) && (
            <Link to="/admin-tools">Admin</Link>
          )}
          <LogoutButton />
        </>
      ) : (
        <>
          <Link to="/login">Вход</Link>
          <Link to="/register">Регистрация</Link>
        </>
      )}
    </nav>
  );
}
