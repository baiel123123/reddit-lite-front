import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import styles from "../styles/DeleteMyAccount.module.css";
import fetchWithRefresh from '../../../api.js';

function DeleteMyAccount() {
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const deleteAccount = () => {
    fetchWithRefresh("/users/delete/", {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при удалении");
        return res.json();
      })
      .then(() => {
        logout();
        navigate("/login");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Удалить мой аккаунт</h2>
      <button
        className={styles.deleteButton}
        onClick={() => setShowConfirm(true)}
      >
        Удалить аккаунт
      </button>
      {error && <p className={styles.error}>{error}</p>}

      {showConfirm && (
        <ConfirmModal
          message="Вы точно уверены, что хотите удалить аккаунт?"
          onConfirm={() => {
            setShowConfirm(false);
            deleteAccount();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default DeleteMyAccount;
