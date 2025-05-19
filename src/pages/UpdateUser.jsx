import React, { useState, useEffect } from 'react';

export default function UpdateUser() {
  const [userData, setUserData] = useState({
    nickname: '',
    about_me: '',
    gender: '',
    date_of_birth: '',  // добавляем новое поле
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/users/me/')
      .then(res => res.json())
      .then(data => {
        let date_of_birth = '';
        if (data.date_of_birth) {
            date_of_birth = data.date_of_birth.split('T')[0];  // "2025-05-16"
        }
        setUserData({
          nickname: data.nickname || '',
          about_me: data.about_me || '',
          gender: data.gender || '',
          birth_date: date_of_birth,
        });
      });
  }, []);

  const handleChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value});
  };

  const updateUser = async () => {
  const token = localStorage.getItem('access_token');

  const res = await fetch('http://localhost:8000/users/update_user/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData),
  });

  if (res.status === 401 || res.status === 403) {
    setMessage('Пожалуйста, авторизуйтесь');
    return;
  }

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
      {/* Поле для даты */}
      <input
        type="date"
        name="date_of_birth"
        value={userData.date_of_birth}
        onChange={handleChange}
      />
      <button onClick={updateUser}>Сохранить</button>
      <p>{message}</p>
    </div>
  );
}
