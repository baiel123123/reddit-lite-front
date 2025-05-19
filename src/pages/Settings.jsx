// pages/Settings.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToActivate = () => {
    navigate('/activate');
  };

  return (
    <div>
      <h2>Настройки</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Профиль</h3>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Роль:</strong> {user?.role}</p>
        <Link to="/update-user"><button>Обновить профиль</button></Link>
      </div>

      {!user?.is_activated && (
        <div>
          <h3>Активация аккаунта</h3>
          <button onClick={goToActivate}>Перейти к активации</button>
        </div>
      )}
    </div>
  );
}
