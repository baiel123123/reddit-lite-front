import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", background: "#eee", display: "flex", gap: "10px" }}>
      <Link to="/">Главная</Link>

      {user ? (
        <>
          <Link to="/settings">Настройки</Link>
          <Link to="/search">Поиск пользователей</Link>

          {user && (user.role_id === 2 || user.role_id === 3) && (
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
