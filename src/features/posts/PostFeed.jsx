import React, { useEffect, useState, useCallback } from "react";
import PostVotes from "../../components/PostVotes";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/PostFeed.module.css";
import useObserver from "../../hooks/useObserver";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("hot");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const navigate = useNavigate();

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/posts/lenta/?sort_by=${sortBy}&limit=${limit}&offset=${offset}`,
        { credentials: "include" }
      );
      const postsData = await res.json();
      console.log("postsData:", postsData);

      if (postsData.length === 0) {
        setHasMore(false);
        return;
      }

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

      setPosts((prev) => [...prev, ...updatedPosts]);
      setOffset((prev) => prev + limit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [offset, sortBy, loading, hasMore]);

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
  }, [sortBy]);

  useEffect(() => {
    if (offset === 0) loadMorePosts();
  }, [loadMorePosts, offset]);  

  const bottomRef = useObserver(loadMorePosts, hasMore);

  return (
    <div className={styles.container}>

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

      {loading && <p>Загрузка...</p>}
      {!hasMore && <p>Больше постов нет</p>}

      <div ref={bottomRef} style={{ height: "1px" }} />
    </div>
  );
}
