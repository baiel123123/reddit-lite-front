import React, { useState, useEffect } from "react";
import styles from "../styles/CommunityModal.module.css";
import { useAuth } from "../../../context/AuthContext";

export default function CommunityModal({ community, onClose, onSave }) {
  const [form, setForm] = useState({
    name: community ? community.name : "",
    description: community ? community.description : "",
  });
  const [error, setError] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (community) {
      setForm({
        name: community.name,
        description: community.description,
      });
    }
  }, [community]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setError("Для создания сообщества нужно войти в аккаунт!");
      return;
    }
    if (!community && (form.name.length < 1 || form.name.length > 25)) {
      setError("Название должно быть от 1 до 25 символов");
      return;
    }
    if (form.description && form.description.length > 255) {
      setError("Описание не должно превышать 255 символов");
      return;
    }
    setError("");
    onSave(form, community ? community.id : null);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{community ? "Редактировать сообщество" : "Создать сообщество"}</h3>
        {error && <div style={{ color: "#ff4d4d", marginBottom: 8 }}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          {!community && (
            <input
              type="text"
              placeholder="Название"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              minLength={1}
              maxLength={25}
            />
          )}
          <input
            type="text"
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={255}
          />
          <div className={styles.actions}>
            <button type="submit">
              {community ? "Сохранить" : "Создать"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
