import React, { useState, useEffect } from "react";
import styles from "../styles/UpdateUserModal.module.css";
import fetchWithRefresh from '../../../api.js';

export default function UpdateUserModal({ user, onClose, onUpdate }) {
  const [userData, setUserData] = useState({
    nickname: "",
    about_me: "",
    gender: "",
    date_of_birth: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUserData({
        nickname: user.nickname || "",
        about_me: user.about_me || "",
        gender: user.gender || "",
        date_of_birth: user.date_of_birth ? user.date_of_birth.split("T")[0] : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const updateUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetchWithRefresh("/users/update_user/", {
        method: "PUT",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.status === 401 || res.status === 403) {
        setMessage("Пожалуйста, авторизуйтесь");
        return;
      }

      if (res.ok) {
        const updatedUser = await res.json();
        setMessage("Данные обновлены");
        onUpdate(updatedUser); 
        onClose(); 
      } else {
        setMessage("Ошибка при обновлении");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при обновлении");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Обновление данных пользователя</h3>
        <form onSubmit={updateUser} className={styles.form}>
          <label>
            Никнейм:
            <input
              type="text"
              name="nickname"
              value={userData.nickname}
              onChange={handleChange}
            />
          </label>
          <label>
            О себе:
            <input
              type="text"
              name="about_me"
              value={userData.about_me}
              onChange={handleChange}
            />
          </label>
          <label>
            Пол:
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
            >
              <option value="">Выберите пол</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другой</option>
            </select>
          </label>
          <label>
            Дата рождения:
            <input
              type="date"
              name="date_of_birth"
              value={userData.date_of_birth}
              onChange={handleChange}
            />
          </label>

          <div className={styles.actions}>
            <button type="submit">Сохранить</button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Отмена
            </button>
          </div>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
