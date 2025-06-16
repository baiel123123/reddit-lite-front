import React, { useState, useRef, useEffect } from "react";
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.postContainer}>
      <h3 className={styles.postTitle}>{post.title}</h3>
      <p className={styles.postContent}>{post.content}</p>
      <p className={styles.postMeta}>
        Автор: User #{post.user_id} | Создано:{" "}
        {new Date(post.created_at).toLocaleString()} | Subreddit:{" "}
        {post.subreddit_name}
      </p>

      {/* Блок с голосами */}
      <div className={styles.postVotesContainer}>
        <PostVotes post={post} onVoteUpdate={onVoteUpdate} />
      </div>

      {/* Добавляем блок с информацией о комментариях */}
      <div className={styles.commentsInfo}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className={styles.commentIcon}
          viewBox="0 0 16 16"
        >
          <path d="M8 15c-3.866 0-7-2.239-7-5a7 7 0 0 1 7-7 7 7 0 0 1 7 7c0 2.761-3.134 5-7 5zm0-1c2.379 0 4-1.33 4-4A4 4 0 0 0 8 6a4 4 0 0 0-4 4c0 2.67 1.621 4 4 4z" />
          <path d="M4.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
        </svg>
        <span className={styles.commentCount}>{post.comments_count || 0}</span>
      </div>

      {post.image_url && (
        <div className={styles.imageWrapper}>
          <img
            src={`http://localhost:8000/${post.image_url}`}
            alt="Post"
            className={styles.postImage}
          />
        </div>
      )}

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
