import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PostItem({ post, currentUser, onDelete }) {
  const navigate = useNavigate();
  const isOwner = currentUser?.id === post.user_id;

  const handleDelete = async () => {
    if (!window.confirm("Удалить пост?")) return;
    try {
      const res = await fetch(`http://localhost:8000/posts/delete/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении");
      if (onDelete) onDelete(post.id);
      else navigate("/profile");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <Link to={`/post/${post.id}`}>
        <h3>{post.title}</h3>
      </Link>
      <p>{post.content}</p>
      <p style={{ color: "gray" }}>Subreddit ID: {post.subreddit_id}</p>

      {isOwner && (
        <div>
          <Link to={`/edit-post/${post.id}`}>
            <button>Редактировать</button>
          </Link>
          <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}
