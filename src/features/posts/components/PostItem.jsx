import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostVotes from "../../../components/PostVotes";
import styles from "../styles/PostItem.module.css";

export default function PostItem({ post, currentUser, onDelete, onVoteUpdate }) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

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
    <div className={styles.postContainer}>
      <h3 className={styles.postTitle}>{post.title}</h3>
      <p className={styles.postContent}>{post.content}</p>
      <p className={styles.postMeta}>
        Автор: User #{post.user_id} | Создано: {new Date(post.created_at).toLocaleString()} | Subreddit: {post.subreddit_name}
      </p>
      <div className={styles.postVotesContainer}>
        <PostVotes post={post} onVoteUpdate={onVoteUpdate} />
      </div>

      {(isOwner || isAdmin) && (
        <div className={styles.actionsMenuWrapper} ref={actionsRef}>
          <button
            onClick={() => setShowActions(!showActions)}
            className={styles.actionsMenuButton}
          >
            ⋮
          </button>
          {showActions && (
            <div className={styles.actionsDropdown}>
              <Link to={`/edit-post/${post.id}`}>
                <button className={styles.dropdownButton}>Редактировать</button>
              </Link>
              <button onClick={handleDelete} className={styles.dropdownButton}>
                Удалить
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
