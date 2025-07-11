import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetchWithRefresh from '../../../api.js';

export default function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subredditId, setSubredditId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetchWithRefresh(`/posts/${postId}`);
        if (!res.ok) throw new Error("Ошибка при загрузке поста");
        const data = await res.json();

        setTitle(data.title);
        setContent(data.content);
        setSubredditId(data.subreddit_id);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetchWithRefresh(`/posts/update/${postId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, subreddit_id: Number(subredditId) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка при обновлении поста");
      }

      navigate("/my-profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Редактировать пост</h2>
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

        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}
