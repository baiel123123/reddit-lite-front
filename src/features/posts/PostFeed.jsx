import React, { useEffect, useState } from "react";
import PostVotes from "../../components/PostVotes";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/PostFeed.module.css";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("hot");
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPostsAndVotes() {
      try {
        const res = await fetch(
          `http://localhost:8000/posts/lenta/?sort_by=${sortBy}&limit=${limit}&offset=${offset}`,
          { credentials: "include" }
        );
        const postsData = await res.json();
        setPosts(postsData);

        const ids = postsData.map((p) => p.id).join(",");
        const voteRes = await fetch(
          `http://localhost:8000/posts/votes/by-user?ids=${ids}`,
          { credentials: "include" }
        );
        const votes = await voteRes.json();

        const updatedPosts = postsData.map((post) => ({
          ...post,
          user_vote: votes[post.id] ?? null,
        }));

        setPosts(updatedPosts);
      } catch (err) {
        console.error(err);
      }
    }

    loadPostsAndVotes();
  }, [sortBy, offset]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Лента постов</h2>

      <select
        className={styles.sortSelect}
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="hot">Горячее</option>
        <option value="new">Новое</option>
        <option value="top">Топ</option>
      </select>

      {posts.map((post) => (
        <div
          key={post.id}
          className={styles.postItem}
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <h4 className={styles.postTitle}>{post.title}</h4>
          <p className={styles.postContent}>{post.content}</p>
          <div className={styles.postMeta}>
            <span>Автор: {post.user.username}</span>
            <span>
              Subreddit:{" "}
              <Link
                to={`/subreddit/${post.subreddit.id}`}
                className={styles.subredditLink}
                onClick={(e) => e.stopPropagation()}
              >
                {post.subreddit.name}
              </Link>
            </span>
          </div>
          <PostVotes post={post} />
        </div>
      ))}

      <div className={styles.pagination}>
        <button
          onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
          disabled={offset === 0}
        >
          Назад
        </button>
        <button onClick={() => setOffset((prev) => prev + limit)}>Далее</button>
      </div>
    </div>
  );
}
