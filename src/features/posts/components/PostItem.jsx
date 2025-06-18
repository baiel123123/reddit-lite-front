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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          width="15"
          height="15"
          class="size-6"
          style={{ margin: "0 4px" }} 
        >
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
        </svg>
        <span className={styles.commentCount}>{post.comments_count || 0}</span>
      </p>

      <div className={styles.postVotesContainer}>
        <PostVotes post={post} onVoteUpdate={onVoteUpdate} />
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
