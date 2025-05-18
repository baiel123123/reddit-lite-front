import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: 20 }}>
      <h2>Профиль</h2>
      <p>Имя пользователя: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Статус: {user.status}</p>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}
