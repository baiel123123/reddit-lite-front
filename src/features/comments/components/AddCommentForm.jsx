import React, { useState } from "react";
import styles from "../styles/AddCommentForm.module.css";

function AddCommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    const tempId = Date.now(); 
    const tempComment = {
      id: tempId,
      post_id: postId,
      user_id: 1, 
      content,
      upvote: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      parent_comment_id: null,
      children: [],
      user_vote: null,
      user: {
        id: 1,
        username: "Anonymous",
        avatar: null,
      },
    };

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
      onCommentAdded(savedComment, tempId);
    } catch (error) {
      alert("Ошибка при добавлении комментария");
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
