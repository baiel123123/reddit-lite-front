import React, { useState } from "react";

function RoleUpdate() {
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = () => {
    setMessage("");
    setError("");

    fetch("http://localhost:8000/users/role_update/", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: Number(userId), role_id: Number(roleId) }),
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => {throw new Error(data.detail || "Ошибка")});
        return res.json();
      })
      .then(data => setMessage("Роль успешно обновлена"))
      .catch(err => setError(err.message));
  };

  return (
    <div>
      <h2>Обновить роль пользователя</h2>
      <input
        type="number"
        placeholder="ID пользователя"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <input
        type="number"
        placeholder="ID роли"
        value={roleId}
        onChange={e => setRoleId(e.target.value)}
      />
      <button onClick={handleUpdate}>Обновить</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RoleUpdate;
