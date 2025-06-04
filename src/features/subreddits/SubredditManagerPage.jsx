import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000/subreddit";

export default function SubredditManagerPage() {
  const { user } = useContext(AuthContext);
  const [subreddits, setSubreddits] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchMySubreddits = async () => {
    try {
      const params = new URLSearchParams({ created_by_id: user.id });
      const res = await fetch(`${API_URL}/find/?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при загрузке сабреддитов");
      const data = await res.json();
      setSubreddits(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/${editingId}` : `${API_URL}/create/`;
      const method = editingId ? "PUT" : "POST";

      const bodyData = editingId
        ? { description: form.description }
        : form;

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
      fetchMySubreddits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (sub) => {
    setForm({ name: sub.name, description: sub.description });
    setEditingId(sub.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить сабреддит?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении");
      fetchMySubreddits();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchMySubreddits();
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{editingId ? "Редактировать сабреддит" : "Создать сабреддит"}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {!editingId && (
          <input
            placeholder="Название"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        <input
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button type="submit">{editingId ? "Сохранить" : "Создать"}</button>
      </form>

      <h3>Мои сабреддиты</h3>
      {subreddits.map((sub) => (
        <div
          key={sub.id}
          style={{ marginBottom: "10px", borderBottom: "1px solid #ccc" }}
        >
          <Link to={`/subreddit/${sub.id}`} style={{ fontWeight: "bold", textDecoration: "none", color: "blue" }}>
            {sub.name}
          </Link>
          : {sub.description}
          <div>
            <button onClick={() => handleEdit(sub)}>Редактировать</button>
            <button onClick={() => handleDelete(sub.id)}>Удалить</button>
          </div>
        </div>
      ))}
    </div>
  );
}
