import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DeleteMyAccount() {
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = () => {
    fetch("http://localhost:8000/users/delete/", {
      method: "DELETE",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка при удалении");
        return res.json();
      })
      .then(() => {
        logout();
        navigate("/login");
      })
      .catch(err => setError(err.message));
  };

  return (
    <div>
      <h2>Удалить мой аккаунт</h2>
      <button onClick={handleDelete} style={{ color: "red" }}>
        Удалить аккаунт
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default DeleteMyAccount;
