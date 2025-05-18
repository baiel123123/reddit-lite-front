// ResetPasswordRequest.jsx
import React, { useState } from 'react';

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const requestReset = async () => {
    const res = await fetch('/users/request-password-reset/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setMessage('Письмо со сбросом отправлено');
    else setMessage('Ошибка при запросе сброса');
  };

  return (
    <div>
      <h3>Запрос сброса пароля</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={requestReset}>Отправить</button>
      <p>{message}</p>
    </div>
  );
}
