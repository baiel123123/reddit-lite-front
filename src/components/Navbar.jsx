import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", background: "#eee", display: "flex", gap: "10px" }}>
      {user ? (
        <>
          <Link to="/" style={{ marginRight: "10px" }}>Главная</Link>
          <Link to="/settings">Настройки</Link>
          {/* Здесь можно добавить другие ссылки, например, для админа */}
          <Link to="/logout" style={{ marginLeft: "auto" }}>Выйти</Link>
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
