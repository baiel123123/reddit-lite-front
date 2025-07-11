// BanUser.jsx
import React, { useState } from 'react';
import fetchWithRefresh from '../../../api.js';

export default function BanUser() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const banUser = async () => {
    const res = await fetchWithRefresh(`/users/ban/${userId}`, { method: 'POST' });
    if (res.ok) setMessage('Пользователь забанен');
    else setMessage('Ошибка при бане');
  };

  const unbanUser = async () => {
    const res = await fetchWithRefresh(`/users/unban/${userId}`, { method: 'POST' });
    if (res.ok) setMessage('Пользователь разбанен');
    else setMessage('Ошибка при разбане');
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
        <h3 style={{
          color: '#ff4500',
          fontWeight: 800,
          fontSize: 22,
          marginBottom: 22,
          letterSpacing: 1
        }}>Бан / Разбан пользователя</h3>
        <input
          type="text"
          placeholder="ID пользователя"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
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
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <button
            onClick={banUser}
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
            }}
            onMouseOver={e => e.currentTarget.style.background = '#e03d00'}
            onMouseOut={e => e.currentTarget.style.background = '#ff4500'}
          >
            Забанить
          </button>
          <button
            onClick={unbanUser}
            style={{
              padding: '10px 22px',
              background: '#28282a',
              color: '#e8e8e8',
              border: '1px solid #444',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#313135'}
            onMouseOut={e => e.currentTarget.style.background = '#28282a'}
          >
            Разбанить
          </button>
        </div>
        <p style={{ color: message.includes('Ошибка') ? '#ff4d4d' : '#4dff88', fontWeight: 600, minHeight: 24 }}>{message}</p>
      </div>
    </div>
  );
}
