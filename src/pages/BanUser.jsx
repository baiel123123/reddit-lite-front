// BanUser.jsx
import React, { useState } from 'react';

export default function BanUser() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const banUser = async () => {
    const res = await fetch(`/users/ban/${userId}`, { method: 'POST' });
    if (res.ok) setMessage('Пользователь забанен');
    else setMessage('Ошибка при бане');
  };

  const unbanUser = async () => {
    const res = await fetch(`/users/unban/${userId}`, { method: 'POST' });
    if (res.ok) setMessage('Пользователь разбанен');
    else setMessage('Ошибка при разбане');
  };

  return (
    <div>
      <h3>Бан / Разбан пользователя</h3>
      <input
        type="text"
        placeholder="ID пользователя"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={banUser}>Забанить</button>
      <button onClick={unbanUser}>Разбанить</button>
      <p>{message}</p>
    </div>
  );
}
