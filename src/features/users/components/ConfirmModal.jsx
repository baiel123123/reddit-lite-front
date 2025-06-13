import React from "react";
import styles from "../styles/ConfirmModal.module.css";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Подтверждение</h3>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalButtons}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Да, удалить
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
