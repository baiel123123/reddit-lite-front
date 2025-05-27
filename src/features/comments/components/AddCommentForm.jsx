// components/AddCommentForm.jsx
import React, { useState } from "react";

function AddCommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/comments/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ post_id: postId, content }),
    });

    if (res.ok) {
      setContent("");
      if (onCommentAdded) {
        onCommentAdded(); // перезагрузить комментарии
      }
    } else {
      alert("Ошибка при добавлении комментария");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
        placeholder="Напиши что-нибудь..."
        required
      />
      <button type="submit">Отправить</button>
    </form>
  );
}

export default AddCommentForm;
