// UpdateUser.jsx
import React, { useState, useEffect } from 'react';

export default function UpdateUser() {
  const [userData, setUserData] = useState({
    nickname: '',
    about_me: '',
    gender: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Загрузим текущие данные пользователя (если есть API /users/me/)
    fetch('/users/me/')
      .then(res => res.json())
      .then(data => {
        setUserData({
          nickname: data.nickname || '',
          about_me: data.about_me || '',
          gender: data.gender || '',
        });
      });
  }, []);

  const handleChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value});
  };

  const updateUser = async () => {
    const res = await fetch('/users/update_user/', {
      method: 'PUT', // или PATCH, если твой API принимает
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (res.ok) setMessage('Данные обновлены');
    else setMessage('Ошибка при обновлении');
  };

  return (
    <div>
      <h3>Обновление данных пользователя</h3>
      <input
        name="nickname"
        placeholder="Никнейм"
        value={userData.nickname}
        onChange={handleChange}
      />
      <input
        name="about_me"
        placeholder="О себе"
        value={userData.about_me}
        onChange={handleChange}
      />
      <select name="gender" value={userData.gender} onChange={handleChange}>
        <option value="">Выберите пол</option>
        <option value="male">Мужской</option>
        <option value="female">Женский</option>
        <option value="other">Другой</option>
      </select>
      <button onClick={updateUser}>Сохранить</button>
      <p>{message}</p>
    </div>
  );
}
