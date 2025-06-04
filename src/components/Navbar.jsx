import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav style={{
      padding: "10px",
      background: "#eee",
      display: "flex",
      gap: "10px",
      alignItems: "center"
    }}>
      <Link to="/">Главная</Link>

      {user ? (
        <>
          <Link to="/my-profile">Мой профиль</Link>
          <Link to="/settings">Настройки</Link>
          <Link to="/search">Поиск пользователей</Link>

          <Link to="/create-post" style={{ marginLeft: "auto" }}>
            <button style={{ padding: "6px 12px", cursor: "pointer" }}>
              Создать пост
            </button>
          </Link>
          <Link to="/subreddits">Сообщества</Link>

          {(user.role_id === 2 || user.role_id === 3) && (
            <Link to="/admin-tools">Admin Tools</Link>
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

export default Navbar;
