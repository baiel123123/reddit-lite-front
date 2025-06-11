import React, { useState, useEffect } from "react";
import styles from "../styles/CommunityModal.module.css";

export default function CommunityModal({ community, onClose, onSave }) {
  const [form, setForm] = useState({
    name: community ? community.name : "",
    description: community ? community.description : "",
  });

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
    onSave(form, community ? community.id : null);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{community ? "Редактировать сообщество" : "Создать сообщество"}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          {!community && (
            <input
              type="text"
              placeholder="Название"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          )}
          <input
            type="text"
            placeholder="Описание"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
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
