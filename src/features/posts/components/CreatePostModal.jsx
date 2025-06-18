import React, { useState } from "react";
import styles from "../styles/CreatePostModal.module.css";

export default function CreatePostModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subredditId, setSubredditId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subredditId) {
      setError("Title and Subreddit are required");
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
        throw new Error(data.error || "Error creating post");
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <h2>Create Post</h2>
        {error && <p className={styles.errorText}>{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form}>
          <div className={styles.formGroup}>
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={300} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Content:</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={40000} className={styles.textarea} />
          </div>
          <div className={styles.formGroup}>
            <label>Subreddit ID:</label>
            <input type="number" value={subredditId} onChange={(e) => setSubredditId(e.target.value)} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className={styles.input} />
          </div>
          <button type="submit" className={styles.submitButton}>Create</button>
        </form>
      </div>
    </div>
  );
}
