import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles/RecentPostsSidebar.module.css";

function timeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff} sec. ago`;
  if (diff < 3600) return `${Math.floor(diff/60)} min. ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hr. ago`;
  return `${Math.floor(diff/86400)} days ago`;
}

function SubredditIcon({ name }) {
  if (!name) return (
    <div className={styles.subredditIconDefault}>r</div>
  );
  return (
    <div className={styles.subredditIcon}>{name[0].toUpperCase()}</div>
  );
}

export default function RecentPostsSidebar() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setRecent(JSON.parse(localStorage.getItem("recentPosts") || "[]"));
    const handler = () => setRecent(JSON.parse(localStorage.getItem("recentPosts") || "[]"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleClear = () => {
    localStorage.removeItem("recentPosts");
    setRecent([]);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>RECENT POSTS</span>
        <button onClick={handleClear} className={styles.clearBtn}>Clear</button>
      </div>
      {recent.length === 0 ? (
        <div className={styles.noRecent}>Нет недавних постов</div>
      ) : (
        <ul className={styles.list}>
          {recent.map(post => (
            <li key={post.id} className={styles.item}>
              <Link to={`/post/${post.id}`} className={styles.link}>
                <div className={styles.cardRow}>
                  <SubredditIcon name={post.subreddit?.name} />
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span className={styles.subreddit}>r/{post.subreddit?.name}</span>
                      <span className={styles.time}>{timeAgo(post.created_at)}</span>
                    </div>
                    <div className={styles.title2}>{post.title}</div>
                    <div className={styles.meta}>
                      <span>⬆ {post.upvotes}</span>
                      <span>💬 {post.comments_count}</span>
                    </div>
                  </div>
                  {post.image && (
                    <img src={`http://localhost:8000/${post.image}`} alt="" className={styles.thumb} />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 