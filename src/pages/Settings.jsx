import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserProfile from "../components/UserProfile";

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
        <UserProfile user={user} currentUser={user} />

        <p><strong>Обновить профиль:</strong> {user?.role}</p>
        <Link to="/update-user"><button>Обновить</button></Link>
      </div>

      {!user?.is_activated && (
        <div>
          <h3>Активация аккаунта</h3>
          <button onClick={goToActivate}>Перейти к активации</button>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <h3>Аккаунт</h3>
        <Link to="/delete-account" style={{ color: 'red', fontWeight: 'bold' }}>
          Удалить мой аккаунт
        </Link>
      </div>
    </div>
  );
}
