// pages/Settings.jsx
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Settings() {
  const { user } = useContext(AuthContext);

  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const activate = async () => {
    try {
      const res = await fetch('/users/verify-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Аккаунт успешно активирован');
      } else {
        setMessage(data.message || 'Ошибка активации');
      }
    } catch (err) {
      setMessage('Произошла ошибка сети');
    }
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

      <div>
        <h3>Активация аккаунта</h3>
        <input
          type="text"
          placeholder="Код активации"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={activate}>Активировать</button>
        <p>{message}</p>
      </div>
    </div>
  );
}
