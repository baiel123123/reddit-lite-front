import React from "react";
import styles from "../styles/UserProfile.module.css";
import { FaPencilAlt } from "react-icons/fa";

export default function UserProfile({ user, currentUser, onUpdateClick }) {
  if (!user) return <p>Загрузка...</p>;

  const isSelf = currentUser?.id === user.id;
  const isAdmin = currentUser?.role_id === 2 || currentUser?.role_id === 3;

  return (
    <div className={styles.profileContainer}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <img
            src={`http://localhost:8000/users/avatar/${user.id}`}
            alt="Аватар"
            className={styles.avatar}
            onError={e => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
            style={{ background: !user.avatar_url ? "#232324" : undefined }}
          />
          {isAdmin && (
            <span style={{
              position: "absolute", right: -8, top: -8, background: "#ff4500", color: "#fff", borderRadius: "8px", padding: "2px 8px", fontSize: 12, fontWeight: 700, boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}>
              admin
            </span>
          )}
          {isSelf && !isAdmin && (
            <span style={{
              position: "absolute", right: -8, top: -8, background: "#0079d3", color: "#fff", borderRadius: "8px", padding: "2px 8px", fontSize: 12, fontWeight: 700, boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}>
              you
            </span>
          )}
        </div>
        <div className={styles.profileHeader}>
          <h2 className={styles.username}>{user.nickname || user.username}</h2>
          <p className={styles.status}>Статус: {user.status}</p>
        </div>
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
            <FaPencilAlt style={{ marginRight: 6, fontSize: 15 }} /> Обновить профиль
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
