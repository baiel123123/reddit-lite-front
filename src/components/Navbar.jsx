import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav
      style={{
        width: "220px",
        background: "#1c1c1c",           
        borderRight: "1px solid #444",   
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <Link
        to="/"
        style={{
          fontWeight: "bold",
          color: "#ff4500",          
          fontSize: "24px",
          textDecoration: "none",
        }}
      >
        Reddit Lite
      </Link>

      {user ? (
        <>
          <Link
            to="/my-profile"
            style={{ color: "#e8e8e8", textDecoration: "none" }}
          >
            Мой профиль
          </Link>
          <Link
            to="/settings"
            style={{ color: "#e8e8e8", textDecoration: "none" }}
          >
            Настройки
          </Link>
          <Link
            to="/subreddits"
            style={{ color: "#e8e8e8", textDecoration: "none" }}
          >
            Сообщества
          </Link>
          {(user.role_id === 2 || user.role_id === 3) && (
            <Link
              to="/admin-tools"
              style={{ color: "#e8e8e8", textDecoration: "none" }}
            >
              Admin
            </Link>
          )}
        </>
      ) : (
        <>
          <Link
            to="/login"
            style={{ color: "#e8e8e8", textDecoration: "none" }}
          >
            Вход
          </Link>
          <Link
            to="/register"
            style={{ color: "#e8e8e8", textDecoration: "none" }}
          >
            Регистрация
          </Link>
        </>
      )}
    </nav>
  );
}
