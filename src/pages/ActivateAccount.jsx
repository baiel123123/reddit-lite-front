import React, { useState } from "react";

export default function ActivateAccount() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
        setMessage(data.error || "Ошибка активации: неверный код или Аккаунт уже подтверждён");
      }
    } catch (error) {
      setMessage("Ошибка сети или сервера");
    }

    setLoading(false);
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
    </div>
  );
}
