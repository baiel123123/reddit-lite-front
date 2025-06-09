import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PostVotes from "../../../components/PostVotes";

export default function PostItem({ post, currentUser, onDelete, onVoteUpdate }) {
  const navigate = useNavigate();
  const isOwner = currentUser?.id === post.user_id;
  const isAdmin = currentUser?.role_id === 2 || currentUser?.role_id === 3;

  const handleDelete = async () => {
    if (!window.confirm("Удалить пост?")) return;
    try {
      const res = await fetch(`http://localhost:8000/posts/delete/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении");
      if (onDelete) onDelete(post.id);
      else navigate("/my-profile");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>

      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p style={{ fontSize: 14, color: "#666" }}>
        Автор: User #{post.user_id} | Создано: {new Date(post.created_at).toLocaleString()} | Subreddit: {post.subreddit_name}
      </p>
      <div style={{ marginRight: "1rem" }}>
        <PostVotes post={post} onVoteUpdate={onVoteUpdate} />
      </div>

      {(isOwner || isAdmin) && (
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
