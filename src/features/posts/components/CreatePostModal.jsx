import React, { useState, useRef } from "react";
import styles from "../styles/CreatePostModal.module.css";
import { useAuth } from "../../../context/AuthContext";

export default function CreatePostModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subredditId, setSubredditId] = useState("");
  const [subredditName, setSubredditName] = useState("");
  const [subredditOptions, setSubredditOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  const handleSubredditInput = async (e) => {
    const value = e.target.value;
    setSubredditName(value);
    setShowDropdown(!!value);
    setSubredditId("");
    if (value.trim().length === 0) {
      setSubredditOptions([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/subreddit/find/?name=${encodeURIComponent(value)}`);
      if (!res.ok) throw new Error("Ошибка поиска сабреддитов");
      const data = await res.json();
      setSubredditOptions(data);
    } catch (err) {
      setSubredditOptions([]);
    }
  };

  const handleSelectSubreddit = (sub) => {
    setSubredditId(sub.id);
    setSubredditName(sub.name);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Для создания поста нужно войти в аккаунт!");
      return;
    }
    if (title.length < 1 || title.length > 300) {
      setError("Заголовок должен быть от 1 до 300 символов");
      return;
    }
    if (content.length > 40000) {
      setError("Содержание не должно превышать 40000 символов");
      return;
    }
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
        throw new Error(data.error || "Error creating post or you are not authorized");
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
        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form} autoComplete="off">
          <div className={styles.formGroup} style={{ position: "relative" }}>
            <label>Subreddit:</label>
            <input
              type="text"
              value={subredditName}
              onChange={handleSubredditInput}
              placeholder="Начните вводить название..."
              className={styles.input}
              autoComplete="off"
              onFocus={() => setShowDropdown(!!subredditName)}
            />
            {showDropdown && subredditOptions.length > 0 && (
              <ul className={styles.dropdown} ref={dropdownRef} style={{ position: "absolute", zIndex: 10, background: "#23272e", width: "100%", maxHeight: 180, overflowY: "auto", borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", margin: 0, padding: 0, listStyle: "none" }}>
                {subredditOptions.map((sub) => (
                  <li
                    key={sub.id}
                    onClick={() => handleSelectSubreddit(sub)}
                    style={{ padding: "8px 12px", cursor: "pointer", color: "#fff" }}
                  >
                    {sub.name} <span style={{ color: "#888", fontSize: 12 }}></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.formGroup}>
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} minLength={1} maxLength={300} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Content:</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={40000} className={styles.textarea} />
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
