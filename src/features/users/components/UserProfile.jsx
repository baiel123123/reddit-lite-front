import React from "react";
import styles from "../styles/UserProfile.module.css";

export default function UserProfile({ user, currentUser, onUpdateClick }) {
  if (!user) return <p>Загрузка...</p>;

  const isSelf = currentUser?.id === user.id;
  const isAdmin = currentUser?.role_id === 2 || currentUser?.role_id === 3;

  return (
    <div className={styles.profileContainer}>
      <img
        src={`http://localhost:8000/users/avatar/${user.id}`}
        alt="Аватар"
        className={styles.avatar}
      />
      <div className={styles.profileHeader}>
        <h2 className={styles.username}>{user.nickname || user.username}</h2>
        <p className={styles.status}>Статус: {user.status}</p>
      </div>

      <div className={styles.profileInfo}>
        <div className={styles.infoBlock}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{user.email}</span>
        </div>
        <div className={styles.infoBlock}>
          <span className={styles.label}>Пол:</span>
          <span className={styles.value}>{user.gender}</span>
        </div>
        <div className={styles.infoBlock}>
          <span className={styles.label}>Дата рождения:</span>
          <span className={styles.value}>{user.date_of_birth.split("T")[0]}</span>
        </div>
        <div className={`${styles.infoBlock} ${styles.fullWidth}`}>
          <span className={styles.label}>О себе:</span>
          <span className={styles.value}>{user.about_me || "Не заполнено"}</span>
        </div>
      </div>

      {isSelf && (
        <div className={styles.updateSection}>
          <button className={styles.updateButton} onClick={onUpdateClick}>
            Обновить профиль
          </button>
        </div>
      )}

      {(isSelf || isAdmin) && (
        <div className={styles.profileMeta}>
          <div className={styles.metaBlock}>
            <span className={styles.label}>Подтверждён:</span>
            <span className={styles.value}>{user.is_verified ? "Да" : "Нет"}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.label}>Дата создания:</span>
            <span className={styles.value}>{new Date(user.created_at).toLocaleString()}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.label}>Дата обновления:</span>
            <span className={styles.value}>{new Date(user.updated_at).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
