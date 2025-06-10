import React, { useState } from "react";
import styles from "../styles/AddCommentForm.module.css";

function AddCommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // Создадим временный объект комментария (оптимистичное обновление)
    const tempId = Date.now(); // временный ID (например, Date.now() или UUID)
    const tempComment = {
      id: tempId,
      post_id: postId,
      user_id: 1, // Здесь можно подставить id текущего пользователя (для примера просто "1")
      content,
      upvote: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      parent_comment_id: null,
      children: [],
      user_vote: null,
    };

    // Сразу добавляем временный комментарий в список
    onCommentAdded(tempComment);

    setSubmitting(true);
    setContent("");

    try {
      const res = await fetch("http://localhost:8000/comments/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ post_id: postId, content }),
      });
      if (!res.ok) throw new Error("Ошибка при добавлении комментария");

      const savedComment = await res.json();
      // Когда сервер вернул ответ, заменяем временный комментарий на реальный.
      onCommentAdded(savedComment, tempId);
    } catch (error) {
      alert("Ошибка при добавлении комментария");
      // В случае ошибки — удаляем временный комментарий
      onCommentAdded(null, tempId);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className={styles.textarea}
        placeholder="Напиши что-нибудь..."
        required
      />
      <button type="submit" className={styles.buttonReddit} disabled={submitting}>
        {submitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default AddCommentForm;
