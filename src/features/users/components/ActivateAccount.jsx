import React, { useState } from "react";

export default function ActivateAccount() {
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
    <div>
      <h3>Активация аккаунта</h3>
      <input
        type="text"
        placeholder="Код активации"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={activate} disabled={loading}>
        {loading ? "Активируем..." : "Активировать"}
      </button>
      <p>{message}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={resendCode}>Отправить код ещё раз</button>
        <p>{resendMessage}</p>
      </div>
    </div>
  );
}
