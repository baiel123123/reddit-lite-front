import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import styles from "./styles/SubredditManagerPage.module.css";

const API_URL = "http://localhost:8000/subreddit";

export default function SubredditManagerPage() {
  const { user } = useContext(AuthContext);
  const [subreddits, setSubreddits] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); 

  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMySubreddits();
    }
  }, [user]);

  const fetchMySubreddits = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/my-subreddits/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при загрузке сабреддитов");
      const data = await res.json();
      setSubreddits(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const openEditModal = (sub) => {
    setModalMode("edit");
    setForm({ name: sub.name, description: sub.description });
    setEditingId(sub.id);
    setShowFormModal(true);
    setOpenMenuId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        modalMode === "edit" ? `${API_URL}/${editingId}` : `${API_URL}/create/`;
      const method = modalMode === "edit" ? "PUT" : "POST";
      const bodyData = modalMode === "edit" ? { description: form.description } : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Ошибка при сохранении");
      }

      setForm({ name: "", description: "" });
      setEditingId(null);
      setShowFormModal(false);
      fetchMySubreddits();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить сабреддит?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении");
      setOpenMenuId(null);
      fetchMySubreddits();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.headerContainer}>
        <h3 className={styles.subredditsHeader}>Мои сабреддиты</h3>
      </div>

      {subreddits.length === 0 ? (
        <p className={styles.noSubreddits}>нету сабреддиов</p>
      ) : (
        subreddits.map((sub) => (
          <div key={sub.id} className={styles.subredditItem}>
            <Link to={`/subreddit/${sub.id}`} className={styles.subredditLink}>
              {sub.name}
            </Link>
            <p className={styles.subredditDescription}>{sub.description}</p>
            <div className={styles.actions}>
              <button
                className={styles.menuButton}
                onClick={() =>
                  setOpenMenuId(openMenuId === sub.id ? null : sub.id)
                }
              >
                ⋮
              </button>
              {openMenuId === sub.id && (
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => openEditModal(sub)}
                  >
                    Редактировать
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleDelete(sub.id)}
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {showFormModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalHeader}>
              {modalMode === "create" ? "Создать сабреддит" : "Редактировать сабреддит"}
            </h2>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {modalMode === "create" && (
                <input
                  className={styles.input}
                  placeholder="Название"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              )}
              <input
                className={styles.input}
                placeholder="Описание"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  {modalMode === "create" ? "Создать" : "Сохранить"}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowFormModal(false)}
                >
                  Отменить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
