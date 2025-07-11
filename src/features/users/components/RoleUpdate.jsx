import React, { useState } from "react";
import fetchWithRefresh from '../../../api.js';

function RoleUpdate() {
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = () => {
    setMessage("");
    setError("");

    fetchWithRefresh("/users/role_update/", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: Number(userId), role_id: Number(roleId) }),
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => {throw new Error(data.detail || "Ошибка")});
        return res.json();
      })
      .then(data => setMessage("Роль успешно обновлена"))
      .catch(err => setError(err.message));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#232324',
        borderRadius: 16,
        padding: '36px 32px 28px 32px',
        minWidth: 340,
        boxShadow: '0 2px 24px rgba(0,0,0,0.22)',
        border: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{
          color: '#ff4500',
          fontWeight: 800,
          fontSize: 22,
          marginBottom: 22,
          letterSpacing: 1
        }}>Обновить роль пользователя</h2>
        <input
          type="number"
          placeholder="ID пользователя"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #444',
            background: '#28282a',
            color: '#e8e8e8',
            fontSize: 16,
            marginBottom: 14,
            outline: 'none',
            transition: 'border 0.18s',
          }}
        />
        <input
          type="number"
          placeholder="ID роли"
          value={roleId}
          onChange={e => setRoleId(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #444',
            background: '#28282a',
            color: '#e8e8e8',
            fontSize: 16,
            marginBottom: 18,
            outline: 'none',
            transition: 'border 0.18s',
          }}
        />
        <button
          onClick={handleUpdate}
          style={{
            padding: '10px 22px',
            background: '#ff4500',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'background 0.18s',
            marginBottom: 16
          }}
          onMouseOver={e => e.currentTarget.style.background = '#e03d00'}
          onMouseOut={e => e.currentTarget.style.background = '#ff4500'}
        >
          Обновить
        </button>
        {message && <p style={{ color: '#4dff88', fontWeight: 600, minHeight: 24 }}>{message}</p>}
        {error && <p style={{ color: '#ff4d4d', fontWeight: 600, minHeight: 24 }}>{error}</p>}
      </div>
    </div>
  );
}

export default RoleUpdate;
