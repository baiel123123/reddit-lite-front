import React, { useState } from "react";

function DeleteUserById() {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDelete = () => {
    setMessage("");
    setError("");

    fetch(`http://localhost:8000/users/delete_by_id/${userId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => {throw new Error(data.detail || "Ошибка")});
        return res.json();
      })
      .then(data => setMessage(data.message))
      .catch(err => setError(err.message));
  };

  return (
    <div>
      <h2>Удалить пользователя по ID</h2>
      <input
        type="number"
        placeholder="ID пользователя"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <button onClick={handleDelete}>Удалить</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default DeleteUserById;
