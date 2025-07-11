import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import styles from "./styles/SubredditManagerPage.module.css";
import fetchWithRefresh from '../../api.js';

const API_URL = "http://localhost:8000/subreddit";

function SubredditIcon({ name }) {
  if (!name) return (
    <div style={{width: 32, height: 32, borderRadius: '50%', background: '#232324', color: '#b3b3b3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, border: '2px solid #292929', marginRight: 10}}>r</div>
  );
  return (
    <div style={{width: 32, height: 32, borderRadius: '50%', background: '#272729', color: '#ffb000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, border: '2px solid #232324', marginRight: 10}}>{name[0].toUpperCase()}</div>
  );
}

export default function SubredditManagerPage() {
  const { user } = useContext(AuthContext);
  const [subreddits, setSubreddits] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [activeTab, setActiveTab] = useState("my");

  useEffect(() => {
    if (user) {
      fetchMySubreddits();
      fetchMySubscriptions();
    }
  }, [user]);

  const fetchMySubreddits = async () => {
    if (!user) return;
    try {
      const res = await fetchWithRefresh(`${API_URL}/my-subreddits/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при загрузке сабреддитов");
      const data = await res.json();
      setSubreddits(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMySubscriptions = async () => {
    if (!user) return;
    try {
      const res = await fetchWithRefresh(`${API_URL}/get_all_subscriptions/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при загрузке подписок");
      const data = await res.json();
      setSubscriptions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnsubscribe = async (subscriptionId) => {
    if (!window.confirm("Отписаться от сообщества?")) return;
    try {
      const res = await fetchWithRefresh(`${API_URL}/delete_subscription/${subscriptionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при отписке");
      fetchMySubscriptions();
    } catch (err) {
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

      const res = await fetchWithRefresh(url, {
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
      const res = await fetchWithRefresh(`${API_URL}/${id}`, {
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
      <div className={styles.tabs}>
        <button className={activeTab === "my" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("my")}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#b3b3b3" strokeWidth="2"/><text x="10" y="15" textAnchor="middle" fontSize="10" fill="#b3b3b3">r/</text></svg>
          Мои сабреддиты
        </button>
        <button className={activeTab === "subs" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("subs")}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M10 15.273l-5.618 3.18a.833.833 0 0 1-1.215-.88l1.073-6.26-4.545-4.43a.833.833 0 0 1 .461-1.422l6.283-.913 2.81-5.7a.833.833 0 0 1 1.494 0l2.81 5.7 6.283.913a.833.833 0 0 1 .461 1.422l-4.545 4.43 1.073 6.26a.833.833 0 0 1-1.215.88L10 15.273z" fill="#b3b3b3"/></svg>
          Мои подписки
        </button>
      </div>
      {activeTab === "my" && (
        <>{subreddits.length === 0 ? (
          <p className={styles.noSubreddits}>нету сабреддиов</p>
        ) : (
          subreddits.map((sub) => (
            <div key={sub.id} className={styles.subredditItem} style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <SubredditIcon name={sub.name} />
              <div style={{flex: 1}}>
                <Link to={`/subreddit/${sub.id}`} className={styles.subredditLink}>
                  {sub.name}
                </Link>
                <p className={styles.subredditDescription}>{sub.description}</p>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.menuButton}
                  onClick={() => setOpenMenuId(openMenuId === sub.id ? null : sub.id)}
                >
                  ⋮
                </button>
                {openMenuId === sub.id && (
                  <div className={styles.dropdown}>
                    <button className={styles.dropdownItem} onClick={() => openEditModal(sub)}>Редактировать</button>
                    <button className={styles.dropdownItem} onClick={() => handleDelete(sub.id)}>Удалить</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}</>
      )}
      {activeTab === "subs" && (
        <div>
          {subscriptions.length === 0 ? (
            <p className={styles.noSubreddits}>Нет подписок</p>
          ) : (
            subscriptions.map((sub) => (
              <div key={sub.id} className={styles.subredditItem} style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <SubredditIcon name={sub.subreddit_name || sub.subreddit?.name} />
                <div style={{flex: 1}}>
                  <Link to={`/subreddit/${sub.subreddit_id}`} className={styles.subredditLink}>
                    {sub.subreddit_name || sub.subreddit?.name || `r/${sub.subreddit_id}`}
                  </Link>
                  <p className={styles.subredditDescription}>{sub.subreddit?.description || ''}</p>
                </div>
                <div className={styles.actions}>
                  <button className={styles.dropdownItem} onClick={() => handleUnsubscribe(sub.id)}>Отписаться</button>
                </div>
              </div>
            ))
          )}
        </div>
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
