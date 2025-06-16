import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subredditId, setSubredditId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !subredditId) {
      setError("Заголовок и сабреддит обязательны");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("subreddit_id", subredditId);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:8000/posts/create/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка при создании поста");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Создать пост</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Заголовок:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
            required
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
            required
          />
        </div>

        <div>
          <label>Картинка:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button type="submit">Создать</button>
      </form>
    </div>
  );
}
