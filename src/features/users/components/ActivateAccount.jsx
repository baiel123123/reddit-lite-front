import React, { useState } from "react";
import styles from "../styles/ActivateAcoount.module.css";

export default function ActivateAccount({ onClose }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const activate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/users/verify-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Аккаунт успешно активирован");
      } else {
        setMessage(data.error || "Ошибка активации: неверный код или аккаунт уже подтверждён");
      }
    } catch (error) {
      setMessage("Ошибка сети или сервера");
    }

    setLoading(false);
  };

  const resendCode = async () => {
    setResendMessage("");

    try {
      const res = await fetch("http://localhost:8000/users/resend-code/", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResendMessage("Код отправлен на почту, сообщение могло отправиться в спам!");
      } else if (res.status === 429) {
        setMessage(data.detail || "Подождите перед повторной отправкой.");
      } else {
        setResendMessage(data.error || "Не удалось отправить код");
      }
    } catch (err) {
      setResendMessage("Ошибка при отправке кода");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.title}>Активация аккаунта</h3>
        <input
          type="text"
          placeholder="Код активации"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={styles.input}
        />
        <button onClick={activate} disabled={loading} className={styles.activateButton}>
          {loading ? "Активируем..." : "Активировать"}
        </button>
        <p className={styles.message}>{message}</p>

        <div className={styles.resendSection}>
          <button onClick={resendCode} className={styles.resendButton}>
            Отправить код ещё раз
          </button>
          <p className={styles.resendMessage}>{resendMessage}</p>
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          ✕ Закрыть
        </button>
      </div>
    </div>
  );
}
