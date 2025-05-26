import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export default function CreatePost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subredditId, setSubredditId] = useState(""); // Можно сделать выбор сабреддита, если нужно
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !subredditId) {
      setError("Заголовок и сабреддит обязательны");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/posts/create/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, subreddit_id: Number(subredditId) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка при создании поста");
      }

      navigate("/"); // после создания поста возвращаемся на главную или профиль
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Создать пост</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Заголовок:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
          />
        </div>

        <div>
          <label>Содержание:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={40000}
          />
        </div>

        <div>
          <label>Сабреддит ID:</label>
          <input
            type="number"
            value={subredditId}
            onChange={(e) => setSubredditId(e.target.value)}
          />
        </div>

        <button type="submit">Создать</button>
      </form>
    </div>
  );
}
